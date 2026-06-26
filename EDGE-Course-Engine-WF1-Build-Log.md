# EDGE Course Engine — Workflow 1 Build Log
**Pathway Creation Pipeline: Form Submission → Claude Package → Google Doc → Gate 1**
Last updated: 2026-06-24

---

## Overview

This document captures every decision, configuration, error, and fix from the build session for Workflow 1 of the EDGE Pathway Creation Pipeline. Use this as the authoritative reference for rebuilding, debugging, or onboarding someone new to the system.

---

## Workflow Architecture

```
Google Sheets Trigger
        ↓
Update Row in Sheet  (sets status → NEW)
        ↓
Code Node  (extracts form fields from trigger)
        ↓
Basic LLM Chain  (sends prompt to Claude)
    └── Anthropic Chat Model  (sub-node: claude-opus-4-8)
        ↓
Google Docs  (creates doc with Claude output)  ← IN PROGRESS
        ↓
Update Row in Sheet  (writes doc URL, sets status → OUTLINE READY)  ← NOT YET BUILT
```

**n8n instance:** cate.app.n8n.cloud
**Workflow name:** EDGE — Pathway Request → Claude Package

---

## Infrastructure

| Resource | ID / URL |
|---|---|
| Pipeline Dashboard Sheet | `1s3Da-957-Q1ggT6n5rZNcHcaHC_fLk9bac9hqwUnDoA` |
| Google Form (live) | `https://docs.google.com/forms/d/e/1FAIpQLScaHZPiOlPZbe43OlRvyRfAtFWYV_YHuIR77c7s7E45R9nVDw/viewform` |
| Form ID | `1hG-eWs42vper5fGgr7lFzgD5Uu3FoUbEMHXvLDMNLFg` |
| n8n Google Sheets credential ID | `Fz96ubToOT9HXXGr` |
| Supabase schema files | `edge-tutor-kit/supabase/` |

---

## Pipeline Sheet Column Map

| Column | Header |
|---|---|
| A | Timestamp (auto, form) |
| B | Course |
| C | State |
| D | Schedule Type |
| E | Cohort Context |
| F | Priority Level |
| G | Target Live Date in LearnWorlds |
| H | Additional Notes for Claude |
| I | Pipeline Status |
| J | Claude Output Doc |
| K | Gate 1 Approved |
| L | Pictory Videos |
| M | Gate 2 Approved |
| N | Coursebox Link |
| O | Gate 3 Approved |
| P | LearnWorlds URL |
| Q | Notes |

**Status progression:** NEW → OUTLINE READY → OUTLINE APPROVED → VIDEOS READY → VIDEOS APPROVED → IN COURSEBOX → READY TO EXPORT → LIVE

---

## Node Configurations

### Node 1 — Google Sheets Trigger

| Field | Value |
|---|---|
| Node type | Google Sheets Trigger |
| Credential | Fz96ubToOT9HXXGr (existing Google Sheets credential) |
| Trigger event | Row Added |
| Document ID | `1s3Da-957-Q1ggT6n5rZNcHcaHC_fLk9bac9hqwUnDoA` |
| Sheet name | Pipeline |
| Poll interval | Every 1 minute |

**Notes:**
- Trigger is poll-based, not real-time webhook. During testing use "Fetch Test Event" button on the node to manually poll instead of waiting.
- Set to Row Added only — not Row Updated. If Updated is included, every status write-back creates an infinite loop.

---

### Node 2 — Update Row in Sheet (Set Status → NEW)

| Field | Value |
|---|---|
| Node type | Google Sheets (Update Row operation) |
| Credential | Fz96ubToOT9HXXGr |
| Document ID | `1s3Da-957-Q1ggT6n5rZNcHcaHC_fLk9bac9hqwUnDoA` |
| Sheet name | Pipeline |
| Column to match on | Timestamp |
| Match value | `{{ $('Google Sheets Trigger').item.json['Timestamp'] }}` |
| Pipeline Status column | `NEW` (typed as fixed text) |
| All other columns | Leave blank |

**Notes:**
- Column to Match On is a required field — the node errors silently and stops execution if missing.
- The Timestamp column is used as the unique row identifier because each form submission has a unique timestamp.
- Leave all other columns blank — n8n only overwrites columns with values entered.

---

### Node 3 — Code Node (Extract Form Fields)

| Field | Value |
|---|---|
| Node type | Code |
| Language | JavaScript (NOT JSON — switching to JSON causes "unexpected token" error) |

**JavaScript:**

```javascript
const t = $('Google Sheets Trigger').first().json;

const course = t.Course || 'Algebra: Concepts & Connections';
const state = t.State || 'Georgia';
const schedule = t['Schedule Type'] || 'Traditional';
const cohort = t['Cohort Context'] || 'Not provided';
const notes = t['Additional Notes for Claude'] || 'None';

return [{
  json: {
    course: course,
    state: state,
    scheduleType: schedule,
    cohortContext: cohort,
    notes: notes
  }
}];
```

