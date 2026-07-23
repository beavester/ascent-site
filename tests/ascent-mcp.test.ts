import test from "node:test";
import assert from "node:assert/strict";

import {
  ASCENT_APP_INSTRUCTIONS,
  ASCENT_TOOL_DEFINITIONS,
  ASCENT_UI_RESOURCE_URI,
} from "../src/ascent/tool-definitions.js";
import { ASCENT_COMPONENT_HTML } from "../src/ascent/component.js";
import { handleAscentMcpRequest } from "../src/ascent/server.js";

const expectedTools = [
  "ascent_create_attention_plan",
  "ascent_create_two_minute_action",
  "ascent_start_focus",
  "ascent_review_attention",
];

function mcpRequest(method: string, params: object = {}, id = 1): Request {
  return new Request("https://habitbuilding.xyz/api/mcp", {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "mcp-protocol-version": "2025-11-25",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
}

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /application\/json/);
  return (await response.json()) as Record<string, unknown>;
}

test("MCP definitions expose exactly four precise, anonymous tools", () => {
  assert.deepEqual(
    ASCENT_TOOL_DEFINITIONS.map((definition) => definition.name),
    expectedTools,
  );
  assert.match(ASCENT_APP_INSTRUCTIONS, /^Use Ascent when/);
  assert.match(ASCENT_APP_INSTRUCTIONS, /Do not use Ascent when/);

  for (const definition of ASCENT_TOOL_DEFINITIONS) {
    assert.match(definition.description, /^Use this when/);
    assert.match(definition.description, /Do not use/);
    assert.equal(definition.annotations.readOnlyHint, true);
    assert.equal(definition.annotations.destructiveHint, false);
    assert.equal(definition.annotations.idempotentHint, true);
    assert.equal(definition.annotations.openWorldHint, false);
    assert.deepEqual(definition.securitySchemes, [{ type: "noauth" }]);
    assert.equal(definition.resourceUri, ASCENT_UI_RESOURCE_URI);
    assert.equal(definition.inputSchema.safeParse({}).success, false);
  }
});

test("MCP component is accessible, standard-aware, and first-party only", () => {
  assert.match(ASCENT_COMPONENT_HTML, /Open Ascent handoff/);
  assert.match(ASCENT_COMPONENT_HTML, /ui\/initialize/);
  assert.match(ASCENT_COMPONENT_HTML, /ui\/notifications\/tool-result/);
  assert.match(ASCENT_COMPONENT_HTML, /ui\/open-link/);
  assert.match(ASCENT_COMPONENT_HTML, /structuredContent/);
  assert.match(ASCENT_COMPONENT_HTML, /https:\/\/habitbuilding\.xyz\/ascent\/handoff\//);
  assert.doesNotMatch(ASCENT_COMPONENT_HTML, /<script[^>]+src=/i);
  assert.doesNotMatch(ASCENT_COMPONENT_HTML, /https?:\/\/(?!habitbuilding\.xyz)/);
  assert.doesNotMatch(ASCENT_COMPONENT_HTML, /localStorage|sessionStorage|document\.cookie/);
});

test("MCP initialize advertises Ascent server metadata", async () => {
  const json = await responseJson(
    await handleAscentMcpRequest(
      mcpRequest("initialize", {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "ascent-contract-test", version: "1.0.0" },
      }),
    ),
  );
  const result = json.result as Record<string, unknown>;
  assert.deepEqual(result.serverInfo, {
    name: "ascent-mcp-server",
    version: "1.0.0",
  });
  assert.equal(result.instructions, ASCENT_APP_INSTRUCTIONS);
});

test("MCP tools/list publishes output schemas, annotations, and UI metadata", async () => {
  const json = await responseJson(
    await handleAscentMcpRequest(mcpRequest("tools/list")),
  );
  const result = json.result as { tools: Array<Record<string, unknown>> };

  assert.deepEqual(
    result.tools.map((tool) => tool.name),
    expectedTools,
  );
  for (const tool of result.tools) {
    assert.equal((tool.inputSchema as { additionalProperties?: boolean }).additionalProperties, false);
    assert.equal((tool.outputSchema as { additionalProperties?: boolean }).additionalProperties, false);
    assert.deepEqual(tool.annotations, {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
    const meta = tool._meta as Record<string, unknown> & {
      ui: { resourceUri: string };
    };
    assert.equal(meta.ui.resourceUri, ASCENT_UI_RESOURCE_URI);
    assert.equal(meta["openai/outputTemplate"], ASCENT_UI_RESOURCE_URI);
    assert.deepEqual(meta.securitySchemes, [{ type: "noauth" }]);
  }
});

test("MCP attention plan returns structured content and fragment handoff", async () => {
  const json = await responseJson(
    await handleAscentMcpRequest(
      mcpRequest("tools/call", {
        name: "ascent_create_attention_plan",
        arguments: {
          goal: "study for biology",
          distracting_behavior: "open Reddit",
          available_minutes: 30,
        },
      }),
    ),
  );
  const result = json.result as {
    structuredContent: Record<string, unknown>;
    content: Array<{ type: string; text: string }>;
  };

  assert.equal(result.structuredContent.status, "ready");
  assert.equal(result.structuredContent.product_name, "Ascent: Habit Builder & Focus");
  assert.match(
    String(result.structuredContent.handoff_url),
    /^https:\/\/habitbuilding\.xyz\/ascent\/handoff\/#v1\./,
  );
  assert.match(result.content[0]?.text ?? "", /Ascent attention plan ready/);
});

test("MCP focus tool reports handoff_required, not a started session", async () => {
  const json = await responseJson(
    await handleAscentMcpRequest(
      mcpRequest("tools/call", {
        name: "ascent_start_focus",
        arguments: {
          goal: "write the introduction",
          duration_minutes: 60,
          distracting_apps: ["Reddit"],
        },
      }),
    ),
  );
  const result = json.result as {
    structuredContent: Record<string, unknown>;
  };
  assert.equal(result.structuredContent.status, "handoff_required");
  assert.match(String(result.structuredContent.device_action), /has not started/i);
});

test("MCP resource returns a versioned MCP Apps document", async () => {
  const json = await responseJson(
    await handleAscentMcpRequest(
      mcpRequest("resources/read", { uri: ASCENT_UI_RESOURCE_URI }),
    ),
  );
  const result = json.result as {
    contents: Array<{
      uri: string;
      mimeType: string;
      text: string;
      _meta: { ui: { prefersBorder: boolean; csp: object } };
    }>;
  };
  const resource = result.contents[0];
  assert.equal(resource?.uri, ASCENT_UI_RESOURCE_URI);
  assert.equal(resource?.mimeType, "text/html;profile=mcp-app");
  assert.equal(resource?._meta.ui.prefersBorder, true);
  assert.deepEqual(resource?._meta.ui.csp, {
    connectDomains: [],
    resourceDomains: [],
  });
});

test("MCP GET has a protocol response and never returns the old 404", async () => {
  const response = await handleAscentMcpRequest(
    new Request("https://habitbuilding.xyz/api/mcp", { method: "GET" }),
  );
  assert.notEqual(response.status, 404);
  assert.ok([400, 405].includes(response.status));
});
