const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Base fetch function with authentication
const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Handle 401 errors by clearing token
  if (response.status === 401) {
    removeAuthToken();
    window.location.href = '/';
  }
  
  return response;
};

// API response wrapper
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export { API_BASE_URL, getAuthToken, setAuthToken, removeAuthToken, apiFetch, handleResponse }; 