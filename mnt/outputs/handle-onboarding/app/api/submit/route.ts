import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = 'franvegat3'
const GITHUB_REPO = 'handle-onboarding'
const QUEUE_FILE_PATH = 'queue/pending.json'

// ─── Main API Route ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json()

    if (!formData.empresa || !formData.emailPrefix) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const submission = {
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      completedAt: null as string | null,
      error: null as string | null,
      formData,
    }

    if (GITHUB_TOKEN) {
      try {
        await addToQueue(submission)
        console.log(`✅ Submission ${submission.id} added to queue`)
      } catch (queueError) {
        console.error('Queue write error:', queueError)
        // Don't fail the request — submission is at least logged
      }
    } else {
      console.log('⚠️  No GITHUB_TOKEN set. Logging submission only.')
      console.log(JSON.stringify(submission, null, 2))
    }

    return NextResponse.json({
      success: true,
      message: 'Formulario recibido. El setup comenzará automáticamente.',
      submissionId: submission.id,
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: 'Error procesando el formulario' },
      { status: 500 }
    )
  }
}

// ─── GitHub Queue Helpers ────────────────────────────────────────────────────

async function getQueueFile(): Promise<{ data: QueueFile; sha: string }> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${QUEUE_FILE_PATH}`
  const resp = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!resp.ok) {
    // File doesn't exist yet — return empty queue
    return { data: { submissions: [] }, sha: '' }
  }

  const fileData = await resp.json()

  // fileData.content may be absent or null for empty/large files
  if (!fileData.content) {
    return { data: { submissions: [] }, sha: fileData.sha ?? '' }
  }

  try {
    // GitHub base64-encodes with newlines — strip them before decoding
    const raw = fileData.content.replace(/\n/g, '')
    const content = Buffer.from(raw, 'base64').toString('utf-8')
    return { data: JSON.parse(content), sha: fileData.sha }
  } catch {
    // Corrupted or empty file — start fresh
    return { data: { submissions: [] }, sha: fileData.sha ?? '' }
  }
}

async function addToQueue(submission: Submission) {
  const { data, sha } = await getQueueFile()

  data.submissions.push(submission)

  const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${QUEUE_FILE_PATH}`
  const body: Record<string, string> = {
    message: `onboarding: add submission ${submission.id} for ${submission.formData.empresa}`,
    content: newContent,
  }
  if (sha) body.sha = sha

  const resp = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`GitHub API error: ${resp.status} - ${err}`)
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Submission {
  id: string
  status: string
  submittedAt: string
  completedAt: string | null
  error: string | null
  formData: Record<string, unknown>
}

interface QueueFile {
  submissions: Submission[]
}
