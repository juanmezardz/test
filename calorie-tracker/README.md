# Build Your Own AI Calorie Tracker in Claude

No app to download. No subscription. No ads. You build a personal calorie and macro tracker
inside Claude that interviews you, calculates your plan, and lets you log food just by typing it
or snapping a photo. It runs in one ongoing chat and updates a live dashboard as you go.

This directory holds everything you need: the paste-ready prompts, the project-instructions
template, and **working reference builds of both screens** you can open in a browser right now.

## What's in here

| File | What it is |
| --- | --- |
| [`setup-interview.html`](setup-interview.html) | The setup interview, working standalone. Answers 11 questions, does the math, prints your finished project instructions with a copy button. |
| [`tracker.html`](tracker.html) | The tracker dashboard, working standalone. Rings, water, 7-day history, diary, light/dark, backup codes. |
| [`prompts/setup-interview-prompt-full.txt`](prompts/setup-interview-prompt-full.txt) | The Step 2 prompt, ready to paste into Claude as-is. |
| [`prompts/setup-interview-prompt.md`](prompts/setup-interview-prompt.md) | The same prompt, annotated. |
| [`project-instructions-template.md`](project-instructions-template.md) | The block that goes in your project's instructions field, plus notes on the `EMBEDDED` data format. |

Open either HTML file by double-clicking it — no build step, no dependencies, no network calls.

## What you will end up with

- A short, friendly setup interview that figures out your calories and macros for you
  (you do not need to know any numbers).
- A premium tracker dashboard: calorie ring, macro rings, water, a 7-day history, and a food diary.
- Food logging two ways: type what you ate ("2 eggs and toast") or attach a photo of your plate.
- Light and dark mode, and a backup code so you never lose your data.

## What you need

- A Claude account (claude.ai). The free plan works; a paid plan runs smoother.
- About 5 minutes for setup.
- Web search left on in Claude (it is on by default). This lets it look up nutrition facts for
  packaged and restaurant foods.

## How it works in plain English

Claude does the thinking in the chat. The dashboard is just the screen that shows your numbers.
When you log a meal, Claude reads it, estimates the calories and macros, and updates the same
dashboard. Everything for the day lives in that one chat.

---

## Step 1: Create the project

1. In Claude, go to Projects, then New project.
2. What are you working on: `Macro Tracker`
3. What are you trying to achieve: `My personal calorie and macro tracker. Setup is run by an interview.`
4. Click Create project.

## Step 2: Run the setup interview

Open a chat inside the project and paste the contents of
[`prompts/setup-interview-prompt-full.txt`](prompts/setup-interview-prompt-full.txt).
Answer the questions one screen at a time. At the end it calculates your plan and gives you an
instructions block to save.

> Prefer to skip the chat? Open [`setup-interview.html`](setup-interview.html) in a browser —
> it runs the exact same interview and math locally and gives you the same instructions block.

## Step 3: Save your plan to the project

When the interview finishes, Claude gives you a block titled PROJECT INSTRUCTIONS.

1. Copy the whole block.
2. Open your project's settings and find the Project instructions field. This is the project's
   instructions box, not a chat message.
3. Paste the block in and save.

This is what makes the project remember your plan in every chat.

## Step 4: Build your tracker

Start a new chat inside the project and send:

```
Build my tracker.
```

Your dashboard appears, empty, loaded with your targets. This is the one you keep using.

## Step 5: Use it every day

In that same chat, just talk to it:

- Type a meal: `log breakfast: 3 eggs, oatmeal with banana, black coffee`
- Log a photo: attach a picture of your plate, then `log this as lunch`
- Add water: `add 2 glasses of water`
- Check in: `how many calories do I have left?`
- Force a verified lookup on a packaged item: `verify` or `look it up`
- End the day: `wrap the day` and it gives you a summary plus your backup code

Claude reads what you logged, shows the breakdown, and updates the same dashboard each time.

## Backup and restore

Your data is saved in the browser you use. To protect it, open the Backup & Restore section at the
bottom of the tracker and tap Copy save code every few days. Keep that code in your notes. If
anything ever resets, paste it into the Restore field and you are back where you left off.

## Best practices

- Use the higher reasoning setting (or Opus) for the most reliable updates.
- Keep using the same chat day to day.
- If the numbers start looking off or Claude slows down, it has filled its memory for that chat.
  Fix it in three steps: start a new chat in the same project, send `Build my tracker`, then paste
  your latest save code. Your plan lives in the project instructions and your data lives in the
  save code, so you lose nothing.

## Good to know

- This is a personal, single-device tracker. Your data lives on the device you use it on and does
  not sync across phone and laptop. Move it with the save code if you switch.
- Food numbers are smart estimates, grounded with a web lookup for packaged and restaurant items.
  They are in the same range as any tracking app, not lab measurements.

---

## How the reference build works

### `setup-interview.html`

Vanilla HTML/CSS/JS, one file, no dependencies. Screens are driven by a question list; the plan is
computed in `computePlan()` using only the standards named on the results screen:

- **BMR** — Mifflin-St Jeor.
- **TDEE** — BMR × activity multiplier (1.2 / 1.375 / 1.55 / 1.725 / 1.9).
- **Calorie target** — pace-based deficit (250 / 400 / 750), capped so weekly loss stays at or under
  ~1% of bodyweight, and never below 1,500 cal for men or 1,200 for women. Surplus of 250–400 for
  gaining. TDEE for maintaining.
- **Macros** — protein 1.0 g/lb when losing or an athlete, otherwise 0.8 g/lb; fat 0.35 g/lb; carbs
  take the remaining calories. Keto and low-carb redistribute the excess carb calories into fat and
  say so on the results screen.
- **Water** — ~0.75 oz per lb, shown in liters.
- **Timeline** — weekly calorie gap ÷ 3,500 kcal per pound, rounded to whole weeks. Omitted when
  maintaining.

### `tracker.html`

Also one file, no dependencies. The block at the top is the contract with the coach:

```js
var EMBEDDED = {
  plan:  { name, goal, calories, protein, carbs, fat, waterL, calculated },
  log:   [ {id, date:"YYYY-MM-DD", meal:"breakfast|lunch|dinner|snacks", name, serving, cal, p, c, f} ],
  water: { "YYYY-MM-DD": glasses }   // 250 ml each
};
```

`EMBEDDED` is authoritative. The page keeps a signature of it in `localStorage`; when the coach
rewrites the block the signature changes and the page reloads from scratch, so the coach's list
always wins. Between edits the page mirrors state to `localStorage`, so a manual refresh preserves
water taps, deletions, and anything added with the in-page **+ Add food** form.

Today's date comes from JavaScript and is re-checked every 20 seconds, so the day rolls over on its
own and past days stay in the 7-day chart. The save code is base64-encoded JSON of the whole state.

## Disclaimer

This tool and the plan it creates are general guidance, not medical advice. Check with your primary
care physician before starting any new diet or making changes for a medical or dietary condition.
