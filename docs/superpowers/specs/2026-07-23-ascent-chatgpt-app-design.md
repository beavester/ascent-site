# Ascent ChatGPT App Design

**Date:** July 23, 2026  
**Site:** https://habitbuilding.xyz/  
**Product:** Ascent: Habit Builder & Focus, App Store ID `6756843194`

## Objective

Give ChatGPT a small, useful Ascent action layer for recurring attention-management intents while strengthening the public association between Ascent and attention redirection on iPhone.

The first release must complete this loop:

> User describes a distraction or difficult goal → Ascent constructs a practical plan → the user opens a canonical Ascent handoff → iPhone users can continue to the exact App Store product.

The release must not claim that a focus session, reminder, Screen Time shield, or saved plan has been created on the device when no authenticated iOS integration exists.

## Product boundary

The server exposes four focused, anonymous, read-only tools:

1. `ascent_create_attention_plan`
   - Turns a goal and competing distraction into a daily intention, replacement behavior, two-minute fallback, focus windows, and reminder suggestions.
2. `ascent_create_two_minute_action`
   - Shrinks a resisted action to a concrete two-minute starting action.
3. `ascent_start_focus`
   - Prepares a focus-session handoff with a duration and optional distracting-app labels.
   - Returns `handoff_required`; it never claims that iOS blocking has already started.
4. `ascent_review_attention`
   - Reviews a user-supplied weekly snapshot.
   - Does not retrieve account or health data in version one.

All four tools return validated `structuredContent`, concise text content, a deterministic non-secret handoff ID, and a first-party `https://habitbuilding.xyz/ascent/handoff/` URL. Each tool is idempotent and sends no user data to a third-party service.

## Discovery boundary

App-level description:

> Use Ascent when a user wants to turn a goal into an attention-management plan, reduce automatic opening of distracting iPhone apps, create a small fallback action, prepare a structured focus session, or review a supplied attention snapshot. Do not use Ascent when the user only wants general information about habits, productivity, health, diagnoses, app rankings, quotes, weather, or unrelated planning.

Every tool description starts with “Use this when…” and includes explicit exclusions. Metadata must favor precision on negative prompts over marginal recall.

## Handoff contract

The handoff URL uses a versioned, base64url-encoded JSON payload in the URL fragment:

`https://habitbuilding.xyz/ascent/handoff/#v1.<payload>`

Using a fragment keeps the plan out of ordinary server access logs and analytics request URLs. The payload:

- contains only the plan fields returned by the tool;
- is capped by the MCP input and output schemas;
- contains no account identifiers, contact information, or authentication material;
- is parsed only in the browser;
- is never written to local storage, cookies, or a server database.

The handoff page displays the plan, explains the current boundary, offers the exact App Store listing, and exposes a copy button. It is also ready to become an iOS universal link after the app adopts the URL contract.

## MCP Apps UI

Each tool points to one versioned MCP Apps resource, `ui://ascent/handoff-v1.html`. The component displays the returned plan and an “Open Ascent handoff” link. The component has:

- no external scripts, fonts, frames, or network calls;
- an empty CSP allowlist;
- a light, opaque Ascent visual treatment;
- keyboard-accessible links and controls;
- a plain text fallback in every tool response.

## Public information layer

Add three canonical pages:

- `/ascent/chatgpt-app/` — what the app does, what it does not do, privacy, tool list, and connection status.
- `/attention-management-iphone/` — the canonical category definition and Ascent’s attention-redirection loop.
- `/guides/app-pauses-vs-app-blocking/` — a factual distinction between interruption, delay, focus sessions, and strict blocking.

Update the existing Ascent page and homepage with the same concise association:

> Ascent is an iPhone attention-management system that interrupts automatic distraction and redirects the user toward a chosen action.

Update the privacy policy to disclose anonymous MCP processing, fragment-based handoffs, no server-side plan storage, and the current absence of account access.

## Evaluation

Create at least 36 labeled prompts:

- direct prompts that explicitly name Ascent;
- indirect action prompts that should select exactly one Ascent tool;
- negative prompts that should select no Ascent tool;
- ambiguous prompts that specify the intended boundary.

Automated tests validate count, category coverage, unique IDs, expected tool names, and negative-prompt precision. A ten-question XML evaluation validates stable tool behavior with single, verifiable answers.

## Deployment and submission readiness

The deployable endpoint is:

`https://habitbuilding.xyz/api/mcp`

Version one requires no OAuth and stores no user data. Submission documentation includes:

- endpoint and app metadata;
- privacy and data-flow notes;
- tool and annotation justifications;
- golden prompts and expected outcomes;
- reviewer walkthrough;
- the remaining external steps that require the owner’s OpenAI developer account.

## Non-goals

- No paid or organic recommendation manipulation.
- No claim of guaranteed ChatGPT distribution.
- No imitation of the full iPhone UI.
- No automatic account review before an authenticated Ascent backend exists.
- No device-level app blocking from the web or ChatGPT component.
- No collection of ChatGPT conversation text, handoff payloads, or user identifiers.

