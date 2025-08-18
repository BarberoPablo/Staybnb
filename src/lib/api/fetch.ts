class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const validateResponse = async <T>(response: Response): Promise<CustomFetchResponse<T>> => {
  const isJson = response.headers.get("Content-Type")?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (response.ok) {
    return {
      success: true,
      status: response.status,
      data: isJson ? (body.data as T) : (body as T),
    };
  }

  const message = typeof body === "string" ? body : body?.error || "Unexpected error";
  throw new ApiError(message, response.status);
};

const request = async <T>(method: string, input: RequestInfo, data?: unknown, init?: RequestInit): Promise<CustomFetchResponse<T>> => {
  const fetchInit: RequestInit = {
    method,
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  const res = await fetch(input, fetchInit);
  return await validateResponse(res);
};

const customFetch = {
  get: <T>(input: RequestInfo, init?: RequestInit) => request<T>("GET", input, undefined, init),
  post: <T>(input: RequestInfo, data?: unknown, init?: RequestInit) => request<T>("POST", input, data, init),
  patch: (input: RequestInfo, data?: unknown, init?: RequestInit) => request("PATCH", input, data, init),
  put: (input: RequestInfo, data?: unknown, init?: RequestInit) => request("PUT", input, data, init),
  del: (input: RequestInfo, init?: RequestInit) => request("DELETE", input, undefined, init),
};

export default customFetch;

export type CustomFetchResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  status?: number;
  code?: string;
  error?: string;
};
