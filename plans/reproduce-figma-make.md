# Figma Make Replacement — Prompt System for High-Fidelity React UI Generation

A structured prompt system to replicate (and exceed) Figma Make's output quality using Claude or any
frontier model directly, without Figma's token overhead.

---

## How Figma Make Actually Works

Figma Make is Claude Sonnet under the hood, wrapped with:
1. A system prompt enforcing React + Tailwind output
2. A design-context injection (your Figma frame's properties)
3. An iterative loop — each user message refines the same component

You can replicate all three yourself. The token cost savings are significant because you're calling
the API directly instead of routing through Figma's proxy, which adds its own overhead on top of the
model tokens.

---

## The Prompt System (3 Stages)

### Stage 1 — System Prompt (set once per session or as CLAUDE.md in your project)

Use this as the system prompt for your AI tool (Cursor, Claude, Amp, etc.) or as a CLAUDE.md
instruction file in your repo root:

```
You are a senior frontend engineer and UI designer with expertise in React, TypeScript, and Tailwind CSS.
Your task is to produce production-quality, visually distinctive UI components and screens.

<tech_stack>
- React 18+ with TypeScript
- Tailwind CSS (utility classes only — no custom CSS files unless explicitly requested)
- Lucide React for icons (lucide-react package)
- Framer Motion for animations when motion is appropriate
- No external UI component libraries (shadcn, MUI, Ant Design) unless explicitly requested
- Self-contained single-file components unless told otherwise
</tech_stack>

<design_principles>
CRITICAL: Avoid generic "AI slop" aesthetics. Every component must have a deliberate visual identity.

Typography:
- Never use Inter, Roboto, Arial, or system-ui as the primary font
- Import from Google Fonts via @import in a <style> tag or Tailwind font config
- Pair a distinctive display/heading font with a refined body font
- Use font-weight contrast deliberately (light body, heavy headings)

Color:
- Commit to a cohesive palette with CSS custom properties
- Use 1-2 dominant colors with sharp accent colors, not timid pastel spreads
- Dark themes are valid and often preferred — don't default to white

Spacing & Layout:
- Use asymmetry, overlap, and grid-breaking elements when appropriate
- Generous negative space OR controlled density — pick one and commit
- Avoid the default Tailwind card (rounded-lg, shadow-md, p-6) as the primary layout unit

Motion:
- Use Framer Motion for meaningful page-load staggering and hover states
- CSS transitions for simple hover effects
- No gratuitous animation — every motion should communicate state or hierarchy

NEVER produce: purple gradients on white, Inter font, flat cards with rounded-xl shadow-md,
or any layout that looks like a default Tailwind/shadcn template.
</design_principles>

<output_format>
- Output a complete, runnable React component
- Include all imports at the top
- Use a default export
- Add TypeScript types for all props
- Include realistic placeholder data (not "Lorem ipsum" or "Item 1")
- The component must render correctly with zero props (use defaults)
</output_format>
```

---

### Stage 2 — The Design Brief Prompt (per component/screen)

Use this template for each new UI request. Fill in the `[brackets]`:

```
Build a [COMPONENT TYPE] for [PRODUCT/CONTEXT].

## Purpose
[What does this UI do? What problem does it solve? Who uses it?]

## Content
[List the actual data/content that needs to appear. Be specific — real field names,
real copy, realistic numbers. Don't say "some stats" — say "monthly revenue, active users, churn rate".]

## Interactions
[What can the user do? Click, hover, filter, expand, toggle? List each interaction.]

## Aesthetic Direction
[Pick one: brutalist / editorial / luxury-minimal / technical/dark / warm-organic / retro-futuristic /
high-density dashboard / airy marketing / glassy/blur / mono-color-with-accents]

[Optional: Reference a specific aesthetic: "Think Linear.app's sidebar" or "Like Stripe's dashboard
but warmer" or "Vercel's dark theme" — these are style references, not copy requests.]

## Constraints
- Viewport: [desktop / mobile / responsive]
- Color theme: [dark / light / system]
- [Any other hard constraints]
```

**Example filled brief:**

```
Build a loan pipeline dashboard card for a private mortgage lending SaaS.

## Purpose
Shows a loan origination officer their current active deals at a glance. Used daily.
Needs to communicate urgency (days until commitment expiry) and deal size quickly.

## Content
- Borrower name and loan ID
- Loan amount (formatted as $1.2M)
- LTV ratio
- Days remaining until commitment expiry (color-coded: green >14, yellow 7-14, red <7)
- Stage badge (Application / Underwriting / Approved / Funded)
- Assigned analyst name + avatar

## Interactions
- Click card → navigate to deal detail (use onClick prop, no routing needed)
- Hover → subtle elevation and reveal a "Quick Actions" row (Approve, Request Docs, Flag)
- Stage badge is a dropdown to update stage

## Aesthetic Direction
Technical/dark — dense information, professional, like a Bloomberg terminal crossed with
Linear.app. High contrast, monospace accents for numbers, no decorative elements.

## Constraints
- Desktop first, 380px min card width
- Dark theme required
- Must work in a CSS Grid layout alongside other cards
```

---

### Stage 3 — The Iteration Prompt (refine without starting over)

After getting a first version, use structured iteration instead of vague feedback:

```
Iterate on the component with these specific changes:

VISUAL:
- [Specific visual change — e.g., "Make the header font Syne instead of the current font"]
- [e.g., "The stage badges need more contrast — use filled solid colors not outlines"]

LAYOUT:
- [e.g., "Compress the card height — remove the bottom padding and tighten line-height on the meta row"]

BEHAVIOR:
- [e.g., "The hover quick-actions should slide up from the bottom of the card, not fade in"]

DATA:
- [e.g., "Add a 'flagged' boolean prop — when true, show a red left border stripe on the card"]

Do not change anything not listed above. Preserve all existing TypeScript types and props.
```

The explicit "do not change anything not listed" instruction is critical — it prevents the model from
"helpfully" refactoring things you didn't ask about.

---

## Prompt Patterns That Consistently Improve Output

### 1. Aesthetic Reference via Anti-Pattern

Instead of: *"Make it look modern and clean"*

Use: *"Avoid: rounded-xl cards, gradient backgrounds, Inter font, purple-blue color schemes,
hero sections with centered text and a CTA button. Instead: dense grid, monospace where appropriate,
sharp edges or very subtle border-radius (2-4px), strong typographic hierarchy."*

Telling the model what to avoid is often more effective than describing what you want.

### 2. Constraint-First for Complex Components

Lead with the hard constraints before the feature description. Models tend to lock in their
architectural decisions early — if you bury "this must support virtualized lists of 10,000 rows"
at the end, you'll get a rewrite:

```
CONSTRAINTS FIRST:
- Virtualized list (react-window or similar) — will render up to 50,000 rows
- No external state management — component must be self-contained
- Must support controlled selection (selectedIds prop + onSelectionChange callback)

NOW the feature: Build a data table for...
```

### 3. Provide a Token Budget Hint for Large UIs

```
This is a full-page layout. Allocate your output as follows:
- 60% on the main content area (the data table)
- 25% on the sidebar filters
- 15% on the top navigation bar
Do not gold-plate the nav — it's secondary.
```

### 4. Realistic Data Makes Better Designs

Placeholder data quality directly affects the visual output. The model's layout decisions change
based on the length and shape of the content it sees.

Bad: `name: "John Doe"`, `amount: "$100"`
Good: `borrowerName: "Heritage Capital Partners LLC"`, `loanAmount: "$2,450,000"`, `ltv: "72.3%"`

### 5. The "Print the Design System First" Pattern

For multi-screen projects, generate the design system before any screens:

```
Before building any components, output a React file called design-system.tsx that exports:
- COLOR_TOKENS object (all colors as hex values with semantic names)
- TYPOGRAPHY object (font families, size scale, weight scale)
- A <ThemeProvider> component that injects CSS custom properties
- 5-8 primitive components: Button (3 variants), Badge (4 variants), Input, Label, Divider

Use this design system as the foundation for all subsequent components I ask you to build.
Make the aesthetic: [your aesthetic direction here]
```

This dramatically reduces inconsistency across a multi-session project.

---

## Lightweight Project Setup

Minimal Vite + React + Tailwind scaffold that matches what Figma Make outputs, without the lock-in:

```bash
npm create vite@latest my-design -- --template react-ts
cd my-design
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react framer-motion
```

`tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Claude will fill these in based on the design system prompt
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
}
```

Drop generated components into `src/components/` and import them into `src/App.tsx`.
Each component is self-contained and portable — no Figma dependency, no token limits.

---

## Cost Comparison

| Approach | Token overhead | Per-component approx cost (Sonnet) |
|---|---|---|
| Figma Make | Figma proxy + model tokens + enforced retry loops | Hidden in Figma seat cost; hits limits quickly |
| Direct API (these prompts) | Model tokens only | ~$0.01–0.05 per component depending on complexity |
| Claude.ai (this chat) | None beyond conversation | Included in subscription |

For a typical 20-screen SaaS product, direct prompting costs less than $2 in API tokens versus
hitting Figma Make's limits on a handful of screens.

---

## Quick Reference — Aesthetic Direction Vocabulary

When you say one of these in the brief, the model knows what visual language to use:

| Term | Visual Reference |
|---|---|
| `editorial` | NYT, Stripe press pages — strong typography, generous whitespace, serif accents |
| `technical/dark` | Linear, Vercel, GitHub dark — high contrast, monospace, minimal decoration |
| `luxury-minimal` | Apple, Notion — extreme whitespace, single accent color, refined micro-typography |
| `high-density dashboard` | Bloomberg, Datadog — packed grid, small text, color = data encoding |
| `brutalist` | Figma's own marketing site (2022), Are.na — raw structure, no softening |
| `warm-organic` | Craft, Loom — rounded but not childish, warm tones, friendly micro-copy |
| `glassy/blur` | macOS Sonoma, iOS — backdrop-filter blur, translucency, depth layers |
| `retro-futuristic` | Raycast, Arc — nostalgic palette with modern motion |