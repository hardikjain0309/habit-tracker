// Thin fetch wrapper for JSON APIs. All HTTP methods funnel through `request`,
// which is where request/response interceptors (auth header, token refresh) will hook in.

/** Field-level messages from the backend ValidationPipe, keyed by request property. */
export type ValidationErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly validationErrors?: ValidationErrors;

  constructor(status: number, message: string, validationErrors?: ValidationErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const GENERIC_ERROR = "Something went wrong. Please try again.";

async function toApiError(response: Response): Promise<ApiError> {
  const data = (await response.json().catch(() => undefined)) as
    | { message?: string | string[]; validationErrors?: ValidationErrors }
    | undefined;
  const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
  // Server-side failures don't carry user-meaningful messages.
  const userMessage = response.status >= 500 || !message ? GENERIC_ERROR : message;
  return new ApiError(response.status, userMessage, data?.validationErrors);
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json", ...options.headers };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Unable to reach the server. Check your connection and try again.");
  }

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json().catch(() => undefined)) as T;
}

export function post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>("POST", path, body, options);
}
