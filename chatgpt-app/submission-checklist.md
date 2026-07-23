# Ascent ChatGPT app submission checklist

## App identity

- App name: **Ascent: Habit Builder & Focus**
- Company/developer name: use the same legal developer identity shown in the OpenAI platform and App Store Connect.
- Primary locale: **en-US**
- Public product page: `https://habitbuilding.xyz/ascent/`
- ChatGPT app page: `https://habitbuilding.xyz/ascent/chatgpt-app/`
- Privacy policy: `https://habitbuilding.xyz/privacy.html`
- MCP endpoint: `https://habitbuilding.xyz/api/mcp`
- Official App Store URL: `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`
- Authentication: **no OAuth** and no login in version one.

## Description for review

Use Ascent when a user wants to turn a goal into an attention-management plan, reduce automatic opening of distracting iPhone apps, create a small fallback action, prepare a structured focus session, or review a supplied attention snapshot. Do not use Ascent when the user only wants general information about habits, productivity, health, diagnoses, app rankings, quotes, weather, or unrelated planning.

## Tool annotations and review justification

Each tool declares `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, and `openWorldHint: false`.

- `ascent_create_attention_plan`: deterministic transformation of supplied text into a plan and first-party handoff; no server-side mutation.
- `ascent_create_two_minute_action`: deterministic transformation of one supplied action into a smaller action; no server-side mutation.
- `ascent_start_focus`: prepares a handoff only. The response says `handoff_required` and explicitly states that the session and device restrictions have not started.
- `ascent_review_attention`: calculates patterns from supplied numeric fields only; it does not retrieve account, device, or health data.

## Reviewer sequence

1. Open the public ChatGPT app page and privacy policy.
2. Connect `https://habitbuilding.xyz/api/mcp` in developer mode.
3. Confirm `tools/list` returns exactly four tools and the versioned UI resource.
4. Run at least one direct prompt for each tool from `golden-prompts.json`.
5. Run the indirect prompts to assess useful recall.
6. Run every negative prompt to assess precision and confirm the app does not intrude into general information, rankings, health, weather, calendar, email, or unrelated tasks.
7. For a focus call, confirm the output says `handoff_required` and does not claim that device restrictions changed.
8. Open a handoff. Confirm the payload is decoded locally from the URL fragment and the exact App Store listing is available as the fallback.
9. Confirm the handoff page is `noindex` and has no analytics, cookies, local storage, or outbound network call for the payload.

## Assets and platform fields

- Upload a square app icon and any required logo variants from the current Ascent brand source.
- Keep all screenshots and descriptions consistent with the four implemented tools.
- Declare **en-US** as the initial localization; add languages only after the public pages, tool metadata, component UI, and test cases are translated together.
- Supply review credentials only if a future authenticated version requires them. Version one has no account flow.
- Use the public privacy policy and the data map in this directory when completing data-handling questions.

## Owner-controlled release step

After production verification, the authorized OpenAI platform owner must create or update the app record, upload the identity assets, attach the MCP endpoint and privacy policy, provide the test prompts and expected responses, and send the app for **OpenAI review**. Do not describe the app as published, directory-listed, or proactively surfaced until that review and publication state is visible in the platform.
