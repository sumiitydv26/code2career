# Career Quest 🎮🗺️
> Gamified, AI-Powered Career Roadmap & RPG Skill Tree for Hackathons

Career Quest transforms ambitious career goals into an interactive RPG-style skill tree. Instead of static checklists or linear roadmaps, users explore dynamic nodes, manage dependencies, conquer interview boss fights, unlock achievements, and level up from **Novice** to **Hireable**.

---

## 🚀 How to Run the App

1. **Prerequisites**: Node.js 18+ (tested on Node v24 LTS)
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup** (Optional for real AI; mock mode works out-of-the-box):
   ```bash
   cp .env.example .env.local
   # Set your API key if connecting a live LLM
   AI_API_KEY=your_key_here
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. **Open Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack (Strictly Implemented)

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Handcrafted dark RPG theme, WCAG AA contrast)
- **Graph Canvas**: [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Graph Layout**: [@dagrejs/dagre](https://github.com/dagrejs/dagre) (Automatic Left-to-Right hierarchical layout)
- **Animations & Celebrations**: [Framer Motion](https://www.framer.com/motion/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware (`localStorage`)
- **Validation**: [Zod](https://zod.dev/) for strict validation of graph topologies and node detail contracts
- **Image Export**: [html-to-image](https://github.com/bubkoo/html-to-image) for high-resolution PNG export

---

## ⚖️ What is Mocked vs. Real

| Feature | Status | Details |
|---|---|---|
| **Graph & Dagre Auto-Layout** | **REAL** | Fully computed with `@dagrejs/dagre`, renders Left-to-Right with smooth step edges. |
| **RPG State & Game Engine** | **REAL** | XP calculation, level progression (`floor(sqrt(xp/100))+1`), ranks, 5 badges, daily streak detection, and dependency re-routing (`lib/game.ts`). |
| **Prerequisite Re-routing** | **REAL** | Marking a node complete or "already known" (50% XP) dynamically unlocks dependent nodes; un-marking re-locks downstream skills. |
| **Boss Fight Quiz** | **REAL** | Step-by-step interview challenge, rubric hint reveal, self-ratings, bonus XP calculation, and toast notifications. |
| **Roadmap Comparison** | **REAL** | `/compare` view calculates overlapping skill nodes between two goals side-by-side. |
| **PNG Export** | **REAL** | High-res PNG snapshot of the graph canvas via `html-to-image`. |
| **AI Roadmap Generation** | **MOCKED (Stubbed with AI Slot)** | If `AI_API_KEY` is not provided, returns a hand-crafted 18-node climate tech roadmap with ~1.5s artificial delay. |
| **AI Actionable Advice** | **MOCKED (Stubbed with AI Slot)** | If `AI_API_KEY` is not provided, returns realistic why-it-matters, weekend project deliverables, search hints, and interview questions. |

---

## 🔌 Exactly Where to Plug in the LLM Call

All AI generation routes are isolated server-side inside `app/api/`:

### 1. Roadmap Generation: `app/api/roadmap/route.ts`
Look for the marked block:
```typescript
// =========================================================================
// TODO: call LLM here
// Plug in your chosen AI provider (e.g. Google Gemini / OpenAI / Anthropic)
// 1. Send system instructions with RoadmapSchema JSON structure.
// 2. Pass input: goal: "${goal}", hoursPerWeek: ${hoursPerWeek}, months: ${months}, knownSkills: ${JSON.stringify(knownSkills)}.
// 3. Receive JSON response.
// 4. Validate output with RoadmapSchema.parse(rawJson).
// 5. Return validated roadmap.
// =========================================================================
```

### 2. Node Detail Advice: `app/api/node-detail/route.ts`
Look for the marked block:
```typescript
// =========================================================================
// TODO: call LLM here
// Plug in your chosen AI provider (e.g. Google Gemini / OpenAI / Anthropic)
// 1. Send system instructions with NodeDetailSchema JSON structure.
// 2. Prompt with: goal: "${goal}", node: ${JSON.stringify(node)}.
// 3. Receive JSON response containing:
//    - whyItMatters (high-impact context)
//    - weekendProject { title, description, deliverables: string[] }
//    - resources [{ title, kind, searchHint }] (render searchHint as "Search: ...", never invented URLs)
//    - interviewQuestions [{ question, difficulty, idealAnswerHint }]
// 4. Validate output with NodeDetailSchema.parse(rawJson).
// 5. Return validated NodeDetail.
// =========================================================================
```
