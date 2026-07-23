import assert from "node:assert/strict";

import { handleAscentMcpRequest } from "../src/ascent/server.js";
import { ASCENT_UI_RESOURCE_URI } from "../src/ascent/tool-definitions.js";

const endpoint =
  process.env.MCP_URL?.trim() || "https://habitbuilding.xyz/api/mcp";
const remote = Boolean(process.env.MCP_URL?.trim());
let requestId = 0;

interface RpcResponse {
  jsonrpc: string;
  id?: number | null;
  result?: Record<string, unknown>;
  error?: { code: number; message: string };
}

async function send(request: Request): Promise<Response> {
  return remote ? fetch(request) : handleAscentMcpRequest(request);
}

async function rpc(
  method: string,
  params: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  requestId += 1;
  const response = await send(
    new Request(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
        "mcp-protocol-version": "2025-11-25",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: requestId,
        method,
        params,
      }),
    }),
  );
  const body = (await response.json()) as RpcResponse;
  assert.equal(
    response.status,
    200,
    `${method} returned HTTP ${response.status}: ${JSON.stringify(body)}`,
  );
  assert.equal(body.jsonrpc, "2.0");
  assert.equal(body.error, undefined, `${method}: ${body.error?.message}`);
  assert.ok(body.result, `${method} returned no result`);
  return body.result;
}

function structuredResult(result: Record<string, unknown>): Record<string, unknown> {
  const value = result.structuredContent;
  assert.ok(value && typeof value === "object" && !Array.isArray(value));
  return value as Record<string, unknown>;
}

const methodResponse = await send(new Request(endpoint, { method: "GET" }));
assert.equal(methodResponse.status, 405);

const initialized = await rpc("initialize", {
  protocolVersion: "2025-11-25",
  capabilities: {},
  clientInfo: { name: "ascent-release-verifier", version: "1.0.0" },
});
assert.deepEqual(initialized.serverInfo, {
  name: "ascent-mcp-server",
  version: "1.0.0",
});

const listed = await rpc("tools/list");
const tools = listed.tools as Array<{ name: string }>;
assert.deepEqual(
  tools.map((tool) => tool.name),
  [
    "ascent_create_attention_plan",
    "ascent_create_two_minute_action",
    "ascent_start_focus",
    "ascent_review_attention",
  ],
);

const calls = [
  {
    name: "ascent_create_attention_plan",
    arguments: {
      goal: "study biology",
      distracting_behavior: "open Reddit",
      available_minutes: 30,
    },
    status: "ready",
  },
  {
    name: "ascent_create_two_minute_action",
    arguments: {
      action: "clean my kitchen",
      obstacle: "I cannot get started",
    },
    status: "ready",
  },
  {
    name: "ascent_start_focus",
    arguments: {
      goal: "write my introduction",
      duration_minutes: 60,
      distracting_apps: ["Reddit"],
    },
    status: "handoff_required",
  },
  {
    name: "ascent_review_attention",
    arguments: {
      completed_actions: 3,
      planned_actions: 7,
      focus_sessions: 2,
      total_focus_minutes: 50,
      distraction_openings: 41,
      motivation_battery_avg: 38,
    },
    status: "ready",
  },
] as const;

for (const call of calls) {
  const output = structuredResult(
    await rpc("tools/call", {
      name: call.name,
      arguments: call.arguments,
    }),
  );
  assert.equal(output.status, call.status);
  assert.equal(output.product_name, "Ascent: Habit Builder & Focus");
  assert.match(
    String(output.handoff_url),
    /^https:\/\/habitbuilding\.xyz\/ascent\/handoff\/#v1\./,
  );
}

const focus = structuredResult(
  await rpc("tools/call", {
    name: "ascent_start_focus",
    arguments: {
      goal: "read",
      duration_minutes: 25,
    },
  }),
);
assert.match(String(focus.device_action), /has not started/i);

const resource = await rpc("resources/read", {
  uri: ASCENT_UI_RESOURCE_URI,
});
const contents = resource.contents as Array<{
  uri: string;
  mimeType: string;
  text: string;
}>;
assert.equal(contents[0]?.uri, ASCENT_UI_RESOURCE_URI);
assert.equal(contents[0]?.mimeType, "text/html;profile=mcp-app");
assert.match(contents[0]?.text ?? "", /Open Ascent handoff/);

console.log(
  `Verified ${remote ? "deployed" : "local"} Ascent MCP endpoint: four tools, five calls, and one UI resource.`,
);
