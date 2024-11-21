const BASE_URL = process.env. NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/v1'

export async function apiRequest(endpoint: string, method: string, data?: unknown, token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })
    console.log(response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = response.status === 204 ? null : await response.json().catch(() => null)
    return { success: true, data: result ? result : "request completed successfully" }
  } catch (error) {
    if (error instanceof Error && error.message.includes('400')) {
      console.error('API request failed with a 400 error:', error)
      return { success: false, error: 'Bad request. Please check your request parameters.' }
    } else if (error instanceof Error && error.message.includes('401')) {
      console.error('API request failed with a 401 error:', error)
      return { success: false, error: 'Unauthorized. Please authenticate or sign up.' }
    } else {
      console.error('API request failed:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }
    }
  }
}

