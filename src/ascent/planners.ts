import type {
  AttentionPlan,
  AttentionPlanInput,
  AttentionReview,
  AttentionReviewInput,
  FocusSession,
  FocusSessionInput,
  ReminderStyle,
  ReviewPattern,
  TwoMinuteAction,
  TwoMinuteActionInput,
} from "./contracts.js";
import { stableHandoffId } from "./handoff.js";

function cleanText(value: string, fallback: string, max = 180): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  return (cleaned || fallback).slice(0, max);
}

function clampInteger(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

function withoutTerminalPunctuation(value: string): string {
  return value.replace(/[.!?]+$/g, "");
}

interface SmallAction {
  action: string;
  firstStep: string;
}

function smallActionFor(action: string): SmallAction {
  const lower = action.toLocaleLowerCase();
  if (/\b(clean|tidy|declutter|kitchen|room|laundry)\b/.test(lower)) {
    return {
      action: "Clear one small surface for two minutes.",
      firstStep: "Stand up and choose one surface small enough to finish.",
    };
  }
  if (/\b(work ?out|exercise|run|gym|walk|yoga)\b/.test(lower)) {
    return {
      action: "Put on your workout shoes and move for two minutes.",
      firstStep: "Place both feet on the floor and reach for your shoes.",
    };
  }
  if (/\b(study|read|exam|homework|course|learn)\b/.test(lower)) {
    return {
      action: "Open the material and work through one paragraph for two minutes.",
      firstStep: "Put the material in front of you and open to the next section.",
    };
  }
  if (/\b(write|report|essay|paper|draft|email)\b/.test(lower)) {
    return {
      action: "Open the document and write one rough sentence.",
      firstStep: "Open the document and place the cursor where the next sentence goes.",
    };
  }
  if (/\b(meditat|breathe|mindful)\b/.test(lower)) {
    return {
      action: "Sit down and take six slow breaths.",
      firstStep: "Sit somewhere stable and let your hands rest.",
    };
  }
  return {
    action: `Begin ${withoutTerminalPunctuation(action)} for two minutes using the smallest visible step.`,
    firstStep: "Put the first required object or screen directly in front of you.",
  };
}

function remindersFor(style: ReminderStyle): string[] {
  if (style === "direct") {
    return [
      "Before the focus window: “Start the chosen action now.”",
      "At the usual distraction window: “Pause the automatic open and redirect.”",
    ];
  }
  if (style === "minimal") {
    return ["Before the focus window: “Begin.”", "At the distraction window: “Redirect.”"];
  }
  return [
    "Before the focus window: “Your next step is ready.”",
    "At the usual distraction window: “Pause. What did you mean to do?”",
  ];
}

export function createTwoMinuteAction(
  input: TwoMinuteActionInput,
): TwoMinuteAction {
  const action = cleanText(input.action, "the chosen action");
  const fallback = smallActionFor(action);
  const core = {
    full_action: action,
    two_minute_action: fallback.action,
    first_physical_step: fallback.firstStep,
    success_definition:
      "Success means starting and completing the tiny version; continuing is optional.",
    next_step: "Open the Ascent handoff to keep this fallback beside the full action.",
  };
  return {
    status: "ready",
    handoff_id: stableHandoffId("tm", {
      action,
      obstacle: cleanText(input.obstacle ?? "", "", 120),
      context: cleanText(input.context ?? "", "", 120),
    }),
    ...core,
  };
}

export function createAttentionPlan(input: AttentionPlanInput): AttentionPlan {
  const goal = cleanText(input.goal, "the chosen goal");
  const distraction = cleanText(
    input.distracting_behavior,
    "open a distracting app",
  );
  const duration = clampInteger(input.available_minutes ?? 25, 5, 120);
  const labels =
    input.focus_windows && input.focus_windows.length > 0
      ? input.focus_windows.slice(0, 3).map((label) => cleanText(label, "Next available block", 80))
      : ["Next available block"];
  const fallback = smallActionFor(goal);
  const replacement = `work on ${withoutTerminalPunctuation(goal)} for ${duration} minutes`;
  const style = input.reminder_style ?? "gentle";
  const core = {
    today_intention: `Today, when I notice the pull to ${withoutTerminalPunctuation(distraction)}, I will ${replacement}.`,
    distracting_behavior: distraction,
    replacement_behavior: replacement,
    two_minute_fallback: fallback.action,
    focus_windows: labels.map((label) => ({
      label,
      duration_minutes: duration,
    })),
    reminders: remindersFor(style),
    next_step: "Open the Ascent handoff to review this plan and continue on iPhone.",
  };
  return {
    status: "ready",
    handoff_id: stableHandoffId("ap", { goal, distraction, duration, labels, style }),
    ...core,
  };
}

export function prepareFocusSession(input: FocusSessionInput): FocusSession {
  const goal = cleanText(input.goal, "the chosen focus task");
  const duration = clampInteger(input.duration_minutes, 5, 180);
  const apps = (input.distracting_apps ?? [])
    .slice(0, 12)
    .map((app) => cleanText(app, "", 40))
    .filter(Boolean);
  const core = {
    goal,
    duration_minutes: duration,
    distracting_apps: apps,
    focus_intention: `For the next ${duration} minutes, work only on ${withoutTerminalPunctuation(goal)}.`,
    device_action:
      "The focus session has not started, and no iPhone app restrictions were changed. Open the Ascent handoff to continue on the device.",
    next_step: "Open the Ascent handoff, confirm the session, and configure the listed apps in Ascent.",
  };
  return {
    status: "handoff_required",
    handoff_id: stableHandoffId("fs", { goal, duration, apps }),
    ...core,
  };
}

function chooseReviewPattern(
  completionRate: number,
  input: AttentionReviewInput,
): ReviewPattern {
  if (completionRate < 50) return "action_size";
  if (input.distraction_openings > input.planned_actions * 3) return "friction_gap";
  if ((input.failure_windows?.length ?? 0) > 0) return "timing";
  if (input.motivation_battery_avg < 40) return "low_energy";
  return "consistency";
}

const PATTERN_SUMMARIES: Record<ReviewPattern, string> = {
  action_size:
    "The planned action was completed on fewer than half of planned days, so the first adjustment is to reduce activation energy.",
  friction_gap:
    "Distracting openings substantially outnumbered planned actions, suggesting that the competing behavior needs more friction.",
  timing:
    "The supplied failure windows repeat at identifiable times, so moving or protecting the action is likely more useful than adding reminders.",
  low_energy:
    "The supplied Motivation Battery average was low, so the plan should rely less on a full-size action.",
  consistency:
    "The supplied snapshot shows a workable baseline; the next adjustment is to preserve the cue and make the feedback loop more consistent.",
};

function recommendationsFor(
  pattern: ReviewPattern,
  failureWindows: string[],
): string[] {
  const timingRecommendation =
    failureWindows.length > 0
      ? `Protect or move the action before ${failureWindows[0]}.`
      : "Attach the action to one stable time or event.";
  const byPattern: Record<ReviewPattern, string> = {
    action_size: "Use the two-minute fallback as the default starting threshold next week.",
    friction_gap: "Add a pause before the most common distracting app and show the replacement action there.",
    timing: timingRecommendation,
    low_energy: "Schedule the full action during the strongest energy window and keep a tiny version ready.",
    consistency: "Keep the same cue and review the result at the end of each day.",
  };
  return [
    byPattern[pattern],
    timingRecommendation,
    "Review after seven days and change one part of the system at a time.",
  ];
}

export function reviewAttention(input: AttentionReviewInput): AttentionReview {
  const planned = clampInteger(input.planned_actions, 1, 100);
  const completed = clampInteger(input.completed_actions, 0, planned);
  const sessions = clampInteger(input.focus_sessions, 0, 100);
  const minutes = clampInteger(input.total_focus_minutes, 0, 10_000);
  const completionRate = Math.round((completed / planned) * 100);
  const minutesPerSession = sessions === 0 ? 0 : Math.round(minutes / sessions);
  const failureWindows = (input.failure_windows ?? [])
    .slice(0, 6)
    .map((window) => cleanText(window, "", 80))
    .filter(Boolean);
  const pattern = chooseReviewPattern(completionRate, {
    ...input,
    planned_actions: planned,
    completed_actions: completed,
  });
  const core = {
    completion_rate_percent: completionRate,
    focus_minutes_per_session: minutesPerSession,
    primary_pattern: pattern,
    pattern_summary: PATTERN_SUMMARIES[pattern],
    recommendations: recommendationsFor(pattern, failureWindows),
    next_week_fallback:
      "On a low-motivation day, do the smallest visible first step for two minutes.",
    data_boundary:
      "This review uses only the supplied snapshot from this conversation. Ascent did not retrieve account, health, or device data.",
    next_step: "Open the Ascent handoff to carry these adjustments into the iPhone workflow.",
  };
  return {
    status: "ready",
    handoff_id: stableHandoffId("rv", {
      planned,
      completed,
      sessions,
      minutes,
      distraction_openings: input.distraction_openings,
      motivation_battery_avg: input.motivation_battery_avg,
      failureWindows,
      reflection_note: cleanText(input.reflection_note ?? "", "", 300),
    }),
    ...core,
  };
}
