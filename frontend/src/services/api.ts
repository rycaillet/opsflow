const API_BASE_URL = "http://localhost:5001/api";

type RequestOptions = RequestInit & {
  token?: string;
};

type ApiErrorResponse = {
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = "API request failed.";

    try {
      const errorData = (await response.json()) as ApiErrorResponse;

      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // Keep the fallback message if the server did not return JSON.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}