(() => {
  const MAX_FRAGMENT_LENGTH = 12000;
  const fields = [
    "today_intention",
    "distracting_behavior",
    "replacement_behavior",
    "two_minute_fallback",
    "full_action",
    "two_minute_action",
    "first_physical_step",
    "focus_intention",
    "duration_minutes",
    "distracting_apps",
    "pattern_summary",
    "recommendations",
    "next_week_fallback",
    "next_step"
  ];
  const labels = {
    today_intention: "Today’s intention",
    distracting_behavior: "Competing behavior",
    replacement_behavior: "Replacement action",
    two_minute_fallback: "Two-minute fallback",
    full_action: "Full action",
    two_minute_action: "Two-minute action",
    first_physical_step: "First physical step",
    focus_intention: "Focus intention",
    duration_minutes: "Duration",
    distracting_apps: "Apps named for the session",
    pattern_summary: "Pattern",
    recommendations: "Adjustments",
    next_week_fallback: "Next-week fallback",
    next_step: "Next step"
  };
  const titles = {
    attention_plan: "Attention plan",
    two_minute_action: "Two-minute action",
    focus_session: "Focus session to confirm",
    attention_review: "Attention review"
  };
  const status = document.getElementById("status");
  const plan = document.getElementById("plan");
  const planTitle = document.getElementById("plan-title");
  const details = document.getElementById("details");
  const empty = document.getElementById("empty");
  const error = document.getElementById("error");
  const copy = document.getElementById("copy");
  let copyText = "";

  function decodeBase64Url(encoded) {
    const normalized = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function readEnvelope() {
    const fragment = window.location.hash;
    if (!fragment) return null;
    if (!fragment.startsWith("#v1.")) throw new Error("Invalid version");
    const encoded = fragment.slice(4);
    if (encoded.length > MAX_FRAGMENT_LENGTH || !/^[A-Za-z0-9_-]+$/.test(encoded)) {
      throw new Error("Invalid payload");
    }
    const value = JSON.parse(decodeBase64Url(encoded));
    if (
      value.version !== 1 ||
      !Object.hasOwn(titles, value.type) ||
      !value.data ||
      typeof value.data !== "object"
    ) {
      throw new Error("Invalid envelope");
    }
    return value;
  }

  function valueText(key, value) {
    if (key === "duration_minutes") return `${value} minutes`;
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (item && typeof item === "object") return Object.values(item).join(" · ");
        return String(item);
      }).join("; ");
    }
    return String(value);
  }

  function render(envelope) {
    const lines = [titles[envelope.type]];
    planTitle.textContent = titles[envelope.type];
    details.replaceChildren();
    for (const key of fields) {
      const value = envelope.data[key];
      if (value === undefined || value === null || value === "") continue;
      const text = valueText(key, value);
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = labels[key];
      description.textContent = text;
      details.append(term, description);
      lines.push(`${labels[key]}: ${text}`);
    }
    copyText = lines.join("\n");
    plan.hidden = false;
    copy.hidden = false;
    status.textContent =
      envelope.type === "focus_session"
        ? "The focus setup is ready to confirm in Ascent on iPhone."
        : "The plan was decoded locally in this browser.";
  }

  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      copy.textContent = "Copied";
    } catch {
      copy.textContent = "Copy unavailable";
    }
  });

  try {
    const envelope = readEnvelope();
    if (envelope) render(envelope);
    else {
      status.textContent = "No plan was included in this link.";
      empty.hidden = false;
    }
  } catch {
    status.textContent = "This handoff could not be decoded.";
    error.hidden = false;
  }
})();
