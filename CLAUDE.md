# EDGE SAT/ACT Tutor Resource Kit

## Project Purpose
Internal on-demand support tool for SAT/ACT tutors during live sessions. Tutors search a skill, Claude generates teaching guides, practice questions, and session tools in real time. Not student-facing. No content database â€” everything generated via Claude API.

## Tech Stack
- **Framework**: Next.js (App Router) + TypeScript (strict mode)
- **AI**: Vercel AI SDK (`ai`) with `@ai-sdk/anthropic` â€” `generateObject` only, never `generateText` for structured outputs
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas for all generated outputs
- **Deployment**: Vercel

## Architecture Rules
1. **All Claude API calls go through `/app/api/generate/route.ts` only** â€” never call Anthropic from client components
2. **All prompts live in `/lib/prompts.ts`** â€” never write prompt strings inline anywhere else
3. **All output schemas live in `/lib/schemas.ts`** â€” use `generateObject` with Zod, never parse raw text
4. **All skill data lives in `/lib/taxonomy.ts`** â€” never hardcode skill names in components
5. **TypeScript strict mode on** â€” no `any` types
6. **Every API route must handle errors** and return meaningful error responses with appropriate HTTP status codes

## Folder Structure
```
/app
  /api
    /generate
      route.ts          â† all Claude API calls
  page.tsx              â† main tutor dashboard
  layout.tsx
/lib
  taxonomy.ts           â† skill data with IDs and metadata
  schemas.ts            â† Zod schemas for all generated output types
  prompts.ts            â† all prompt templates
/components
  SkillSearch.tsx
  OutputCard.tsx
  SessionTools.tsx
  LoadingState.tsx
/types
  index.ts              â† shared TypeScript types (inferred from Zod schemas)
```

## Environment Variables
- `ANTHROPIC_API_KEY` â€” server-side only, never expose to client
- Set in `.env.local` locally, Vercel environment variables in production

## API Contract
POST `/api/generate`
```json
{
  "capability": "teachingGuide | workedExample | practiceSet | miniLesson | exitTicket | homework | parentUpdate | progressNote",
  "skillId": "string matching taxonomy ID",
  "subject": "SAT | ACT",
  "options": { "duration": 30, "difficulty": "medium", "studentStrength": "...", ... }
}
```
Returns validated structured JSON or `{ error: string }` with 4xx/5xx status.

## Taxonomy Shape
```ts
{
  id: string           // stable slug e.g. "math-function-notation"
  name: string         // display name
  subject: string[]    // ["SAT", "ACT"]
  domain: string       // "Math" | "Reading" | "Writing"
  difficulty: string   // "foundational" | "intermediate" | "advanced"
  tags: string[]
  calculatorAllowed: boolean
}
```

## Output Schema Types
| Schema | Key Fields |
|--------|-----------|
| `TeachingGuideSchema` | concept_overview, simple_explanation, common_misconceptions[], tutor_talking_points[] |
| `WorkedExampleSchema` | problem, step_by_step[], final_answer, tutor_note |
| `PracticeSetSchema` | easy[], medium[], hard[] â€” each: question, answer, explanation |
| `MiniLessonSchema` | objective, opening_hook, instruction_steps[], check_for_understanding, closing |
| `ExitTicketSchema` | questions[3] â€” each: question, answer |
| `HomeworkSchema` | skill_focus, instructions, questions[5] |
| `ParentUpdateSchema` | student_strength, main_gap, skills_practiced, homework_assigned, encouragement_note |
| `ProgressNoteSchema` | session_summary, concepts_covered, student_performance, next_steps |

## Design Direction
- **Base**: Dark navy (`#0F172A` / `slate-900`) or deep slate
- **Accent**: Sharp amber (`#F59E0B`) or cyan (`#06B6D4`) for buttons and badges
- **Typography**: Sharp, professional, readable at speed â€” tutors read this under live session pressure
- **Principle**: No decorative elements. Every UI element must serve a function. Fast and scannable above all.
- **Loading states**: Required on every API call â€” use `LoadingState` component
- **Responsive**: Laptop and tablet (tutors use both during sessions)

## Build Phases (complete in order)
- [x] Phase 1 â€” Project Setup
- [x] Phase 2 â€” Taxonomy and Schemas
- [x] Phase 3 â€” Prompt Templates
- [x] Phase 4 â€” API Route
- [x] Phase 5 â€” Core UI
- [x] Phase 6 â€” Session Tools Panel
- [x] Phase 7 â€” Strategy Coaching Section
- [ ] Phase 8 â€” Polish and Deploy

## Skills in Scope (initial set)
**Math**: Linear Equations, Percents, Ratios, Functions, Function Notation, Quadratics, Exponents, Systems of Equations
**Writing**: Comma Rules, Subject-Verb Agreement, Transitions, Apostrophes
**Reading**: Main Idea, Inference, Vocabulary in Context, Author's Purpose

## Strategy Cards (Phase 7 â€” static, no API)
Time Management, Guessing Strategy, Process of Elimination, Desmos Calculator Tips, Reading Passage Approach, Science Reasoning (ACT)

## Long-Term Vision
Integrate into EDGE Student Success System â€” connect tutor, student, and parent views based on diagnostics, practice tests, goals, and progress data. Future: extend taxonomy to Algebra I, AP courses, Georgia Milestones without rebuilding.

## Key Constraints
- No student-facing content in this tool
- No content database â€” all content generated on demand
- Session workflow must be fast â€” tutors use this under time pressure mid-session
- Parent Update and Progress Note must feel professional enough to send directly
