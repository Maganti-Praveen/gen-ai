const express = require('express');
const router = express.Router();
const {
  generatePlan,
  getPlans,
  getPlanById,
  updateProgress,
} = require('../controllers/planController');

// Generate a new plan (supports both JSON and multipart/form-data)
router.post('/generate-plan', generatePlan);

// Get all saved plans
router.get('/plans', getPlans);

// Get a single plan by ID
router.get('/plans/:id', getPlanById);

// Update day completion progress
router.patch('/plans/:id/progress', updateProgress);

module.exports = router;
