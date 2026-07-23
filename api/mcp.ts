import type { IncomingHttpHeaders } from "node:http";

import { handleAscentMcpRequest } from "../src/ascent/server.js";

interface VercelRequestLike {
  method?: string;
  url?: string;
  headers: IncomingHttpHeaders;
  body?: unknown;
}

interface VercelResponseLike {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponseLike;
  send(body: Buffer): void;
  json(body: unknown): void;
}

export const config = {
  maxDuration: 10,
};

function requestUrl(request: VercelRequestLike): string {
  const forwardedProtocol = request.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProtocol)
    ? forwardedProtocol[0]
    : forwardedProtocol;
  const forwardedHost = request.headers["x-forwarded-host"];
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost ?? request.headers.host ?? "habitbuilding.xyz";
  return `${protocol ?? "https"}://${host}${request.url ?? "/api/mcp"}`;
}

function webHeaders(request: VercelRequestLike): Headers {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(name, item);
    } else if (value !== undefined) {
      headers.set(name, value);
    }
  }
  return headers;
}

function requestBody(request: VercelRequestLike): BodyInit | undefined {
  if (request.method === "GET" || request.method === "HEAD") return undefined;
  if (Buffer.isBuffer(request.body)) return request.body.toString("utf8");
  if (typeof request.body === "string") return request.body;
  if (request.body === undefined) return undefined;
  return JSON.stringify(request.body);
}

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> {
  try {
    const body = requestBody(request);
    const init: RequestInit = {
      method: request.method ?? "POST",
      headers: webHeaders(request),
    };
    if (body !== undefined) init.body = body;
    const webResponse = await handleAscentMcpRequest(
      new Request(requestUrl(request), init),
    );
    webResponse.headers.forEach((value, name) => response.setHeader(name, value));
    const responseBody = Buffer.from(await webResponse.arrayBuffer());
    response.status(webResponse.status).send(responseBody);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected MCP server error.";
    response.status(500).json({
      jsonrpc: "2.0",
      error: { code: -32_603, message },
      id: null,
    });
  }
}
