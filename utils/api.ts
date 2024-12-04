const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/v1';

export async function apiRequest(endpoint: string, method: string, data?: unknown, token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requUrl = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(requUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      try {
        const userId = localStorage.getItem('userId');
        const refreshToken = localStorage.getItem('refreshToken');

        const refreshResponse = await apiRequest('/auth/refresh-token', 'POST', {
          userId,
          refreshToken,
        });

        if (refreshResponse.success && refreshResponse.data) {
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

          // Retry the original request with the new token
          return await apiRequest(endpoint, method, data, refreshResponse.data.accessToken);
        } else {
          return {
            success: false,
            error: 'Unauthorized. Please authenticate or sign up.',
          };
        }
      } catch (error) {
        console.log('Failed to refresh token:', error);
        return {
          success: false,
          error: 'Unauthorized. Please authenticate or sign up.',
        };
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.status === 204 ? null : await response.json().catch(() => null);
    return { success: true, data: result ? result : 'request completed successfully' };
  } catch (error) {
    if (error instanceof Error && error.message.includes('400')) {
      console.error('API request failed with a 400 error:', error);
      return { success: false, error: 'Bad request. Please check your request parameters.' };
    } else if (error instanceof Error && error.message.includes('401')) {
      console.error('API request failed with a 401 error:', error);
      return { success: false, error: 'Unauthorized. Please authenticate or sign up.' };
    } else {
      console.error('API request failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }
}
