import axios from "axios";

/**
 * Central API client for the LEX SUPERMUS frontend.
 *
 * All demo pages currently render local placeholder data; when a backend
 * endpoint is ready, pages should call through this client instead:
 *
 *   student-service      :8081  /api/students/**, /api/courses/**
 *   advocate-service     :8082  /api/advocates/**, /api/bar-council/**
 *   client-service       :8083  /api/clients/**, /api/consultations/**
 *   legal-library-service:8084  /api/library/**
 *   ai-service           :8085  /api/ai/**
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

export async function getJson<T>(path: string): Promise<T> {
  const { data } = await api.get<T>(path);
  return data;
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const { data } = await api.post<T>(path, body);
  return data;
}
