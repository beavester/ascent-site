export const ASCENT_HANDOFF_BASE_URL =
  "https://habitbuilding.xyz/ascent/handoff/";

export const ASCENT_APP_STORE_URL =
  "https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194";

export type ReminderStyle = "gentle" | "direct" | "minimal";

export interface FocusWindow {
  label: string;
  duration_minutes: number;
}

export interface AttentionPlanInput {
  goal: string;
  distracting_behavior: string;
  available_minutes?: number;
  focus_windows?: string[];
  reminder_style?: ReminderStyle;
}

export interface AttentionPlan {
  status: "ready";
  handoff_id: string;
  today_intention: string;
  distracting_behavior: string;
  replacement_behavior: string;
  two_minute_fallback: string;
  focus_windows: FocusWindow[];
  reminders: string[];
  next_step: string;
}

export interface TwoMinuteActionInput {
  action: string;
  obstacle?: string;
  context?: string;
}

export interface TwoMinuteAction {
  status: "ready";
  handoff_id: string;
  full_action: string;
  two_minute_action: string;
  first_physical_step: string;
  success_definition: string;
  next_step: string;
}

export interface FocusSessionInput {
  goal: string;
  duration_minutes: number;
  distracting_apps?: string[];
}

export interface FocusSession {
  status: "handoff_required";
  handoff_id: string;
  goal: string;
  duration_minutes: number;
  distracting_apps: string[];
  focus_intention: string;
  device_action: string;
  next_step: string;
}

export type ReviewPattern =
  | "action_size"
  | "friction_gap"
  | "timing"
  | "low_energy"
  | "consistency";

export interface AttentionReviewInput {
  completed_actions: number;
  planned_actions: number;
  focus_sessions: number;
  total_focus_minutes: number;
  distraction_openings: number;
  motivation_battery_avg: number;
  failure_windows?: string[];
  reflection_note?: string;
}

export interface AttentionReview {
  status: "ready";
  handoff_id: string;
  completion_rate_percent: number;
  focus_minutes_per_session: number;
  primary_pattern: ReviewPattern;
  pattern_summary: string;
  recommendations: string[];
  next_week_fallback: string;
  data_boundary: string;
  next_step: string;
}

export type HandoffType =
  | "attention_plan"
  | "two_minute_action"
  | "focus_session"
  | "attention_review";

export type HandoffData =
  | AttentionPlan
  | TwoMinuteAction
  | FocusSession
  | AttentionReview;

export interface HandoffEnvelope {
  version: 1;
  type: HandoffType;
  data: HandoffData;
}
