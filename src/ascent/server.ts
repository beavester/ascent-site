import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { z } from "zod/v4";

import { ASCENT_COMPONENT_HTML } from "./component.js";
import {
  ASCENT_APP_INSTRUCTIONS,
  ASCENT_TOOL_DEFINITIONS,
  ASCENT_UI_RESOURCE_URI,
} from "./tool-definitions.js";

const MAX_REQUEST_BYTES = 65_536;

type AscentToolDefinition = (typeof ASCENT_TOOL_DEFINITIONS)[number];

function registerDefinition(
  server: McpServer,
  definition: AscentToolDefinition,
): void {
  registerAppTool(
    server,
    definition.name,
    {
      title: definition.title,
      description: definition.description,
      inputSchema: definition.inputSchema,
      outputSchema: definition.outputSchema,
      annotations: definition.annotations,
      _meta: definition.meta,
    },
    async (unparsed: unknown) => {
      const input = definition.inputSchema.parse(unparsed) as never;
      const output = definition.execute(input) as z.output<
        typeof definition.outputSchema
      >;
      return {
        content: [
          {
            type: "text" as const,
            text: `${definition.title.replace(/^Create an |^Create a |^Prepare an |^Review an /, "Ascent ")} ready. Continue at ${output.handoff_url}`,
          },
        ],
        structuredContent: output,
      };
    },
  );
}

export function createAscentMcpServer(): McpServer {
  const server = new McpServer(
    { name: "ascent-mcp-server", version: "1.0.0" },
    { instructions: ASCENT_APP_INSTRUCTIONS },
  );

  for (const definition of ASCENT_TOOL_DEFINITIONS) {
    registerDefinition(server, definition);
  }

  registerAppResource(
    server,
    "Ascent handoff",
    ASCENT_UI_RESOURCE_URI,
    {
      description:
        "A compact, accessible summary of an Ascent plan with a first-party iPhone handoff.",
      mimeType: RESOURCE_MIME_TYPE,
      _meta: {
        ui: {
          prefersBorder: true,
          csp: {
            connectDomains: [],
            resourceDomains: [],
          },
        },
      },
    },
    async () => ({
      contents: [
        {
          uri: ASCENT_UI_RESOURCE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: ASCENT_COMPONENT_HTML,
          _meta: {
            ui: {
              prefersBorder: true,
              csp: {
                connectDomains: [],
                resourceDomains: [],
              },
            },
          },
        },
      ],
    }),
  );

  return server;
}

function protocolError(status: number, code: number, message: string): Response {
  return Response.json(
    {
      jsonrpc: "2.0",
      error: { code, message },
      id: null,
    },
    {
      status,
      headers: {
        "access-control-allow-origin": "*",
        allow: "POST, OPTIONS",
        "cache-control": "no-store",
      },
    },
  );
}

function withTransportHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set(
    "access-control-allow-headers",
    "content-type, accept, mcp-protocol-version, mcp-session-id, last-event-id",
  );
  headers.set(
    "access-control-expose-headers",
    "mcp-protocol-version, mcp-session-id",
  );
  headers.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function handleAscentMcpRequest(
  request: Request,
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers":
          "content-type, accept, mcp-protocol-version, mcp-session-id, last-event-id",
        "access-control-max-age": "86400",
        allow: "POST, OPTIONS",
      },
    });
  }
  if (request.method !== "POST") {
    return protocolError(
      405,
      -32_000,
      "Method not allowed. This stateless MCP endpoint accepts POST requests.",
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return protocolError(413, -32_600, "MCP request body is too large.");
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
  });
  const server = createAscentMcpServer();
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  return withTransportHeaders(response);
}
