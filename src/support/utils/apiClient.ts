import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { ICustomWorld } from "../../world";
import { baseUrl } from "./utilityFunctions";
export type QueryParams = Record<string, string | number | boolean> | URLSearchParams;
export interface RequestOptions {
  params?: QueryParams;
  headers?: Record<string, string>;
  data?: unknown; // body for POST/PUT
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}
export interface ApiResult<T = unknown> {
  response: APIResponse; // status, headers, raw body
  body: T; // parsed JSON, or the raw text when not JSON
}
/**
 * The context is shared within a scenario, so it is stored as a promise rather than the resolved
 * value: two steps running concurrently must not each build a context and orphan one of them.
 */
let contextPromise: Promise<APIRequestContext> | undefined;
export function getApiContext(): Promise<APIRequestContext> {
  contextPromise ??= request.newContext({ baseURL: baseUrl() });
  return contextPromise;
}

/**
 * The context for the running scenario, read from the world the `Before` hook filled in. Callers
 * that hold a world should use this rather than `getApiContext()` so the scenario owns its context
 * for the whole run; `getApiContext()` is the fallback for code that runs outside a scenario.
 */
export async function apiContextFor(world: Pick<ICustomWorld, 'request'>): Promise<APIRequestContext> {
  return world.request ?? getApiContext();
}

/**
 * Releases the scenario's context after its assertions have finished. The world may keep a
 * reference to an `APIResponse` that requires the owning context to remain alive until then.
 */
export async function disposeApiContext(): Promise<void> {
  const pending = contextPromise;
  contextPromise = undefined;
  await (await pending)?.dispose();
}
/** Pure request: no world access. Use when the body is needed for extraction or file writes. */
export async function sendRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const { method = 'GET', params, headers, data } = options;
  const context = await getApiContext();
  const response = await context.fetch(endpoint, { method, params, headers, data });
  const text = await response.text();
  let body: T;
  try {
    body = JSON.parse(text) as T;
  } catch {
    body = text as unknown as T;
  }
  return { response, body };
}

/** Convenience for the common case: request and store into the world in one line */
export async function requestAndStore<T = unknown>(
  world: ICustomWorld,
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const result = await sendRequest<T>(endpoint, options);
  world.responseBody = result.response;
  world.response = result.body;
  world.responseText = typeof result.body === 'string' ? result.body : undefined;
  return result;
}