import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = 'franvegat3'
const GITHUB_REPO = 'handle-onboarding'
const QUEUE_FILE_PATH = 'mnt/outputs/handle-onboarding/queue/pending.json'

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
      completedAt: null,
      error: null,
      formData,
    }
    if (GITHUB_TOKEN) {
      try {
        await addToQueue(submission)
        console.log('Submission added to queue:', submission.id)
      } catch (e) {
        console.error('Queue error:', e)
      }
    } else {
      console.log('No GITHUB_TOKEN. Submission:', JSON.stringify(submission))
    }
    return NextResponse.json({
      success: true,
      message: 'Formulario recibido. El setup comenzara automaticamente.',
      submissionId: submission.id,
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Error procesando el formulario' }, { status: 500 })
  }
}

async function getQueueFile() {
  const apiUrl = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + QUEUE_FILE_PATH
  const resp = await fetch(apiUrl, {
    headers: { Authorization: 'Bearer ' + GITHUB_TOKEN, Accept: 'application/vnd.github.v3+json' },
  })
  if (!resp.ok) return { data: { submissions: [] }, sha: '' }
  const fileData = await resp.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf-8')
  return { data: JSON.parse(content), sha: fileData.sha }
}

async function addToQueue(submission: Record<string, unknown>) {
  const { data, sha } = await getQueueFile()
  ;(data.submissions as unknown[]).push(submission)
  const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
  const apiUrl = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + QUEUE_FILE_PATH
  const body: Record<string, string> = {
    message: 'onboarding: add submission for ' + (submission as {formData: {empresa: string}}).formData.empresa,
    content: newContent,
  }
  if (sha) body.sha = sha
  const resp = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + GITHUB_TOKEN,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!resp.ok) throw new Error('GitHub API error: ' + resp.status)
}
