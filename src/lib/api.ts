import { fetchAuthSession } from 'aws-amplify/auth';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_ENDPOINT || '';
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      return token || null;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<{ data?: T; error?: any }> {
    try {
      const authToken = await this.getAuthToken();
      const url = `${this.baseURL}${endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data: data as T };
    } catch (error) {
      console.error('API request failed:', error);
      return { error };
    }
  }

  async get<T>(endpoint: string): Promise<{ data?: T; error?: any }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<{ data?: T; error?: any }> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any): Promise<{ data?: T; error?: any }> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async delete<T>(endpoint: string): Promise<{ data?: T; error?: any }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: any): Promise<{ data?: T; error?: any }> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }
}

export { APIClient };
export default new APIClient();
