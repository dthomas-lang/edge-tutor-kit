# EDGE Tutor Resource Kit

Internal session intelligence platform for tutors at The Center at the EDGE. Built for live K-12 tutoring sessions — enter a problem, get a verified solution, find a video, and send a session packet to the student in minutes.

---

## How to Use It

### 1. Set up the session

In the **left sidebar**, select the subject (Algebra 1, Geometry, ELA, etc.).

Optionally pick a **Skill** from the search box below the subject list — this gives the Generate tools context for what you're working on.

In the **center panel**, fill in **Session Options**:
- **Student Name** — personalizes the PDF packet
- **Student Email** — required to send the packet to their profile
- **Difficulty** — used by the Generate tools
- **Session Notes** — any context about the student (strengths, gaps)
- **Homework Assigned** — used by the Parent Update generator

---

### 2. Solve a problem

Type or paste any problem into the input bar at the top of the main area and press **Solve** (or **⌘ Enter** / **Ctrl Enter**).

The platform will:
1. Verify the answer via **Wolfram Alpha** (math subjects)
2. Generate a full **Know · Show · Grow** explanation via Claude

The **Output tab** shows:
- **KNOW** — prerequisites, key vocabulary, watch-out-for
- **SHOW** — step-by-step worked solution with the verified answer
- **GROW** — key takeaway, connections to other concepts, next challenge

A green **Wolfram Verified** badge appears when the solution was independently confirmed.

---

### 3. Use the Visual tool

Click the **Visual tab**.

- **Math subjects** → Desmos Graphing Calculator (full editor — graph equations, explore functions)
- **Geometry** → GeoGebra Geometry (construction tool)
- **ELA** → no visual tool

The calculator stays loaded when you switch tabs — your work won't be lost.

---

### 4. Find a recommended video

Click the **Video tab**.

After a solve, the search bar is pre-filled with a query based on the problem type and subject. Hit **Search** or edit the query to refine it.

Click any result to embed the YouTube player. The selected video will be included in the session packet.

---

### 5. Generate additional resources

The **center panel Generate section** produces on-demand content for the selected skill:

| Button | What it generates |
|--------|------------------|
| Teaching Guide | Concept overview, misconceptions, tutor talking points |
| Worked Example | A new worked problem with step-by-step solution |
| Practice Set | Easy / medium / hard questions with answers |
| Mini Lesson | Objective, hook, instruction steps, check for understanding |
| Exit Ticket | 3 quick check questions |
| Homework | 5 homework problems |
| Parent Update | Professional summary to send home |
| Progress Note | Session summary for your records |

Results appear in the **Output tab**.

---

### 6. Build and send the session packet

After solving a problem, two buttons appear below the KSG card:

**Build Session Packet** — generates a 5-page PDF and downloads it:
- Page 1: Cover (student name, subject, date, problem)
- Page 2: Know · Show · Grow summary
- Page 3: Step-by-step worked solution
- Page 4: Practice problems + answer key
- Page 5: Resources (video link, Desmos/GeoGebra link)

**Send to Student →** — appears after the packet is built. Requires a student email in Session Options. Fires the n8n workflow which delivers the PDF to the student's LearnWorlds profile, logs the session to Google Sheets, and sends a Gmail confirmation.

---

### 7. Student view

Open **Student View →** (top right) in a new tab to see what the student sees during the session. Share your screen or have them open it on their device.

---

## Subjects supported

Algebra 1, Algebra 2, Geometry, Pre-Calculus, Trigonometry, Calculus, Statistics, SAT Math, ACT Math, ELA

---

## Things still marked REPLACE_ME

| Item | Where | What to do |
|------|-------|------------|
| Desmos API key | `components/DesmosEmbed.tsx` | Apply at desmos.com/api for a free non-commercial educational license |
| N8N_WEBHOOK_URL | Vercel environment variables | Add your n8n webhook URL once the workflow is built |
| LEARNWORLDS_API_KEY | Vercel environment variables | Your LearnWorlds API key |
| LEARNWORLDS_CLIENT_ID | Vercel environment variables | Your LearnWorlds client ID |

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires a `.env.local` file with:

```
ANTHROPIC_API_KEY=...
WOLFRAM_APP_ID=...
YOUTUBE_API_KEY=...
N8N_WEBHOOK_URL=...
```

---

Built by The Center at the EDGE · [myedgecenter.com](https://myedgecenter.com)
