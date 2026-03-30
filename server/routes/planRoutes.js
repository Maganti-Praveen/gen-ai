const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
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
} = require('../controllers/planController');

// Plan generation & AI features (protected)
router.post('/generate-plan', protect, generatePlan);
router.post('/extract-topics', protect, extractTopics);
router.post('/study-tips', protect, getStudyTips);
router.post('/generate-quiz', protect, generateQuiz);

// Plan CRUD (protected)
router.get('/plans', protect, getPlans);
router.get('/plans/:id', protect, getPlanById);
router.patch('/plans/:id/progress', protect, updateProgress);
router.patch('/plans/:id/edit', protect, editPlan);
router.post('/plans/:id/share', protect, sharePlan);
router.post('/plans/:id/quiz-score', protect, saveQuizScore);
router.delete('/plans/:id', protect, deletePlan);

// Public shared plan (NO auth)
router.get('/shared/:token', getSharedPlan);

module.exports = router;
