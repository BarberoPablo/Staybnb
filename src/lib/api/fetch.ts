const validateResponse = async (response: Response) => {
  const isJson = response.headers.get("Content-Type")?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (response.ok) return body;

  throw {
    status: response.status,
    message: typeof body === "string" ? body : body?.error || "Unexpected error",
  };
};

const request = async (method: string, input: RequestInfo, data?: unknown, init?: RequestInit) => {
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
  get: (input: RequestInfo, init?: RequestInit) => request("GET", input, undefined, init),
  post: (input: RequestInfo, data?: unknown, init?: RequestInit) => request("POST", input, data, init),
  patch: (input: RequestInfo, data?: unknown, init?: RequestInit) => request("PATCH", input, data, init),
  put: (input: RequestInfo, data?: unknown, init?: RequestInit) => request("PUT", input, data, init),
  del: (input: RequestInfo, init?: RequestInit) => request("DELETE", input, undefined, init),
};

export default customFetch;