**Output fields passed forward:**

| Field | Source column |
|---|---|
| `course` | Column B |
| `state` | Column C |
| `scheduleType` | Column D |
| `cohortContext` | Column E |
| `notes` | Column H |

**Notes:**
- This node exists to strip spaces from field names. Google Sheets column names with spaces (e.g., "Schedule Type", "Additional Notes for Claude") cannot be reliably used inside JSON bodies or expression strings in subsequent nodes.
- Using simple single-word output keys (course, state, scheduleType, etc.) eliminates all downstream expression syntax errors.
- The Code node must be inserted BETWEEN the Update Row node and the Basic LLM Chain — not before Update Row.

---

### Node 4 — Basic LLM Chain

| Field | Value |
|---|---|
| Node type | Basic LLM Chain |
| Prompt type | Define below (NOT "Take from previous node automatically" — that grays out the field) |

**Prompt (User Message):**

```
Build the complete Pathway to Success package.

Course: {{ $json.course }}
State: {{ $json.state }}
Schedule: {{ $json.scheduleType }}
Cohort: {{ $json.cohortContext }}
Notes: {{ $json.notes }}

Georgia K-12 Mathematics Standards 2023 — Algebra: Concepts & Connections

Units:
- MM: Mathematical Modeling (embedded, both semesters)
- Unit 1: Quantitative Reasoning with Functions (S1)
- Unit 2: Linear and Absolute Value Functions (S1)
- Unit 3: Linear and Absolute Value Equations and Inequalities (S1)
- Unit 4: Systems of Equations and Inequalities (S1)
- Unit 5: Polynomial Expressions (S2)
- Unit 6: Quadratic Functions (S2)
- Unit 7: Quadratic Equations (S2)
- Unit 8: Statistics and Data Analysis (S2)
- Unit 9: Capstone — Connections and Applications (S2)

Generate all 9 units fully with KNOW SHOW GROW for each, misconceptions list, and Tutor Kit notes.
```

**System Prompt** (add via "Add Field" → System Message if available):

```
You are the EDGE Education Group AI content architect. Build Pathways to Success using the KSG framework. KNOW: activate prior knowledge, students define My Goals — their personal success definition, not a grade. SHOW: direct instruction tied to specific Georgia state standard codes. GROW: escalating practice problems, AI coach provides nudges not answers. Tutors use GROW as their session starting point. Output full KNOW SHOW GROW structure, a misconceptions list, and Tutor Kit notes for every unit. Never use the word course or lesson.
```

**Connected sub-node:** Anthropic Chat Model (connects at the Model slot on the bottom of the node)

---

### Node 4a — Anthropic Chat Model (sub-node)

| Field | Value |
|---|---|
| Node type | Anthropic Chat Model |
| Credential | Anthropic API key (added as new credential in this node) |
| Model | claude-opus-4-8 |
| Max tokens | 8096 |

**Notes:**
- This is a sub-node — it attaches to the bottom of the Basic LLM Chain at the "Model" connector.
- It does NOT connect in the main left-to-right flow. The flow goes: Code → Basic LLM Chain → Google Docs.
- Claude's response is available in subsequent nodes as `{{ $json.text }}`.

---

### Node 5 — Google Docs (Create Document) — IN PROGRESS

