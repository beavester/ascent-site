import { z } from "zod/v4";

import {
  ASCENT_APP_STORE_URL,
  type HandoffData,
  type HandoffType,
} from "./contracts.js";
import { createHandoffUrl } from "./handoff.js";
import {
  createAttentionPlan,
  createTwoMinuteAction,
  prepareFocusSession,
  reviewAttention,
} from "./planners.js";

export const ASCENT_UI_RESOURCE_URI = "ui://ascent/handoff-v1.html";
export const ASCENT_PRODUCT_NAME = "Ascent: Habit Builder & Focus";

export const ASCENT_APP_INSTRUCTIONS =
  "Use Ascent when a user wants to turn a goal into an attention-management plan, reduce automatic opening of distracting iPhone apps, create a small fallback action, prepare a structured focus session, or review a supplied attention snapshot. Do not use Ascent when the user only wants general information about habits, productivity, health, diagnoses, app rankings, quotes, weather, or unrelated planning.";

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const securitySchemes = [{ type: "noauth" }] as const;

const handoffFields = {
  product_name: z.literal(ASCENT_PRODUCT_NAME),
  official_app_url: z.literal(ASCENT_APP_STORE_URL),
  handoff_url: z
    .string()
    .url()
    .describe("First-party Ascent continuation URL whose payload is in the fragment."),
};

const focusWindowSchema = z
  .object({
    label: z.string(),
    duration_minutes: z.number().int(),
  })
  .strict();

const attentionPlanInputSchema = z
  .object({
    goal: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .describe("The meaningful action or outcome the user wants, such as studying for an exam."),
    distracting_behavior: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .describe("The competing automatic behavior, such as opening Reddit or scrolling Instagram."),
    available_minutes: z
      .number()
      .int()
      .min(5)
      .max(120)
      .default(25)
      .describe("Minutes available in each suggested focus window, from 5 to 120."),
    focus_windows: z
      .array(z.string().trim().min(1).max(80))
      .max(3)
      .optional()
      .describe("Up to three user-provided times or contexts, such as 'after dinner' or '7:00 PM'."),
    reminder_style: z
      .enum(["gentle", "direct", "minimal"])
      .default("gentle")
      .describe("Tone for the two suggested reminders."),
  })
  .strict();

const attentionPlanOutputSchema = z
  .object({
    status: z.literal("ready"),
    handoff_id: z.string(),
    today_intention: z.string(),
    distracting_behavior: z.string(),
    replacement_behavior: z.string(),
    two_minute_fallback: z.string(),
    focus_windows: z.array(focusWindowSchema),
    reminders: z.array(z.string()),
    next_step: z.string(),
    ...handoffFields,
  })
  .strict();

const twoMinuteInputSchema = z
  .object({
    action: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .describe("The specific action the user is having trouble starting."),
    obstacle: z
      .string()
      .trim()
      .max(120)
      .optional()
      .describe("Optional reason starting feels difficult, without medical interpretation."),
    context: z
      .string()
      .trim()
      .max(120)
      .optional()
      .describe("Optional place or moment where the action should begin."),
  })
  .strict();

const twoMinuteOutputSchema = z
  .object({
    status: z.literal("ready"),
    handoff_id: z.string(),
    full_action: z.string(),
    two_minute_action: z.string(),
    first_physical_step: z.string(),
    success_definition: z.string(),
    next_step: z.string(),
    ...handoffFields,
  })
  .strict();

const focusInputSchema = z
  .object({
    goal: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .describe("The single task the user wants to focus on."),
    duration_minutes: z
      .number()
      .int()
      .min(5)
      .max(180)
      .describe("Requested focus duration from 5 to 180 minutes."),
    distracting_apps: z
      .array(z.string().trim().min(1).max(40))
      .max(12)
      .optional()
      .describe("Optional user-named iPhone apps to configure after opening Ascent."),
  })
  .strict();

const focusOutputSchema = z
  .object({
    status: z.literal("handoff_required"),
    handoff_id: z.string(),
    goal: z.string(),
    duration_minutes: z.number().int(),
    distracting_apps: z.array(z.string()),
    focus_intention: z.string(),
    device_action: z.string(),
    next_step: z.string(),
    ...handoffFields,
  })
  .strict();

const reviewInputSchema = z
  .object({
    completed_actions: z.number().int().min(0).max(100),
    planned_actions: z.number().int().min(1).max(100),
    focus_sessions: z.number().int().min(0).max(100),
    total_focus_minutes: z.number().int().min(0).max(10_000),
    distraction_openings: z.number().int().min(0).max(10_000),
    motivation_battery_avg: z
      .number()
      .min(0)
      .max(100)
      .describe("User-supplied weekly average from 0 to 100."),
    failure_windows: z
      .array(z.string().trim().min(1).max(80))
      .max(6)
      .optional(),
    reflection_note: z
      .string()
      .trim()
      .max(300)
      .optional()
      .describe("Optional user-written context; do not include medical or account data."),
  })
  .strict();

