export async function safeJsonFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON')
    }
    
    const text = await response.text()
    if (!text.trim()) {
      return { data: null, error: 'Empty response' }
    }
    
    try {
      const data = JSON.parse(text)
      return { data, error: null }
    } catch (parseError) {
      return { data: null, error: 'Invalid JSON' }
    }
    
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}