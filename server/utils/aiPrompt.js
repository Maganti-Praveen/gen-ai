/**
 * Builds a strong system prompt for NVIDIA NIM (LLaMA 3.3 70B)
 * to generate a structured day-wise study plan.
 */
const buildPrompt = ({ syllabus, daysAvailable, hoursPerDay, difficulty }) => {
  const topicsPerDay =
    difficulty === 'easy' ? 3 : difficulty === 'hard' ? 1 : 2;

  return `You are an expert academic planner. Your task is to create a day-wise study plan.

Given Information:
- Syllabus: ${syllabus}
- Total days available: ${daysAvailable}
- Study hours per day: ${hoursPerDay}
- Difficulty level: ${difficulty}

Rules you MUST follow:
1. Break the syllabus into specific, logical topic names (not vague headings).
2. Assign approximately ${topicsPerDay} topic(s) per day based on difficulty.
3. Insert a revision session every 3rd day. On revision days, topics = previously covered topics summary, revision = true.
4. The LAST 2 DAYS must be reserved for "Full Revision" (no new topics, revision = true).
5. Distribute topics evenly. Do not leave any syllabus topic uncovered.
6. Duration should be expressed as "${hoursPerDay} hours" for study days and "1.5 hours" for revision days.

CRITICAL: Return ONLY a valid JSON array. No markdown fences, no explanation, no extra text.
The array format is EXACTLY:
[
  { "day": 1, "topics": ["Topic Name 1", "Topic Name 2"], "duration": "${hoursPerDay} hours", "revision": false },
  { "day": 3, "topics": ["Revision: Topic 1, Topic 2"], "duration": "1.5 hours", "revision": true },
  ...
]`;
};

module.exports = { buildPrompt };
