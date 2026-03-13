import type { paths } from "@/types/api";
import createClient from "openapi-fetch";

export const apiClient = createClient<paths>({
  baseUrl: process.env.BACKEND_URL,
  cache: "no-cache",
});
