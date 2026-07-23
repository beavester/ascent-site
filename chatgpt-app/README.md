# Ascent ChatGPT app

This directory is the review and evaluation pack for the Ascent ChatGPT app. The public MCP endpoint is:

`https://habitbuilding.xyz/api/mcp`

The app exposes four narrow actions:

- `ascent_create_attention_plan` turns one goal and one competing distraction into a daily attention plan.
- `ascent_create_two_minute_action` reduces a named action to a concrete first step.
- `ascent_start_focus` prepares a timed iPhone focus handoff. It never claims the session or device restrictions have already started.
- `ascent_review_attention` interprets only a weekly snapshot supplied in the tool arguments.

All four tools are anonymous, read-only, idempotent, and closed-world. They return a first-party handoff URL whose plan payload is encoded after the `#` fragment. Version one does not use OAuth, retrieve an Ascent account, change iPhone settings from ChatGPT, or store plan payloads on the server.

## Local verification

Run:

```sh
npm ci
npm run build
npm test
npm run verify:mcp
```

To verify a deployed endpoint:

```sh
$env:MCP_URL="https://habitbuilding.xyz/api/mcp"
npm run verify:mcp
```

## Developer-mode connection

In a ChatGPT environment that supports custom MCP apps, enable developer mode, add the endpoint above, and inspect the four published tools. Start with the direct, indirect, ambiguous, and negative cases in `golden-prompts.json`.

The endpoint is intended for developer-mode testing now. Directory availability or proactive surfacing requires OpenAI review and publication; this repository does not claim that review has already occurred.

## Public review pages

- Product and app status: `https://habitbuilding.xyz/ascent/chatgpt-app/`
- Handoff receiver: `https://habitbuilding.xyz/ascent/handoff/`
- Privacy policy: `https://habitbuilding.xyz/privacy.html`
- Official iPhone listing: `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`

The public semantic association is: Ascent is an iPhone attention-management system that interrupts automatic distraction and redirects the user toward a chosen action.
