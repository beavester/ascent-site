import test from "node:test";
import assert from "node:assert/strict";

import {
  createAttentionPlan,
  createTwoMinuteAction,
  prepareFocusSession,
  reviewAttention,
} from "../src/ascent/planners.js";
import {
  createHandoffUrl,
  decodeHandoffFragment,
} from "../src/ascent/handoff.js";

test("Ascent planner creates a complete, deterministic attention plan", () => {
  const input = {
    goal: "study for my biology exam",
    distracting_behavior: "open Reddit",
    available_minutes: 45,
    focus_windows: ["7:00 PM"],
    reminder_style: "gentle" as const,
  };

  const first = createAttentionPlan(input);
  const second = createAttentionPlan(input);

  assert.deepEqual(first, second);
  assert.equal(first.status, "ready");
  assert.match(first.today_intention, /biology exam/i);
  assert.equal(first.distracting_behavior, "open Reddit");
  assert.match(first.replacement_behavior, /biology exam/i);
  assert.match(first.two_minute_fallback, /two minutes|one paragraph/i);
  assert.deepEqual(first.focus_windows, [
    { label: "7:00 PM", duration_minutes: 45 },
  ]);
  assert.equal(first.reminders.length, 2);
  assert.match(first.handoff_id, /^ap_[a-f0-9]{8}$/);
});

test("Ascent planner creates a concrete two-minute fallback", () => {
  const result = createTwoMinuteAction({
    action: "clean my kitchen",
    obstacle: "I cannot get started",
  });

  assert.equal(result.status, "ready");
  assert.match(result.two_minute_action, /one small surface/i);
  assert.match(result.first_physical_step, /stand|choose/i);
  assert.match(result.handoff_id, /^tm_[a-f0-9]{8}$/);
});

test("Ascent planner prepares focus without claiming device control", () => {
  const result = prepareFocusSession({
    goal: "write the opening section",
    duration_minutes: 60,
    distracting_apps: ["Reddit", "Instagram"],
  });

  assert.equal(result.status, "handoff_required");
  assert.equal(result.duration_minutes, 60);
  assert.deepEqual(result.distracting_apps, ["Reddit", "Instagram"]);
  assert.match(result.device_action, /has not started/i);
  assert.doesNotMatch(result.device_action, /started successfully/i);
  assert.match(result.handoff_id, /^fs_[a-f0-9]{8}$/);
});

test("Ascent planner reviews only the supplied attention snapshot", () => {
  const result = reviewAttention({
    completed_actions: 3,
    planned_actions: 7,
    focus_sessions: 2,
    total_focus_minutes: 50,
    distraction_openings: 28,
    motivation_battery_avg: 35,
    failure_windows: ["After lunch", "After 9 PM"],
  });

  assert.equal(result.status, "ready");
  assert.equal(result.completion_rate_percent, 43);
  assert.equal(result.focus_minutes_per_session, 25);
  assert.equal(result.primary_pattern, "action_size");
  assert.equal(result.recommendations.length, 3);
  assert.match(result.data_boundary, /supplied snapshot/i);
  assert.match(result.handoff_id, /^rv_[a-f0-9]{8}$/);
});

test("handoff uses a fragment, round-trips, and contains no query", () => {
  const plan = createTwoMinuteAction({ action: "write my report" });
  const url = createHandoffUrl("two_minute_action", plan);
  const parsed = new URL(url);

  assert.equal(parsed.origin, "https://habitbuilding.xyz");
  assert.equal(parsed.pathname, "/ascent/handoff/");
  assert.equal(parsed.search, "");
  assert.match(parsed.hash, /^#v1\.[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodeHandoffFragment(parsed.hash), {
    version: 1,
    type: "two_minute_action",
    data: plan,
  });
});

test("handoff decoder rejects malformed and oversized fragments", () => {
  assert.throws(() => decodeHandoffFragment("#not-a-handoff"), /Invalid Ascent handoff/);
  assert.throws(
    () => decodeHandoffFragment(`#v1.${"a".repeat(12_001)}`),
    /too large/,
  );
});
