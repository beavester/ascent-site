import base64
import json
import os
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("ASCENT_SITE_URL", "http://127.0.0.1:4173").rstrip("/")
OUTPUT_DIR = Path(tempfile.gettempdir()) / "ascent-chatgpt-visual"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

envelope = {
    "version": 1,
    "type": "attention_plan",
    "data": {
        "today_intention": (
            "Today, when I notice the pull to open Reddit, "
            "I will study biology for 30 minutes."
        ),
        "distracting_behavior": "open Reddit",
        "replacement_behavior": "study biology for 30 minutes",
        "two_minute_fallback": (
            "Open the material and work through one paragraph for two minutes."
        ),
        "next_step": "Continue in Ascent on iPhone.",
    },
}
fragment = base64.urlsafe_b64encode(
    json.dumps(envelope, separators=(",", ":")).encode("utf-8")
).decode("ascii").rstrip("=")

pages = [
    (
        "/",
        "Build habits on iPhone. Block the apps that get in the way.",
        "home",
    ),
    (
        "/ascent/chatgpt-app/",
        "Use Ascent to turn a distraction problem into a next action",
        "chatgpt-app",
    ),
    (
        "/attention-management-iphone/",
        "Attention management on iPhone means interrupting and redirecting",
        "attention-management",
    ),
    (
        "/guides/app-pauses-vs-app-blocking/",
        "App pauses and app blocks change different moments",
        "pauses-vs-blocking",
    ),
    (
        f"/ascent/handoff/#v1.{fragment}",
        "Review your Ascent plan",
        "handoff",
    ),
]

console_errors = []
page_errors = []

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})

    def keep_first_party(route):
        if route.request.url.startswith(BASE_URL):
            route.continue_()
        else:
            content_type = {
                "script": "application/javascript",
                "stylesheet": "text/css",
                "font": "font/woff2",
            }.get(route.request.resource_type, "text/plain")
            route.fulfill(
                status=200,
                body=b"",
                headers={"content-type": content_type},
            )

    context.route("**/*", keep_first_party)
    page = context.new_page()
    page.on(
        "console",
        lambda message: (
            console_errors.append(message.text) if message.type == "error" else None
        ),
    )
    page.on("pageerror", lambda error: page_errors.append(str(error)))

    for path, heading, slug in pages:
        response = page.goto(f"{BASE_URL}{path}", wait_until="networkidle")
        assert response is not None and response.status == 200, path
        assert page.get_by_role("heading", name=heading, exact=True).count() == 1, path
        assert page.evaluate(
            "() => document.documentElement.scrollWidth <= "
            "document.documentElement.clientWidth + 1"
        ), f"horizontal overflow on {path}"
        page.screenshot(path=str(OUTPUT_DIR / f"{slug}-desktop.png"), full_page=True)

    assert page.locator("#plan").is_visible()
    assert "study biology for 30 minutes" in page.locator("#details").inner_text()
    assert page.get_by_role("link", name="Open Ascent on the App Store").get_attribute(
        "href"
    ).startswith(
        "https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194"
    )
    page.get_by_role("button", name="Copy plan").click()
    page.wait_for_function(
        "() => ['Copied', 'Copy unavailable'].includes("
        "document.querySelector('#copy')?.textContent)"
    )

    page.set_viewport_size({"width": 390, "height": 844})
    for path, heading, slug in pages:
        response = page.goto(f"{BASE_URL}{path}", wait_until="networkidle")
        assert response is not None and response.status == 200, path
        assert page.get_by_role("heading", name=heading, exact=True).count() == 1, path
        assert page.evaluate(
            "() => document.documentElement.scrollWidth <= "
            "document.documentElement.clientWidth + 1"
        ), f"mobile horizontal overflow on {path}"
        page.screenshot(path=str(OUTPUT_DIR / f"{slug}-mobile.png"), full_page=True)

    browser.close()

assert not page_errors, page_errors
assert not console_errors, console_errors
print(f"Verified {len(pages)} pages at desktop and mobile widths.")
print(f"Screenshots: {OUTPUT_DIR}")