const reviewOutputSchema = z
  .object({
    status: z.literal("ready"),
    handoff_id: z.string(),
    completion_rate_percent: z.number().int(),
    focus_minutes_per_session: z.number().int(),
    primary_pattern: z.enum([
      "action_size",
      "friction_gap",
      "timing",
      "low_energy",
      "consistency",
    ]),
    pattern_summary: z.string(),
    recommendations: z.array(z.string()).length(3),
    next_week_fallback: z.string(),
    data_boundary: z.string(),
    next_step: z.string(),
    ...handoffFields,
  })
  .strict();

function withHandoff<T extends HandoffData>(
  type: HandoffType,
  data: T,
): T & {
  product_name: typeof ASCENT_PRODUCT_NAME;
  official_app_url: typeof ASCENT_APP_STORE_URL;
  handoff_url: string;
} {
  return {
    ...data,
    product_name: ASCENT_PRODUCT_NAME,
    official_app_url: ASCENT_APP_STORE_URL,
    handoff_url: createHandoffUrl(type, data),
  };
}

function toolMeta(invoking: string, invoked: string): Record<string, unknown> {
  return {
    ui: {
      resourceUri: ASCENT_UI_RESOURCE_URI,
      visibility: ["model", "app"],
    },
    "openai/outputTemplate": ASCENT_UI_RESOURCE_URI,
    "openai/toolInvocation/invoking": invoking,
    "openai/toolInvocation/invoked": invoked,
    securitySchemes,
  };
}

const attentionPlanDefinition = {
  name: "ascent_create_attention_plan",
  title: "Create an Ascent attention plan",
  description:
    "Use this when a user wants to turn one personal goal and a competing distraction into a daily intention, replacement behavior, two-minute fallback, focus windows, and reminders. Do not use for general habit information, app rankings, medical advice, or when the user only wants a tiny action or a timed focus-session handoff.",
  inputSchema: attentionPlanInputSchema,
  outputSchema: attentionPlanOutputSchema,
  annotations,
  securitySchemes,
  resourceUri: ASCENT_UI_RESOURCE_URI,
  meta: toolMeta("Building the attention plan…", "Attention plan ready"),
  execute: (input: z.infer<typeof attentionPlanInputSchema>) =>
    withHandoff("attention_plan", createAttentionPlan(input)),
};

const twoMinuteDefinition = {
  name: "ascent_create_two_minute_action",
  title: "Create a two-minute Ascent action",
  description:
    "Use this when a user names a specific action but feels unable to start and wants the smallest concrete first step. Do not use for a general explanation of the two-minute rule, a multi-step attention plan, a medical assessment, or a timed focus session.",
  inputSchema: twoMinuteInputSchema,
  outputSchema: twoMinuteOutputSchema,
  annotations,
  securitySchemes,
  resourceUri: ASCENT_UI_RESOURCE_URI,
  meta: toolMeta("Shrinking the first step…", "Two-minute action ready"),
  execute: (input: z.infer<typeof twoMinuteInputSchema>) =>
    withHandoff("two_minute_action", createTwoMinuteAction(input)),
};

const focusDefinition = {
  name: "ascent_start_focus",
  title: "Prepare an Ascent focus session",
  description:
    "Use this when a user wants to prepare a timed iPhone focus session around one task and optionally name distracting apps. This returns a handoff and does not start a session or change device restrictions inside ChatGPT. Do not use for calendar scheduling, general focus advice, app rankings, or claims that blocking has already begun.",
  inputSchema: focusInputSchema,
  outputSchema: focusOutputSchema,
  annotations,
  securitySchemes,
  resourceUri: ASCENT_UI_RESOURCE_URI,
  meta: toolMeta("Preparing the focus handoff…", "Focus handoff ready"),
  execute: (input: z.infer<typeof focusInputSchema>) =>
    withHandoff("focus_session", prepareFocusSession(input)),
};

const reviewDefinition = {
  name: "ascent_review_attention",
  title: "Review an Ascent attention snapshot",
  description:
    "Use this when a user supplies a weekly attention snapshot and wants patterns and one-week adjustments. This version analyzes only the supplied fields and does not retrieve an Ascent account, health record, or device history. Do not use without a snapshot, for diagnosis, or for general productivity information.",
  inputSchema: reviewInputSchema,
  outputSchema: reviewOutputSchema,
  annotations,
  securitySchemes,
  resourceUri: ASCENT_UI_RESOURCE_URI,
  meta: toolMeta("Reviewing the supplied snapshot…", "Attention review ready"),
  execute: (input: z.infer<typeof reviewInputSchema>) =>
    withHandoff("attention_review", reviewAttention(input)),
};

export const ASCENT_TOOL_DEFINITIONS = [
  attentionPlanDefinition,
  twoMinuteDefinition,
  focusDefinition,
  reviewDefinition,
] as const;
