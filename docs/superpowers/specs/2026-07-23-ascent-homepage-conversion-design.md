# Ascent Homepage Conversion Design

**Date:** July 23, 2026

## Decision

Make the homepage a conversion-first product page for Ascent. Preserve HabitBuilding.xyz's research, comparison, and guide library as the site's discovery engine, but move it below the complete product journey and present it compactly.

The organizing line remains:

> The app is the setup. The phone becomes the loop.

## Goals

- Increase qualified App Store clicks from the homepage.
- Explain Ascent's connected behavior loop in under one minute.
- Make public copy agree with the actual interface.
- Keep all important content server-rendered and extractable.
- Add trust without invented testimonials, inflated science, or unsupported results.

## Non-goals

- Redesigning the app.
- Rewriting the research library.
- Claiming a habit forms in 70 days.
- Publishing unverified ratings, testimonials, or retention statistics.

## Audience and promise

The primary visitor is an iPhone user whose meaningful goal repeatedly loses to distraction, uncertainty, or low capacity.

The product promise is:

> Ascent keeps the next constructive action visible and makes the distracting default harder to follow.

Describe Ascent as an iPhone habit builder with optional app-blocking support. It is not a universal planner, deep screen-time analytics product, or large multi-habit dashboard.

## Homepage sequence

### 1. Compact navigation

Use:

- How it works
- Screens
- Compare
- Research
- Get the App

Remove Blog from primary navigation while the blog contains only one article. Keep it in the footer.

### 2. Conversion-first hero

Eyebrow:

> iPhone habit builder + optional app blocker

Headline:

> Build the habit before distraction wins.

Supporting copy:

> Ascent turns one meaningful goal into a guided 70-day progression, keeps today's next step visible on your iPhone, scales it down when the day is hard, and can pause distracting apps before they take over.

Actions:

- Download free
- See how it works

Microcopy:

> Free to start · No credit card · Set up in about two minutes

Lead visually with the app-delay screen. Pair it with the curriculum and widget screens. Do not use `screen-today.webp` above the fold because its “0 of 4 habits” label creates a positioning contradiction before supporting habits have been explained.

### 3. Four-part mechanism

Heading:

> The app is the setup. The phone becomes the loop.

Intro:

> Ascent connects the plan, the cue, the distraction boundary, and the fallback so they support the same goal.

Mechanisms:

1. **Know what to do today.** A guided 70-day progression turns the larger goal into a concrete next step.
2. **See it before the feed.** Widgets keep the goal and today's step on iPhone surfaces the visitor already checks.
3. **Pause the distracting default.** Optional Screen Time friction slows selected apps before the reflex finishes.
4. **Shrink the task instead of quitting.** A two-minute fallback preserves the direction of the habit when the full action does not fit.

### 4. Visual product proof

Use three primary screenshots to show plan, visibility, and distraction friction. The two-minute fallback may appear as a fourth focused product card when it adds information rather than repeating the mechanism copy.

Replace “AI-generated curriculum” and “AI-generated daily plan” with “70-day guided progression.” AI may be explained later as the engine used to prepare the initial progression, not as the leading benefit.

### 5. Interface clarification

Use this exact explanation near the product walkthrough:

> Ascent centers one meaningful goal. That goal can include several supporting habits, but the app keeps one next step prominent so the day still has a clear focus.

Do not use “one goal, one curriculum, one daily action” where it implies that the interface cannot display supporting habits.

### 6. Factual trust

Until verified external proof exists, use:

- Official App Store listing
- Free tier available
- Screen Time access is optional
- Personal data is not sold
- HabitBuilding.xyz discloses that it is published by Ascent's maker

Omit testimonials if exact wording and attribution cannot be verified. Show ratings or review counts only when they are current and maintainable.

### 7. Product fit

Heading:

> Choose Ascent when the habit and the distraction are part of the same problem.

Choose Ascent when one goal needs a guided progression, the next action needs to stay visible, low-capacity days need a fallback, and phone distraction repeatedly displaces the intended behavior.

Choose a specialist when a simple tracker, a full-day planner, or strict blocking analytics is the primary job.

### 8. Compact research library

Feature four primary entry points:

- Why habit trackers fail
- The two-minute fallback
- iOS habit app index
- Compare Ascent with specialist apps

Keep additional authority routes available as a short secondary list so the site's topic graph remains crawlable without reproducing the full editorial directory on the homepage.

Use this count language:

> Browse the maintained 19-app index, including Ascent, or compare Ascent with 18 specialist alternatives.

### 9. Final action

Headline:

> Give one goal a clearer next step.

Supporting copy:

> Start free, put today's action where you can see it, and decide whether Ascent's connected loop fits better than another checklist.

Action:

> Get Ascent for iPhone

## Visual requirements

- Keep the existing light paper palette and restrained blue accent.
- Use typography, spacing, and screenshot scale for hierarchy.
- Use opaque surfaces and conventional shadows.
- Do not add dark gradients, neon accents, transparent white cards, gradient text, or hover lift.
- Keep interactive targets at least 44px high and preserve reduced-motion behavior.

## Search and technical requirements

- Keep essential product and research copy in server-rendered HTML.
- Preserve the canonical URL, App Store identity, SoftwareApplication schema, crawler permissions, and sitemap.
- Preserve visible links to the authority library, comparison hub, methodology, and official Ascent guide.
- Do not add structured claims that are not also visible on the page.
- Keep analytics limited to placement and destination data; do not collect prompt or query text.

## Acceptance criteria

1. The hero states the audience, outcome, and optional app-blocking mechanism.
2. The primary App Store action appears in the first mobile viewport or immediately after a short scroll.
3. `screen-today.webp` does not appear in the hero.
4. The page explains one goal plus supporting habits.
5. “AI-generated” is not a primary homepage benefit.
6. The 19-app index and 18-alternative relationship is explicit.
7. No unsupported testimonial, rating, result, or scientific claim is present.
8. The page remains server-rendered, responsive, keyboard accessible, and visually restrained.
9. Existing site, accessibility, metadata, canonical, and structured-data tests pass.
