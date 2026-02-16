export default defineNuxtPlugin(() => {
  if (!import.meta.dev)
    return

  const originalFetch = globalThis.fetch

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const startTime = performance.now()
    const method = init?.method?.toUpperCase() || 'GET'
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    const category = categorize(method, url)
    const label = formatLabel(category, method, url)

    let response: Response
    try {
      response = await originalFetch(input, init)
    }
    catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log(`%c${label} %c[DEDUPLICATED]`, 'color: gray', 'color: gray; font-style: italic')
        throw error
      }
      const duration = Math.round(performance.now() - startTime)
      console.groupCollapsed(`%c${label} %c[FAILED] %c${duration}ms`, 'color: #e74c3c; font-weight: bold', 'color: #e74c3c', 'color: gray')
      console.error(error)
      console.groupEnd()
      throw error
    }

    const duration = Math.round(performance.now() - startTime)
    const statusColor = response.status < 300 ? '#2ecc71' : response.status < 500 ? '#f39c12' : '#e74c3c'

    console.groupCollapsed(
      `%c${label} %c${response.status} ${response.statusText} %c${duration}ms`,
      `color: ${statusColor}; font-weight: bold`,
      `color: ${statusColor}`,
      'color: gray',
    )

    console.log('URL:', url)

    if (init?.body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      logRequestBody(init.body, category)
    }

    await logResponsePreview(response)

    console.groupEnd()

    return response
  }
})

function categorize(method: string, url: string): string {
  if (url.includes('/auth-with-password'))
    return 'AUTH'
  if (url.includes('/api/collections/')) {
    if (method === 'GET')
      return 'FETCH'
    if (method === 'POST')
      return 'CREATE'
    if (method === 'PATCH')
      return 'UPDATE'
    if (method === 'DELETE')
      return 'DELETE'
  }
  if (url.includes('/api/'))
    return 'API'
  return 'OTHER'
}

function formatLabel(category: string, method: string, url: string): string {
  const collection = url.match(/\/api\/collections\/([^/?]+)/)?.[1]
  const suffix = collection ? ` (${collection})` : ''
  return `[${category}] ${method}${suffix}`
}

function logRequestBody(body: BodyInit, category: string) {
  try {
    if (typeof body === 'string') {
      const parsed = JSON.parse(body)
      if (category === 'AUTH' && parsed.password) {
        console.log('Body:', { ...parsed, password: '[REDACTED]' })
      }
      else {
        console.log('Body:', parsed)
      }
    }
    else if (body instanceof FormData) {
      const entries: Record<string, string> = {}
      body.forEach((value, key) => {
        entries[key] = value instanceof File ? `[File: ${value.name}]` : String(value)
      })
      console.log('Body (FormData):', entries)
    }
    else {
      console.log('Body:', body)
    }
  }
  catch {
    console.log('Body:', body)
  }
}

async function logResponsePreview(response: Response) {
  try {
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json'))
      return

    const clone = response.clone()
    const text = await clone.text()
    if (text.length > 500) {
      console.log('Response:', `${text.slice(0, 500)}...`)
    }
    else {
      console.log('Response:', JSON.parse(text))
    }
  }
  catch {
    // Response not readable — skip preview
  }
}
