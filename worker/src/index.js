// Cloudflare Worker: receives feedback submissions from the Aditzak app and
// forwards them to FEEDBACK_TO_EMAIL via the Resend API. No storage — each
// submission is just relayed as an email. See
// docs/CLOUDFLARE_FEEDBACK_WORKER.md for setup.

const MAX_MESSAGE_LENGTH = 2000
const MAX_EMAIL_LENGTH = 320
const MAX_CONTEXT_LENGTH = 500

// `diagnostics` is the optional payload attached by the app's "report a
// problem with this question" flow (see `buildFlagDiagnostics` in
// src/lessonLogic.js) — a fixed-shape snapshot of the question, so capped
// well above any realistic size while still rejecting anything pathological.
const MAX_DIAGNOSTICS_LENGTH = 4000

const DIAGNOSTICS_STRING_FIELDS = ['lessonId', 'verbId', 'tense', 'person', 'kind', 'correct', 'outcome', 'language', 'timestamp']
const DIAGNOSTICS_KEYS = new Set([...DIAGNOSTICS_STRING_FIELDS, 'review', 'userAnswer', 'question'])
const QUESTION_KEYS = new Set(['sentence', 'options', 'items'])

const JSON_HEADERS = { 'content-type': 'application/json' }

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Mirrors the shape `buildFlagDiagnostics` produces — rejects anything with
// unknown keys, wrong types, or an oversized `question` sub-object, so a
// malformed/forged request can't smuggle arbitrary data into the relayed
// email.
function isValidDiagnostics(diagnostics) {
  if (!isPlainObject(diagnostics)) return false
  if (JSON.stringify(diagnostics).length > MAX_DIAGNOSTICS_LENGTH) return false
  if (!Object.keys(diagnostics).every((key) => DIAGNOSTICS_KEYS.has(key))) return false
  if (!DIAGNOSTICS_STRING_FIELDS.every((field) => typeof diagnostics[field] === 'string')) return false
  if (typeof diagnostics.review !== 'boolean') return false
  if (diagnostics.userAnswer !== null && typeof diagnostics.userAnswer !== 'string') return false

  const question = diagnostics.question
  if (!isPlainObject(question)) return false
  if (!Object.keys(question).every((key) => QUESTION_KEYS.has(key))) return false
  if (question.sentence !== undefined && typeof question.sentence !== 'string') return false
  if (question.options !== undefined && !(Array.isArray(question.options) && question.options.every((option) => typeof option === 'string'))) return false
  if (question.items !== undefined) {
    if (!Array.isArray(question.items)) return false
    if (!question.items.every((item) => isPlainObject(item) && typeof item.person === 'string' && typeof item.sentence === 'string')) return false
  }

  return true
}

// Formats `diagnostics` into a labeled block appended to the relayed email
// body, so a flagged question can be inspected/reproduced without the
// reporter having to describe it themselves.
function formatDiagnostics(diagnostics) {
  const lines = [
    '--- Flagged question ---',
    `Lesson: ${diagnostics.lessonId}${diagnostics.review ? ' (review)' : ''}`,
    `Verb / tense / person: ${diagnostics.verbId} / ${diagnostics.tense} / ${diagnostics.person}`,
    `Kind: ${diagnostics.kind}`,
    `Correct answer: ${diagnostics.correct}`,
    `User answer: ${diagnostics.userAnswer ?? '(none)'}`,
    `Outcome: ${diagnostics.outcome}`,
    `Language: ${diagnostics.language}`,
    `Timestamp: ${diagnostics.timestamp}`,
  ]
  if (diagnostics.question.sentence) lines.push(`Sentence: ${diagnostics.question.sentence}`)
  if (diagnostics.question.options) lines.push(`Options: ${diagnostics.question.options.join(', ')}`)
  if (diagnostics.question.items) {
    lines.push('Items:')
    for (const item of diagnostics.question.items) lines.push(`  ${item.person}: ${item.sentence}`)
  }
  return lines
}

function corsHeaders(origin, allowedOrigin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (origin && origin === allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
  }
  return headers
}

function jsonResponse(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...cors },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, cors)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, cors)
    }

    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const hasDiagnostics = body.diagnostics !== undefined

    if (hasDiagnostics && !isValidDiagnostics(body.diagnostics)) {
      return jsonResponse({ error: 'diagnostics is invalid' }, 400, cors)
    }

    // A question-flag report's `message` is an optional comment on top of
    // `diagnostics`, so it may be empty — but a regular feedback submission
    // (no `diagnostics`) still requires non-empty text. Either way it's
    // capped at MAX_MESSAGE_LENGTH.
    if (!hasDiagnostics && !message) {
      return jsonResponse({ error: `message is required (1-${MAX_MESSAGE_LENGTH} chars)` }, 400, cors)
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse({ error: `message must be at most ${MAX_MESSAGE_LENGTH} chars` }, 400, cors)
    }

    const email = typeof body.email === 'string' ? body.email.trim().slice(0, MAX_EMAIL_LENGTH) : ''
    const context = typeof body.context === 'string' ? body.context.trim().slice(0, MAX_CONTEXT_LENGTH) : ''

    const lines = []
    if (message) lines.push(message, '')
    lines.push(`From: ${email || '(not provided)'}`)
    if (context) lines.push(`Context: ${context}`)
    if (hasDiagnostics) lines.push('', ...formatDiagnostics(body.diagnostics))

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FEEDBACK_FROM_EMAIL,
        to: env.FEEDBACK_TO_EMAIL,
        reply_to: email || undefined,
        subject: hasDiagnostics ? 'Aditzak question flag' : 'Aditzak feedback',
        text: lines.join('\n'),
      }),
    })

    if (!resendResponse.ok) {
      console.error('Resend error', resendResponse.status, await resendResponse.text())
      return jsonResponse({ error: 'Failed to send feedback' }, 502, cors)
    }

    return jsonResponse({ ok: true }, 200, cors)
  },
}