| Field | Value |
|---|---|
| Node type | Google Docs |
| Operation | Create a Document |
| Credential | Google account (same account that owns the Pipeline Sheet) |
| Drive | My Drive (default) |
| Folder | Leave blank |
| Title | `{{ $('Code').item.json.course }} — Pathway Package — {{ $now.format('yyyy-MM-dd') }}` |
| Content | `{{ $json.text }}` (Claude's output from Basic LLM Chain) |

**Status:** Credential connection and title configuration in progress. Content field may be under "Add Field" / "Additional Fields" in the node.

---

### Node 6 — Update Row in Sheet (Set Status → OUTLINE READY) — NOT YET BUILT

| Field | Value |
|---|---|
| Node type | Google Sheets (Update Row operation) |
| Credential | Fz96ubToOT9HXXGr |
| Document ID | `1s3Da-957-Q1ggT6n5rZNcHcaHC_fLk9bac9hqwUnDoA` |
| Sheet name | Pipeline |
| Column to match on | Timestamp |
| Match value | `{{ $('Google Sheets Trigger').item.json['Timestamp'] }}` |
| Pipeline Status column | `OUTLINE READY` |
| Claude Output Doc column | `{{ $json.id }}` (Google Doc ID from Node 5 output) |

---

## Errors Encountered and Fixes

### Error 1 — Google Sheets Trigger: Row Added vs Row Updated
**Symptom:** Workflow re-triggered every time a status column was updated.
**Cause:** Trigger set to fire on both Row Added and Row Updated.
**Fix:** Set trigger to Row Added only.

---

### Error 2 — Update Row: "Column to match on parameter is required"
**Symptom:** Workflow stopped at Node 2 with a required field error.
**Cause:** The Timestamp matching column was not saved in the Update Row node configuration.
**Fix:** Set Column to Match On = Timestamp, value = `{{ $('Google Sheets Trigger').item.json['Timestamp'] }}`.

---

### Error 3 — Update Row: Gray arrow after Update Row (Code and HTTP Request not executing)
**Symptom:** Only the first two nodes executed. Code node and HTTP Request showed gray (not run).
**Cause:** The Code node was added to the workflow after the test run was executed. The trigger had already fired and the execution did not re-run subsequent nodes.
**Fix:** Add a new test row to the sheet to trigger a fresh execution with the full node chain in place.

---

### Error 4 — Code node: "unexpected token 'c' — const is not valid JSON"
**Symptom:** Code node failed on execution.
**Cause:** The Code node language was set to JSON instead of JavaScript.
**Fix:** Switch the language dropdown inside the Code node from JSON to JavaScript before pasting code.

---

### Error 5 — HTTP Request: "JSON parameter needs to be valid JSON"
**Symptom:** HTTP Request node failed with JSON validation error.
**Cause (attempt 1):** n8n validates the JSON body structure before evaluating `{{ }}` expressions. Field names with spaces inside bracket notation (e.g., `$json['Schedule Type']`) broke the validator.
**Cause (attempt 2):** Long string literals with embedded newlines and single/double quote mixing caused parser failures on copy/paste.
**Fix:** Replaced the HTTP Request node entirely with the native n8n **Basic LLM Chain + Anthropic Chat Model** node combination. This eliminates all manual JSON body construction and handles the API call natively.

---

### Error 6 — Basic LLM Chain: Prompt field grayed out
**Symptom:** Could not edit the Prompt field — it was grayed out and showed `{{ $json.chatInput }}`.
**Cause:** The Prompt type was set to "Take from previous node automatically," which locks the field.
**Fix:** Change the Prompt type dropdown to "Define below" — the field becomes editable immediately.

---

### Error 7 — HTTP Request: No input data
**Symptom:** HTTP Request node showed no input and no output.
**Cause:** The Code node was present in the canvas but had no JavaScript in it (empty editor).
**Fix:** Paste the Code node JavaScript into the editor. Confirm the Code node language is JavaScript, not JSON.

---

## Full Pipeline Status

| Phase | Status |
|---|---|
| Google Form (intake) | Live |
| Pipeline Dashboard Sheet | Live |
| Supabase schema (courses, units, standards, objectives) | Live |
| Supabase seed (Algebra: C&C — 10 units, 46 objectives) | Live |
| n8n Workflow 1: Trigger → Status NEW | Working |
| n8n Workflow 1: Code node (field extraction) | Working |
| n8n Workflow 1: Claude API call (Basic LLM Chain) | Working — all green checks confirmed |
| n8n Workflow 1: Google Docs (create output doc) | In progress |
| n8n Workflow 1: Update Sheet → OUTLINE READY + doc link | Not yet built |
| Gate 1 review process | Not yet built |
| n8n Workflow 2: OUTLINE APPROVED → Pictory AI | Not yet built |
| n8n Workflow 3: VIDEOS APPROVED → Coursebox AI | Not yet built |
| n8n Workflow 4: READY TO EXPORT → LearnWorlds | Not yet built |
| SSS student-facing schema (03_sss_schema.sql) | Not yet built |

---

## Pending: Complete Workflow 1 (Next Session Starts Here)

1. Finish configuring Google Docs node — connect credential, set title expression, find and set Content field (`{{ $json.text }}`)
2. Add final Update Row node — write doc URL to column J, set Pipeline Status to OUTLINE READY
3. Test full workflow end-to-end with a real form submission
4. Activate workflow (toggle from inactive to active in n8n)
5. Submit the form, confirm doc appears in Google Drive, confirm sheet status updates

---

## Content Framework Reference

### KSG Structure (applied to every unit)
- **KNOW** — Mindset activation, prerequisite check, My Goals prompt (student defines their own success)
- **SHOW** — Key concepts tied to Georgia standard codes, worked example outline, common errors
- **GROW** — Escalating practice structure, real-world connection, AI coach nudge template

### Terminology Rules
- Never say "course" → say "Pathway to Success"
- Never say "lesson" → say KNOW, SHOW, or GROW stage
- "My Goals" = student-defined success, set in KNOW, stored in Supabase, never overwritten
- AI coach = tutor amplifier, not tutor substitute

### SSS Ecosystem
Students are supported by: AI coach (between tutor sessions) + My Goals + misconception library + Tutor Kit notes + non-cognitive scaffolding. Tutors are the relationship. Claude is the intelligence layer between sessions.
