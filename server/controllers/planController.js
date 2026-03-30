const OpenAI = require('openai');
const crypto = require('crypto');
const multer = require('multer');
const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');
const { buildPrompt } = require('../utils/aiPrompt');
const { extractTextFromPDF } = require('../utils/pdfParser');

// Multer — memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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
 * Helper: strip HTML tags for sanitization
 */
const sanitize = (str) => (str ? str.replace(/<[^>]*>/g, '').trim() : '');

/**
 * Helper: safely parse JSON from AI response
 */
const parseAIJson = (rawText) => {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  return JSON.parse(cleaned);
};

/**
 * POST /api/generate-plan (protected)
 */
const generatePlan = [
  upload.single('file'),
  async (req, res) => {
    try {
      let { syllabus, examDate, hoursPerDay, difficulty, extractedTopics } = req.body;

      // Extract syllabus from uploaded file
      if (req.file) {
        if (req.file.mimetype === 'application/pdf') {
          syllabus = await extractTextFromPDF(req.file.buffer);
        } else {
          syllabus = req.file.buffer.toString('utf-8');
        }
      }

      if (!syllabus || !examDate || !hoursPerDay) {
        return res.status(400).json({ error: 'syllabus, examDate, and hoursPerDay are required.' });
      }

      syllabus = sanitize(syllabus);

      // Calculate days until exam
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const exam = new Date(examDate); exam.setHours(0, 0, 0, 0);
      const daysAvailable = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

      if (daysAvailable < 1) {
        return res.status(400).json({ error: 'Exam date must be at least 1 day in the future.' });
      }

      // Build prompt
      const prompt = buildPrompt({
        syllabus,
        daysAvailable,
        hoursPerDay: Number(hoursPerDay),
        difficulty: difficulty || 'medium',
      });

      // Call NVIDIA NIM API
      const completion = await client.chat.completions.create({
        model: 'meta/llama-3.3-70b-instruct',
        messages: [
          { role: 'system', content: 'You are an expert academic planner. You MUST return ONLY a valid JSON array. No markdown, no explanation, no extra text — just the raw JSON array.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      });

      const rawText = completion.choices[0]?.message?.content?.trim() || '';

      let plan;
      try {
        plan = parseAIJson(rawText);
      } catch (parseErr) {
        console.error('NVIDIA raw response:', rawText);
        return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.', raw: rawText });
      }

      // Parse extractedTopics if it's a string
      let parsedExtractedTopics = null;
      if (extractedTopics) {
        try {
          parsedExtractedTopics = typeof extractedTopics === 'string' ? JSON.parse(extractedTopics) : extractedTopics;
        } catch (_) {}
      }

      // Save to MongoDB
      const savedPlan = await StudyPlan.create({
        user: req.user._id,
        syllabus,
        examDate,
        hoursPerDay: Number(hoursPerDay),
        difficulty: difficulty || 'medium',
        plan,
        extractedTopics: parsedExtractedTopics,
      });

      // Update user stats
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { plansGenerated: 1, totalStudyHours: daysAvailable * Number(hoursPerDay) },
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
 * POST /api/extract-topics (protected)
 */
const extractTopics = async (req, res) => {
  try {
    let { syllabus } = req.body;
    if (!syllabus) return res.status(400).json({ error: 'Syllabus text is required' });

    syllabus = sanitize(syllabus);

    const completion = await client.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        {
          role: 'system',
          content: `You are a syllabus analyzer. Extract ALL topics and subtopics from the given syllabus. Return ONLY valid JSON with this exact structure, no markdown, no extra text:
{ "units": [{ "unitName": "string", "topics": ["string"], "estimatedHours": number, "difficulty": "easy"|"medium"|"hard" }], "totalTopics": number, "suggestedDays": number, "suggestedHoursPerDay": number }`,
        },
        { role: 'user', content: `Analyze this syllabus and extract all topics:\n\n${syllabus}` },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    const rawText = completion.choices[0]?.message?.content?.trim() || '';
    let topics;
    try {
      topics = parseAIJson(rawText);
    } catch (_) {
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.', raw: rawText });
    }

    return res.json(topics);
  } catch (err) {
    console.error('extractTopics error:', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/study-tips (protected)
 */
const getStudyTips = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const completion = await client.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        {
          role: 'system',
          content: `You are a study coach. Return ONLY valid JSON, no markdown:
{ "topic": "string", "keyConceptsSummary": "2-3 sentence summary", "studyTips": ["3 tips"], "mnemonics": ["1-2 memory aids"], "commonMistakes": ["2-3 mistakes"], "practiceQuestions": ["3 questions"], "youtubeSearchQuery": "search string", "estimatedMasteryTime": "e.g. 2-3 hours" }`,
        },
        { role: 'user', content: `Give study tips for the topic "${sanitize(topic)}" at ${difficulty || 'medium'} difficulty level.` },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    });

    const rawText = completion.choices[0]?.message?.content?.trim() || '';
    let tips;
    try {
      tips = parseAIJson(rawText);
    } catch (_) {
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.', raw: rawText });
    }

    return res.json(tips);
  } catch (err) {
    console.error('getStudyTips error:', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/generate-quiz (protected)
 */
const generateQuiz = async (req, res) => {
  try {
    const { topics, difficulty } = req.body;
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Topics array is required' });
    }

    const completion = await client.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        {
          role: 'system',
          content: `Generate exactly 5 multiple-choice quiz questions. Return ONLY valid JSON, no markdown:
{ "quiz": [{ "question": "string", "options": ["4 option strings"], "correctAnswer": 0-3, "explanation": "string" }] }`,
        },
        { role: 'user', content: `Generate 5 MCQ questions about these topics at ${difficulty || 'medium'} difficulty:\n${topics.map(t => sanitize(t)).join(', ')}` },
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

    const rawText = completion.choices[0]?.message?.content?.trim() || '';
    let quiz;
    try {
      quiz = parseAIJson(rawText);
    } catch (_) {
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.', raw: rawText });
    }

    return res.json(quiz);
  } catch (err) {
    console.error('generateQuiz error:', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/plans/:id/quiz-score (protected)
 */
const saveQuizScore = async (req, res) => {
  try {
    const { score, total, topics } = req.body;
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    plan.quizScores.push({ score, total, topics, date: new Date() });
    await plan.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { quizzesTaken: 1 } });

    return res.json({ success: true, quizScores: plan.quizScores });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/plans (protected — user's plans only)
 */
const getPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    return res.json(plans);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/plans/:id (protected)
 */
const getPlanById = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    return res.json(plan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /api/plans/:id/progress (protected)
 */
const updateProgress = async (req, res) => {
  try {
    const { dayIndex, completed } = req.body;
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
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

/**
 * PATCH /api/plans/:id/edit (protected) — update plan array
 */
const editPlan = async (req, res) => {
  try {
    const { plan: updatedPlan } = req.body;
    if (!updatedPlan || !Array.isArray(updatedPlan)) {
      return res.status(400).json({ error: 'Plan array is required' });
    }

    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    plan.plan = updatedPlan;
    plan.markModified('plan');
    await plan.save();

    return res.json({ success: true, plan: plan.plan });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/plans/:id/share (protected)
 */
const sharePlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    if (!plan.shareToken) {
      plan.shareToken = crypto.randomBytes(16).toString('hex');
    }
    plan.isPublic = true;
    await plan.save();

    return res.json({ shareToken: plan.shareToken });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/shared/:token (NO auth)
 */
const getSharedPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ shareToken: req.params.token, isPublic: true });
    if (!plan) return res.status(404).json({ error: 'Shared plan not found or no longer public' });

    return res.json({
      plan: plan.plan,
      examDate: plan.examDate,
      difficulty: plan.difficulty,
      hoursPerDay: plan.hoursPerDay,
      daysCount: plan.plan.length,
      createdAt: plan.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/plans/:id (protected)
 */
const deletePlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  generatePlan,
  extractTopics,
  getStudyTips,
  generateQuiz,
  saveQuizScore,
  getPlans,
  getPlanById,
  updateProgress,
  editPlan,
  sharePlan,
  getSharedPlan,
  deletePlan,
};
