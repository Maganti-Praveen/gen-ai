const OpenAI = require('openai');
const multer = require('multer');
const StudyPlan = require('../models/StudyPlan');
const { buildPrompt } = require('../utils/aiPrompt');
const { extractTextFromPDF } = require('../utils/pdfParser');

// Multer — memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'text/plain'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'), false);
    }
  },
});

// Initialize NVIDIA NIM client (OpenAI-compatible)
const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

/**
 * POST /api/generate-plan
 * Accepts multipart/form-data (with optional file) or JSON body
 */
const generatePlan = [
  upload.single('file'),
  async (req, res) => {
    try {
      let { syllabus, examDate, hoursPerDay, difficulty } = req.body;

      // --- Extract syllabus from uploaded file ---
      if (req.file) {
        if (req.file.mimetype === 'application/pdf') {
          syllabus = await extractTextFromPDF(req.file.buffer);
        } else {
          syllabus = req.file.buffer.toString('utf-8');
        }
      }

      // --- Validate required fields ---
      if (!syllabus || !examDate || !hoursPerDay) {
        return res.status(400).json({
          error: 'syllabus, examDate, and hoursPerDay are required.',
        });
      }

      // --- Calculate days until exam ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exam = new Date(examDate);
      exam.setHours(0, 0, 0, 0);
      const diffMs = exam - today;
      const daysAvailable = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (daysAvailable < 1) {
        return res.status(400).json({
          error: 'Exam date must be at least 1 day in the future.',
        });
      }

      // --- Build prompt ---
      const prompt = buildPrompt({
        syllabus: syllabus.trim(),
        daysAvailable,
        hoursPerDay: Number(hoursPerDay),
        difficulty: difficulty || 'medium',
      });

      // --- Call NVIDIA NIM API (OpenAI-compatible) ---
      const completion = await client.chat.completions.create({
        model: 'meta/llama-3.3-70b-instruct',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert academic planner. You MUST return ONLY a valid JSON array. No markdown, no explanation, no extra text — just the raw JSON array.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      });

      const rawText = completion.choices[0]?.message?.content?.trim() || '';

      // --- Parse JSON safely ---
      let plan;
      try {
        // Strip accidental markdown fences if any
        const cleaned = rawText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```$/i, '')
          .trim();
        plan = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error('NVIDIA raw response:', rawText);
        return res.status(500).json({
          error: 'AI returned invalid JSON. Please try again.',
          raw: rawText,
        });
      }

      // --- Save to MongoDB ---
      const savedPlan = await StudyPlan.create({
        syllabus: syllabus.trim(),
        examDate,
        hoursPerDay: Number(hoursPerDay),
        difficulty: difficulty || 'medium',
        plan,
      });

      return res.status(201).json({
        id: savedPlan._id,
        plan: savedPlan.plan,
        daysAvailable,
      });
    } catch (err) {
      console.error('generatePlan error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  },
];

/**
 * GET /api/plans
 * Return all saved plans (latest first)
 */
const getPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find().sort({ createdAt: -1 }).limit(20);
    return res.json(plans);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/plans/:id
 * Return a single saved plan
 */
const getPlanById = async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    return res.json(plan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /api/plans/:id/progress
 * Body: { dayIndex: number, completed: boolean }
 */
const updateProgress = async (req, res) => {
  try {
    const { dayIndex, completed } = req.body;
    const plan = await StudyPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    if (plan.plan[dayIndex] === undefined) {
      return res.status(400).json({ error: 'Invalid day index' });
    }

    plan.plan[dayIndex].completed = completed;
    plan.markModified('plan');
    await plan.save();

    return res.json({ success: true, plan: plan.plan });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { generatePlan, getPlans, getPlanById, updateProgress };
