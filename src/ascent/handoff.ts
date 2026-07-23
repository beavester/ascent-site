import {
  ASCENT_HANDOFF_BASE_URL,
  type HandoffData,
  type HandoffEnvelope,
  type HandoffType,
} from "./contracts.js";

const MAX_FRAGMENT_LENGTH = 12_000;

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

export function stableHandoffId(prefix: string, value: unknown): string {
  const text = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${prefix}_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createHandoffUrl(
  type: HandoffType,
  data: HandoffData,
): string {
  const envelope: HandoffEnvelope = { version: 1, type, data };
  const encoded = Buffer.from(JSON.stringify(envelope), "utf8").toString(
    "base64url",
  );
  if (encoded.length > MAX_FRAGMENT_LENGTH) {
    throw new Error("Ascent handoff is too large.");
  }
  return `${ASCENT_HANDOFF_BASE_URL}#v1.${encoded}`;
}

export function decodeHandoffFragment(fragment: string): HandoffEnvelope {
  if (!fragment.startsWith("#v1.")) {
    throw new Error("Invalid Ascent handoff.");
  }
  const encoded = fragment.slice(4);
  if (encoded.length > MAX_FRAGMENT_LENGTH) {
    throw new Error("Ascent handoff is too large.");
  }
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) {
    throw new Error("Invalid Ascent handoff.");
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as Partial<HandoffEnvelope>;
    if (
      parsed.version !== 1 ||
      ![
        "attention_plan",
        "two_minute_action",
        "focus_session",
        "attention_review",
      ].includes(parsed.type ?? "") ||
      parsed.data === null ||
      typeof parsed.data !== "object"
    ) {
      throw new Error("Invalid envelope.");
    }
    return parsed as HandoffEnvelope;
  } catch {
    throw new Error("Invalid Ascent handoff.");
  }
}
