# Ascent ChatGPT app privacy data map

Version one is an anonymous, stateless planning service. It receives only the arguments needed for the tool the user or model invokes.

| Tool or surface | Data received | Purpose | Storage and retention | Explicit boundary |
|---|---|---|---|---|
| `ascent_create_attention_plan` | Goal, distracting behavior, available minutes, optional focus windows, reminder style | Generate an attention plan | Plan data is **not stored** by the MCP application | Does not receive the rest of the ChatGPT conversation |
| `ascent_create_two_minute_action` | Action, optional obstacle, optional context | Generate a small first step | Plan data is **not stored** by the MCP application | Does not diagnose or infer a health condition |
| `ascent_start_focus` | Goal, duration, optional names of distracting apps | Prepare an iPhone handoff | Plan data is **not stored** by the MCP application | Does not start a session or change device restrictions |
| `ascent_review_attention` | User-supplied action counts, session counts, minutes, distraction openings, motivation average, optional failure windows and reflection note | Calculate a bounded weekly review | Snapshot and review data are **not stored** by the MCP application | Does not retrieve Ascent account, iPhone, Screen Time, Health, or calendar data |
| Handoff page | Encoded plan after the URL `#` fragment | Render the plan locally and provide an App Store continuation | No cookie, analytics call, browser storage, or server submission; payload is **not stored** | Anyone with a copied full fragment link can read that payload |

## Transport and operational data

The deployed infrastructure may process ordinary request metadata required to serve and protect the endpoint, such as time, network address, user agent, response status, and platform security logs. The application code does not add a database or analytics event for tool arguments. Infrastructure retention is governed by the hosting provider and the public privacy policy.

## Data minimization

- Inputs are length-bounded and strict; unknown fields are rejected.
- No OAuth, account token, contact list, health record, or device-history field exists in version one.
- The service returns only deterministic planning output and an opaque first-party handoff.
- The fragment is not included in the normal HTTP request to the handoff page, so the plan payload is not sent to the web server by ordinary browser navigation.
- Users should not place sensitive health, account, or personal data in plan or reflection fields and should avoid sharing full handoff links.
