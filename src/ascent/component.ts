export const ASCENT_COMPONENT_HTML = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Ascent handoff</title>
  <style>
    :root{color-scheme:light;--paper:#fbf8f2;--ink:#243027;--muted:#59645c;--line:#d8d5cc;--accent:#45644f;--accent-dark:#304c3a}
    *{box-sizing:border-box}
    body{margin:0;padding:16px;background:var(--paper);color:var(--ink);font:15px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    main{max-width:680px;margin:0 auto}
    .eyebrow{margin:0 0 4px;color:var(--accent-dark);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
    h1{margin:0;font:700 24px/1.18 ui-serif,Georgia,serif}
    #summary{margin:8px 0 0;color:var(--muted)}
    dl{display:grid;grid-template-columns:minmax(120px,.45fr) 1fr;gap:8px 16px;margin:18px 0;padding:14px 0;border-block:1px solid var(--line)}
    dt{font-weight:700}
    dd{margin:0;overflow-wrap:anywhere}
    .button{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:10px 16px;border:1px solid var(--accent-dark);border-radius:7px;background:var(--accent-dark);color:#fff;text-decoration:none;font-weight:700}
    .button[aria-disabled="true"]{cursor:not-allowed;opacity:.62}
    .note{margin:12px 0 0;color:var(--muted);font-size:13px}
    @media(max-width:480px){body{padding:14px}dl{grid-template-columns:1fr;gap:2px}dd+dt{margin-top:9px}}
  </style>
</head>
<body>
  <main>
    <p class="eyebrow">Ascent: Habit Builder &amp; Focus</p>
    <h1 id="title">Your Ascent handoff</h1>
    <p id="summary" role="status" aria-live="polite">Preparing the plan details…</p>
    <dl id="details" hidden></dl>
    <a id="handoff" class="button" href="https://habitbuilding.xyz/ascent/handoff/" target="_blank" rel="noopener" aria-disabled="true">Open Ascent handoff</a>
    <p class="note">Opening the handoff does not start device blocking. You confirm device actions in Ascent on iPhone.</p>
  </main>
  <script>
    (() => {
      const HANDOFF_ORIGIN = "https://habitbuilding.xyz";
      const HANDOFF_PATH = "/ascent/handoff/";
      const title = document.getElementById("title");
      const summary = document.getElementById("summary");
      const details = document.getElementById("details");
      const handoff = document.getElementById("handoff");
      let connected = false;
      let handoffUrl = "";
      let requestId = 1;

      const labelFor = (key) => key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
      const textFor = (value) => {
        if (Array.isArray(value)) {
          return value.map((item) => typeof item === "object" ? Object.values(item).join(" · ") : String(item)).join("; ");
        }
        return String(value);
      };
      const safeHandoff = (value) => {
        try {
          const url = new URL(String(value));
          return url.origin === HANDOFF_ORIGIN && url.pathname === HANDOFF_PATH && url.hash.startsWith("#v1.") ? url.href : "";
        } catch {
          return "";
        }
      };
      const render = (content) => {
        if (!content || typeof content !== "object") return;
        handoffUrl = safeHandoff(content.handoff_url);
        const isFocus = content.status === "handoff_required";
        title.textContent = isFocus ? "Focus session ready to confirm" : "Your Ascent plan is ready";
        summary.textContent = isFocus
          ? "Continue on iPhone to confirm the session and any app restrictions."
          : "Review the plan, then continue with Ascent on iPhone.";
        const visibleKeys = [
          "today_intention",
          "two_minute_action",
          "two_minute_fallback",
          "focus_intention",
          "duration_minutes",
          "pattern_summary",
          "next_week_fallback"
        ];
        details.replaceChildren();
        for (const key of visibleKeys) {
          if (content[key] === undefined) continue;
          const term = document.createElement("dt");
          const description = document.createElement("dd");
          term.textContent = labelFor(key);
          description.textContent = textFor(content[key]);
          details.append(term, description);
        }
        details.hidden = details.children.length === 0;
        handoff.setAttribute("aria-disabled", String(!handoffUrl));
        if (handoffUrl) handoff.href = handoffUrl;
      };
      const send = (message) => window.parent.postMessage(message, "*");

      window.addEventListener("message", (event) => {
        const message = event.data;
        if (!message || message.jsonrpc !== "2.0") return;
        if (message.id === 1 && message.result) {
          connected = true;
          send({ jsonrpc: "2.0", method: "ui/notifications/initialized" });
          return;
        }
        if (message.method === "ui/notifications/tool-result") {
          render(message.params && message.params.structuredContent);
        }
      });

      handoff.addEventListener("click", (event) => {
        if (!handoffUrl) {
          event.preventDefault();
          return;
        }
        if (connected) {
          event.preventDefault();
          requestId += 1;
          send({
            jsonrpc: "2.0",
            id: requestId,
            method: "ui/open-link",
            params: { url: handoffUrl }
          });
        }
      });

      if (window.openai && window.openai.toolOutput) render(window.openai.toolOutput);
      send({
        jsonrpc: "2.0",
        id: 1,
        method: "ui/initialize",
        params: {
          appInfo: { name: "Ascent handoff", version: "1.0.0" },
          appCapabilities: {},
          protocolVersion: "2026-01-26"
        }
      });
    })();
  </script>
</body>
</html>`;

