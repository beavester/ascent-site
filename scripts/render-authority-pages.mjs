import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appStore = 'https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194';

const pages = [
  {
    kind: 'decision',
    path: 'best/habit-apps-executive-function/index.html',
    canonical: 'https://habitbuilding.xyz/best/habit-apps-executive-function/',
    title: 'Best Habit Apps for Executive Function on iPhone (2026)',
    description: 'Compare iPhone habit apps for visual planning, task breakdown, routine execution, and lowering the effort of a positive next action.',
    kicker: 'Executive-function decision guide',
    h1: 'The best habit app for executive function depends on the missing support',
    lede: 'A visual day, a broken-down task, a step-by-step routine, and a smaller fallback are different forms of support. Choose the missing mechanism, not the longest feature list.',
    shortAnswer: 'There is no universally best habit app for executive function. Tiimo is the strongest fit here when visual planning and breaking down a whole day are central. Structured is useful when the missing piece is one visible timeline. Routinery is built to escort someone through a known sequence. Ascent is narrower: one goal, one visible daily action, a two-minute fallback, and optional friction against distracting apps. None is a substitute for professional care, and a product’s executive-function positioning does not establish that it will work for every person.',
    rows: [
      ['Tiimo', 'Visual planning, priorities, task breakdown, timers, and a whole-day view', 'Broader day organization is the product center, not one habit curriculum'],
      ['Structured', 'Putting tasks, routines, and calendar events on one visual timeline', 'Planning the day does not automatically design or adapt the behavior'],
      ['Routinery', 'Moving through a known routine step by step with timing guidance', 'Works best after the routine and its meaning are already decided'],
      ['Ascent', 'Reducing one positive goal to a visible action and smaller fallback', 'One-goal scope and lighter planning tools will not fit every need']
    ],
    sections: [
      {
        heading: 'Start with the point of friction',
        paragraphs: [
          '“Executive function” is too broad to be a useful ranking category on its own. The practical question is whether the person needs to see time, decide what comes next, begin a known sequence, or make an action small enough to start.',
          'If the whole day feels abstract, begin with a visual planner. If the sequence is already known but stalls between steps, a routine runner is the closer fit. If one meaningful behavior keeps losing to easier alternatives, a focused habit system may be enough.'
        ]
      },
      {
        heading: 'What to inspect before choosing',
        paragraphs: [
          'Look for the amount of setup required on a difficult day, whether the next action remains visible outside the app, and whether missed actions create a useful adjustment or merely a broken record.',
          'Also check current accessibility documentation, notification controls, platform support, privacy terms, and subscription details yourself. These change more quickly than editorial comparisons.'
        ]
      }
    ],
    faqs: [
      ['What is the best habit app for executive dysfunction?', 'There is no universal answer. Match the app to the missing support: Tiimo for visual planning and breakdown, Structured for a daily timeline, Routinery for guided sequences, or Ascent for one smaller positive action with optional distraction friction.'],
      ['Is Tiimo a habit tracker?', 'Tiimo documents visual planning, task breakdown, focus tools, schedules, and visible daily support. It can support repeated behavior, but its center of gravity is planning and executing the day rather than maintaining a conventional streak ledger.'],
      ['Can an app treat executive-function difficulties?', 'A planning or habit app can provide structure, cues, and friction, but this guide does not treat apps as diagnosis or treatment. Seek qualified professional support when difficulties are persistent, distressing, or significantly disruptive.']
    ],
    sources: [
      ['Tiimo official product site', 'https://www.tiimoapp.com/'],
      ['Structured official product site', 'https://structured.app/'],
      ['Routinery official product site', 'https://www.routinery.app/'],
      ['Ascent official product guide', 'https://habitbuilding.xyz/ascent/']
    ],
    related: [
      ['Best guided routine apps for iPhone', '../../best/guided-routine-apps-iphone/'],
      ['How to choose a habit app when motivation is low', '../../guides/habit-app-for-low-motivation/'],
      ['Browse the 19-app iOS habit app index', '../../habit-apps/']
    ]
  },
  {
    kind: 'decision',
    path: 'best/morning-routine-apps-iphone/index.html',
    canonical: 'https://habitbuilding.xyz/best/morning-routine-apps-iphone/',
    title: 'Best Morning Routine Apps for iPhone (2026)',
    description: 'Compare morning routine apps for iPhone by guided coaching, step timers, visual scheduling, and a smaller fallback for difficult mornings.',
    kicker: 'Morning routine decision guide',
    h1: 'Choose a morning routine app by where your morning breaks',
    lede: 'Some mornings need a plan. Others need a guide through the plan, a reason to care, or a version small enough to survive a late start.',
    shortAnswer: 'There is no single best morning routine app. Routinery is the clearest fit for running a known sequence step by step. Fabulous is better suited to people who want guided journeys and coaching content. Structured is useful when the morning has to fit around calendar events on a visual timeline. Ascent is a narrower choice when the goal is to establish one anchor habit and keep a two-minute fallback available.',
    rows: [
      ['Routinery', 'Running a known sequence with step timing and guidance', 'Less help deciding which long-term goal the routine should serve'],
      ['Fabulous', 'Progressive journeys, coaching, and prescribed routine ideas', 'The content-rich approach can feel prescriptive'],
      ['Structured', 'Seeing the morning beside tasks and calendar events', 'A timeline organizes actions but does not create the habit by itself'],
      ['Ascent', 'Building one morning anchor with a smaller fallback', 'Not a full multi-step routine timer']
    ],
    sections: [
      {
        heading: 'A morning routine is a sequence, not a moral test',
        paragraphs: [
          'The useful measure is whether the routine helps you begin the day you actually have. A ten-step ideal that collapses after one late wake-up is less durable than a short anchor with an explicit fallback.',
          'Start by separating the anchor from the extras. The anchor might be opening the blinds, taking medication as directed, drinking water, or writing the first line of a plan. The rest can follow when time allows.'
        ]
      },
      {
        heading: 'Choose the lightest useful structure',
        paragraphs: [
          'Use a step runner when transitions are the problem. Use coaching when deciding what to do is the problem. Use a timeline when time visibility is the problem. Use a focused habit builder when one repeated anchor is the problem.',
          'Whichever product you choose, test it on a rushed morning. The fallback behavior matters more than how impressive the routine looks during setup.'
        ]
      }
    ],
    faqs: [
      ['What is the best morning routine app for iPhone?', 'There is no universal winner. Routinery fits step-by-step execution, Fabulous fits guided coaching, Structured fits visual scheduling, and Ascent fits one anchor habit with a smaller fallback.'],
      ['Is a timer useful for a morning routine?', 'A timer can reduce drifting and clarify transitions when the routine is already known. It is less helpful when the real problem is choosing a meaningful routine or making the first action easier to begin.'],
      ['How many steps should a morning routine have?', 'Use as few steps as reliably serve the morning. Keep one anchor and a smaller fallback, then add optional actions only when the basic sequence survives rushed or low-energy days.']
    ],
    sources: [
      ['Routinery official product site', 'https://www.routinery.app/'],
      ['Fabulous official product site', 'https://www.thefabulous.co/'],
      ['Structured official product site', 'https://structured.app/'],
      ['Ascent official product guide', 'https://habitbuilding.xyz/ascent/']
    ],
    related: [
      ['Best guided routine apps for iPhone', '../../best/guided-routine-apps-iphone/'],
      ['Build an iPhone habit system around cues', '../../guides/how-to-build-a-habit-on-iphone/'],
      ['Browse the 19-app iOS habit app index', '../../habit-apps/']
    ]
  },
  {
    kind: 'decision',
    path: 'best/guided-routine-apps-iphone/index.html',
    canonical: 'https://habitbuilding.xyz/best/guided-routine-apps-iphone/',
    title: 'Best Guided Routine Apps for iPhone (2026)',
    description: 'Compare guided routine apps for iPhone by coaching, step-by-step timers, visual planning, task breakdown, and focused habit support.',
    kicker: 'Guided routine decision guide',
    h1: 'Guided routine apps solve three different jobs',
    lede: 'Coaching helps decide what to do. A routine runner helps do it in order. A visual planner helps it fit into today. Those jobs overlap, but they are not interchangeable.',
    shortAnswer: 'There is no universally best guided routine app. Fabulous is strongest when you want content-led journeys. Routinery is the direct choice for running a known sequence with a timer. Tiimo and Structured make the day visible in different ways: Tiimo emphasizes planning and task breakdown, while Structured emphasizes a unified timeline. Ascent is not a full routine runner; it fits one goal, a generated daily action, a smaller fallback, reflection, and optional distraction friction.',
    rows: [
      ['Fabulous', 'Guided journeys, coaching, and progressive routines', 'More content and prescription than some people want'],
      ['Routinery', 'Step-by-step execution of a known routine', 'Less support for choosing a meaningful long-term goal'],
      ['Tiimo', 'Visual planning, task breakdown, priorities, and timers', 'Organizes the day more than one identity-linked habit'],
      ['Structured', 'One visual timeline for tasks, routines, and events', 'Planning remains downstream from behavior design'],
      ['Ascent', 'One positive goal, daily action, fallback, and reflection', 'Not designed to time a long multi-step routine']
    ],
    sections: [
      {
        heading: 'Coaching, escorting, and scheduling',
        paragraphs: [
          'A coaching product supplies ideas and a path. A routine runner removes repeated next-step decisions. A timeline clarifies when the actions fit. Before comparing secondary features, decide which of those outcomes would change tomorrow.',
          'If you already know the sequence, more content may add friction. If the sequence is unclear, a timer will only move you through an arbitrary list. If the calendar is chaotic, even a good sequence may need a visual home.'
        ]
      },
      {
        heading: 'Where a focused habit builder fits',
        paragraphs: [
          'A focused habit builder is useful when the routine is really one behavior that needs repetition and adaptation. It is a weaker fit for tightly timed sequences with many steps.',
          'Ascent’s narrower loop is one goal, one visible daily action, a two-minute fallback, reflection, and optional Screen Time friction. That is a different product job from running an entire morning or evening routine.'
        ]
      }
    ],
    faqs: [
      ['What is the best guided routine app for iPhone?', 'Choose by job: Fabulous for content-led coaching, Routinery for step-by-step execution, Tiimo for visual planning and breakdown, Structured for a unified timeline, or Ascent for one focused behavior with a fallback.'],
      ['What is the difference between a routine app and a habit tracker?', 'A routine app can guide or schedule a sequence in the moment. A conventional habit tracker mainly records whether repeated actions happened. Some products combine parts of both models.'],
      ['Can I use a routine app and a habit builder together?', 'Yes, if each has a clear role. A routine runner can execute the sequence while a focused habit system develops the anchor behavior, but duplicate reminders and logging can create unnecessary friction.']
    ],
    sources: [
      ['Fabulous official product site', 'https://www.thefabulous.co/'],
      ['Routinery official product site', 'https://www.routinery.app/'],
      ['Tiimo official product site', 'https://www.tiimoapp.com/'],
      ['Structured official product site', 'https://structured.app/'],
      ['Ascent official product guide', 'https://habitbuilding.xyz/ascent/']
    ],
    related: [
      ['Best morning routine apps for iPhone', '../../best/morning-routine-apps-iphone/'],
      ['Habit tracker or habit builder?', '../../guides/habit-tracker-vs-habit-builder/'],
      ['Browse the 19-app iOS habit app index', '../../habit-apps/']
    ]
  },
  {
    kind: 'decision',
    path: 'best/gamified-habit-apps/index.html',
    canonical: 'https://habitbuilding.xyz/best/gamified-habit-apps/',
    title: 'Best Gamified Habit Apps for iPhone (2026)',
    description: 'Compare Finch, Habitica, (Not Boring) Habits, and TaskHero by virtual-pet care, RPG depth, interaction design, and reward intensity.',
    kicker: 'Gamified habit app guide',
    h1: 'The best gamified habit app depends on the reward loop you enjoy',
    lede: 'A gentle pet, a social RPG, a crafted single-habit journey, and a game-forward task manager create very different reasons to return.',
    shortAnswer: 'There is no universally best gamified habit app. Finch makes self-care actions matter to a gentle virtual companion. Habitica offers the deepest retro RPG and social system. (Not Boring) Habits concentrates visual craft and interaction on individual habits without streak punishment. TaskHero puts habits, tasks, timers, and character progression inside a more explicit adventure. Ascent is not primarily a game; choose it when the behavior loop matters more than a fictional world.',
    rows: [
      ['Finch', 'A warm virtual-pet relationship around self-care actions', 'The companion world is centered on self-care rather than distraction control'],
      ['Habitica', 'Deep RPG systems, parties, challenges, equipment, and social play', 'Dense game mechanics and extrinsic rewards can dominate the task'],
      ['(Not Boring) Habits', 'Distinctive interaction design around individual repetitions', 'Less planning breadth and no documented app-blocking layer'],
      ['TaskHero', 'A game-forward mix of habits, tasks, timers, and progression', 'The larger adventure layer can be distracting for some people']
    ],
    sections: [
      {
        heading: 'Choose the emotion, not just the mechanics',
        paragraphs: [
          'Gamification works only if the reward loop feels inviting after the novelty fades. A pet can create care, an RPG can create mastery and belonging, and crafted interaction can make repetition feel less mechanical.',
          'The same layer can become overhead. If maintaining the avatar, economy, or world becomes a second obligation, the product may be rewarding itself more effectively than the underlying behavior.'
        ]
      },
      {
        heading: 'Keep the game subordinate to the behavior',
        paragraphs: [
          'Before choosing, ask whether the app makes the next real-world action clearer and easier. Then check what happens after a missed day. A system that encourages return is usually more useful than one that turns a lapse into punishment.',
          'If you do not enjoy game worlds, use a quiet tracker or focused builder. Emotional attachment is one mechanism, not a universal requirement for habit formation.'
        ]
      }
    ],
    faqs: [
      ['What is the best gamified habit app?', 'There is no universal winner. Finch fits a gentle self-care pet, Habitica fits deep social RPG play, (Not Boring) Habits fits crafted single-habit interaction, and TaskHero fits a game-forward task and habit adventure.'],
      ['Are gamified habit apps effective?', 'They can make repetition emotionally engaging, but a reward loop is not the behavior itself. Fit depends on whether the game reliably supports the real action without becoming the main source of attention.'],
      ['Which gamified habit app is least focused on streaks?', '(Not Boring) Habits explicitly presents a guilt-free model without streak punishment. Verify current product behavior and terms before choosing, because app features can change.']
    ],
    sources: [
      ['Finch official product site', 'https://finchcare.com/'],
      ['Habitica official features page', 'https://habitica.com/static/features?mobile-app=true'],
      ['Not Boring Habits official product page', 'https://notbor.ing/product/habits'],
      ['TaskHero official product site', 'https://taskhero.app/']
    ],
    related: [
      ['Best habit apps for executive-function support', '../../best/habit-apps-executive-function/'],
      ['Do streaks build habits?', '../../guides/do-streaks-build-habits/'],
      ['Browse the 19-app iOS habit app index', '../../habit-apps/']
    ]
  },
  {
    kind: 'guide',
    path: 'guides/habit-app-for-low-motivation/index.html',
    canonical: 'https://habitbuilding.xyz/guides/habit-app-for-low-motivation/',
    title: 'How to Choose a Habit App When Motivation Is Low',
    description: 'Choose a habit app for low-motivation days by reducing action size, clarifying cues, guiding execution, and adding friction to competing behavior.',
    kicker: 'Low-motivation field guide',
    h1: 'When motivation is low, choose the app that reduces the next action',
    lede: 'A dashboard can describe the gap without helping you cross it. The more useful question is what the app does at the exact moment the full action feels too large.',
    shortAnswer: 'There is no universally best habit app for low motivation. First identify the missing support. Ascent fits when one positive action needs a smaller fallback and optional distraction friction. Routinery fits when a known sequence needs step-by-step escorting. Finch fits when gentle emotional attachment makes self-care feel consequential. one sec fits when automatic app opening is the immediate failure point. Persistent low motivation can have many causes; an app is not diagnosis or treatment.',
    rows: [
      ['Ascent', 'Shrink one goal to a visible daily action and two-minute fallback', 'Narrow one-goal system rather than a whole-day planner'],
      ['Routinery', 'Reduce next-step decisions inside a known routine', 'The routine must already be reasonably well designed'],
      ['Finch', 'Attach small self-care actions to a gentle companion', 'The companion world may not fit people who want a quiet tool'],
      ['one sec', 'Interrupt automatic openings before competing apps take over', 'An interruption does not define the positive replacement action']
    ],
    sections: [
      {
        heading: 'Diagnose the moment, not your character',
        paragraphs: [
          'Low follow-through is not enough evidence to label yourself lazy. The action may be vague, too large, badly cued, poorly timed, or repeatedly displaced by something easier.',
          'Write the smallest observable next action. “Exercise” is a category; “put on shoes and walk outside for two minutes” is an action. The small version is not a magic dose. It is a practical fallback that preserves contact with the cue.'
        ]
      },
      {
        heading: 'Match one mechanism to one failure point',
        paragraphs: [
          'Use visible cues when you forget, a routine runner when transitions stall, a smaller fallback when the full action feels expensive, and an interrupter when a competing app wins before you make a choice.',
          'Avoid building a stack that requires more daily maintenance than the habit. Start with one mechanism, observe where it fails for a week or two, and adjust the environment or action before adding more software.'
        ]
      }
    ],
    faqs: [
      ['What is the best habit app when I have no motivation?', 'There is no universal winner. Choose by failure point: Ascent for a smaller positive action, Routinery for a known sequence, Finch for gentle emotional attachment, or one sec for interrupting automatic app openings.'],
      ['Should I make a habit easier on low-motivation days?', 'A smaller fallback can reduce the effort required to begin and preserve the cue-response link. It is not a magic threshold, and the useful size depends on the behavior, person, and context.'],
      ['Can a habit app fix persistent low motivation?', 'An app can provide cues, structure, feedback, or friction, but persistent low motivation may have many causes. Seek qualified support when it is distressing, prolonged, or significantly affects daily life.']
    ],
    sources: [
      ['Review of small changes and behavior maintenance', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/'],
      ['Systematic review of habit formation interventions', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9226889/'],
      ['Review of habit and behavior-change techniques', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7571594/'],
      ['Routinery official product site', 'https://www.routinery.app/'],
      ['Finch official product site', 'https://finchcare.com/'],
      ['one sec official product site', 'https://one-sec.app/']
    ],
    related: [
      ['Best habit apps for executive-function support', '../../best/habit-apps-executive-function/'],
      ['Use a two-minute fallback', '../../guides/two-minute-habit/'],
      ['Browse the 19-app iOS habit app index', '../../habit-apps/']
    ]
  },
  {
    kind: 'guide',
    path: 'guides/do-streaks-build-habits/index.html',
    canonical: 'https://habitbuilding.xyz/guides/do-streaks-build-habits/',
    title: 'Do Streaks Build Habits? What Tracking Can and Cannot Do',
    description: 'Streaks can make repetition visible, but they do not create the cue, action, environment, or recovery plan that makes a behavior durable.',
    kicker: 'Habit tracking field guide',
    h1: 'A streak is feedback, not the habit itself',
    lede: 'A consecutive-day count can focus attention and make repetition satisfying. It can also turn one missed day into a false verdict about the behavior.',
    shortAnswer: 'A streak can support repetition, but it is not a universal habit-building mechanism. Streaks, Habitify, and Productive make records, schedules, and patterns visible in different ways. That feedback can help when the behavior is already clear and well cued. It does not by itself choose a meaningful action, change the environment, shrink the action, or provide a recovery plan. Ascent includes tracking inside a broader one-goal loop, but that wider system is still not a guarantee of behavior change.',
    rows: [
      ['Streaks', 'Fast native tracking, schedules, widgets, Watch, and Health support', 'Primarily records whether the user acted'],
      ['Habitify', 'Detailed organization, reminders, records, and Apple-device sync', 'A capable dashboard can still leave execution to the user'],
      ['Productive', 'Polished routines, streaks, prompts, and guided programs', 'Breadth can feel like another daily checklist'],
      ['Ascent', 'Tracking inside a goal, action, fallback, friction, and reflection loop', 'A narrower one-goal system with fewer pure tracking options']
    ],
    sections: [
      {
        heading: 'What a streak does well',
        paragraphs: [
          'A streak compresses history into a simple signal. It can make consistency visible, reinforce a sense of progress, and expose whether an intended routine is happening.',
          'That simplicity is valuable after the action and cue are defined. For a stable behavior, the lightest recorder may be all the structure needed.'
        ]
      },
      {
        heading: 'What the number cannot do',
        paragraphs: [
          'The count does not tell you whether the action was too large, the cue was weak, the context changed, or a competing behavior was easier. It also cannot decide the best recovery action after a lapse.',
          'Treat a broken streak as data. Keep the next action small, restore the cue, and review the environment. The goal is return, not protection of a perfect number.'
        ]
      }
    ],
    faqs: [
      ['Do streaks actually build habits?', 'Streaks can support repetition by making consistency visible, but the count is feedback rather than the habit itself. Cues, action design, context, repetition, and recovery still matter.'],
      ['Is breaking a streak bad?', 'A missed day is information, not proof of failure. Review what changed, make the next action feasible, and return at the next useful cue instead of compensating with an unrealistic effort.'],
      ['Should I use a tracker or a habit builder?', 'Use a tracker when the behavior is clear and you mainly need a record. Use a broader builder when you need help defining the action, choosing cues, shrinking the fallback, changing friction, or reflecting and adapting.']
    ],
    sources: [
      ['Review of self-monitoring and behavior change', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4566897/'],
      ['Systematic review of habit formation interventions', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9226889/'],
      ['Review of habit and behavior-change techniques', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7571594/'],
      ['Streaks official product site', 'https://streaksapp.com/'],
      ['Habitify official product site', 'https://www.habitify.me/'],
      ['Productive official product site', 'https://productiveapp.io/']
    ],
    related: [
      ['Habit tracker or habit builder?', '../../guides/habit-tracker-vs-habit-builder/'],
      ['Why habit trackers fail', '../../guides/why-habit-trackers-fail/'],
      ['Browse the 19-app iOS habit app index', '../../habit-apps/']
    ]
  }
];

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

function renderPage(page) {
  const listItems = page.rows.map((row, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: row[0]
  }));
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.description,
      datePublished: '2026-07-23',
      dateModified: '2026-07-23',
      mainEntityOfPage: page.canonical,
      author: { '@type': 'Organization', name: 'HabitBuilding.xyz', url: 'https://habitbuilding.xyz/' },
      publisher: { '@type': 'Organization', name: 'HabitBuilding.xyz', url: 'https://habitbuilding.xyz/' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://habitbuilding.xyz/' },
        { '@type': 'ListItem', position: 2, name: page.kind === 'decision' ? 'Best apps' : 'Guides', item: page.canonical },
        { '@type': 'ListItem', position: 3, name: page.h1, item: page.canonical }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(([name, answer]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text: answer }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': 'https://habitbuilding.xyz/#ascent-app',
      name: 'Ascent: Habit Builder & Focus',
      operatingSystem: 'iOS',
      applicationCategory: 'LifestyleApplication',
      url: 'https://habitbuilding.xyz/ascent/',
      downloadUrl: appStore,
      sameAs: [appStore],
      identifier: { '@type': 'PropertyValue', propertyID: 'Apple App Store ID', value: '6756843194' }
    }
  ];
  if (page.kind === 'decision') {
    schemas.splice(2, 0, {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: page.h1,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      itemListElement: listItems
    });
  }

  const schemaHtml = schemas.map((entry) =>
    `<script type="application/ld+json">${json(entry)}</script>`
  ).join('\n');
  const tableRows = page.rows.map(([name, best, limitation]) =>
    `<tr><th scope="row">${escapeHtml(name)}</th><td>${escapeHtml(best)}</td><td>${escapeHtml(limitation)}</td></tr>`
  ).join('\n');
  const bodySections = page.sections.map((section) => `
  <section>
    <div class="wrap reading prose">
      <h2>${escapeHtml(section.heading)}</h2>
      ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n      ')}
    </div>
  </section>`).join('\n');
  const faqHtml = page.faqs.map(([question, answer]) =>
    `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`
  ).join('\n        ');
  const sourceHtml = page.sources.map(([label, url]) =>
    `<li><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></li>`
  ).join('\n        ');
  const relatedHtml = page.related.map(([label, href]) =>
    `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`
  ).join('\n        ');
  const campaign = page.path.split('/')[1].replaceAll('-', '_');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(page.title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
<link rel="canonical" href="${page.canonical}">
<meta property="og:title" content="${escapeHtml(page.h1)}">
<meta property="og:description" content="${escapeHtml(page.description)}">
<meta property="og:url" content="${page.canonical}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#FAF7F2">
<link rel="icon" href="../../img/icon.png">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MEDSTMYLJ3"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MEDSTMYLJ3');</script>
<script defer src="/analytics.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&amp;family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../editorial.css">
${schemaHtml}
</head>
<body>
<header class="site-header">
  <nav class="site-nav wrap" aria-label="Primary navigation">
    <a class="brand" href="../../"><img src="../../img/icon.png" alt="" width="32" height="32">Ascent</a>
    <div class="nav-links">
      <a href="../../habit-apps/">App index</a>
      <a href="../../compare/">Compare</a>
      <a href="../../methodology/">Methodology</a>
      <a class="button" href="${appStore}?utm_source=habitbuilding&amp;utm_medium=site&amp;utm_campaign=${campaign}&amp;utm_content=nav">Get the App</a>
    </div>
  </nav>
</header>

<nav class="breadcrumbs wrap" aria-label="Breadcrumb">
  <ol><li><a href="../../">Home</a></li><li>${page.kind === 'decision' ? 'Best apps' : 'Guides'}</li><li aria-current="page">${escapeHtml(page.h1)}</li></ol>
</nav>

<section class="editorial-hero">
  <div class="wrap reading">
    <span class="kicker">${escapeHtml(page.kicker)}</span>
    <h1>${escapeHtml(page.h1)}</h1>
    <p class="lede">${escapeHtml(page.lede)}</p>
    <p class="review-date"><time datetime="2026-07-23">Updated July 23, 2026</time></p>
  </div>
</section>

<main>
  <section class="answer-block">
    <div class="wrap reading">
      <h2>The short answer</h2>
      <p>${escapeHtml(page.shortAnswer)}</p>
      <p class="disclosure"><strong>How we researched this:</strong> This is document-based editorial research, not a hands-on test. Product descriptions were reviewed from first-party documentation; behavior guidance was checked against the cited research. HabitBuilding.xyz is published by the maker of Ascent. <a href="../../methodology/">Read the full methodology.</a></p>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>Compare the product jobs</h2>
      <p class="section-intro">This is a fit comparison, not a universal ranking. “Main limitation” describes the boundary of the documented product job, not a defect for every user.</p>
      <div class="table-scroll" tabindex="0" role="region" aria-label="App comparison" aria-describedby="table-note">
        <table class="comparison-table">
          <thead><tr><th scope="col">App</th><th scope="col">Best fit in this comparison</th><th scope="col">Main limitation</th></tr></thead>
          <tbody>
${tableRows}
          </tbody>
        </table>
      </div>
      <p id="table-note" class="table-note">Features and positioning were last verified from the linked documents on July 23, 2026.</p>
    </div>
  </section>
${bodySections}

  <section>
    <div class="wrap reading">
      <h2>Frequently asked questions</h2>
      <div class="faq-list">
        ${faqHtml}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap reading">
      <h2>Sources reviewed</h2>
      <p class="section-intro">Product facts come from first-party documents. Research summaries are cautious interpretations, not claims that any one app has been clinically validated.</p>
      <ul class="source-list">
        ${sourceHtml}
      </ul>
    </div>
  </section>

  <section>
    <div class="wrap reading">
      <h2>Continue comparing</h2>
      <ul class="source-list">
        ${relatedHtml}
        <li><a href="../../ascent/">Read the canonical Ascent product guide</a></li>
        <li><a href="../../methodology/">How HabitBuilding.xyz compares products</a></li>
      </ul>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap reading">
      <h2>Want one positive action with a smaller fallback?</h2>
      <p>Ascent combines one 70-day goal plan, a visible daily action, a two-minute fallback, reflection, and optional Screen Time friction. Choose a specialist when its narrower job fits better.</p>
      <a class="button" href="${appStore}?utm_source=habitbuilding&amp;utm_medium=site&amp;utm_campaign=${campaign}&amp;utm_content=footer">View Ascent on the App Store</a>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="footer-row wrap"><span>&copy; 2026 Ascent</span><div class="footer-links"><a href="../../">Home</a><a href="../../habit-apps/">App index</a><a href="../../compare/">Compare</a><a href="../../methodology/">Methodology</a><a href="../../privacy.html">Privacy</a></div></div>
</footer>
</body>
</html>
`;
}

for (const page of pages) {
  const destination = resolve(root, page.path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, renderPage(page), 'utf8');
}

console.log(`Rendered ${pages.length} authority pages.`);
