const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  topics: [{ type: String }],
  duration: { type: String },
  revision: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
});

const studyPlanSchema = new mongoose.Schema(
  {
    syllabus: { type: String, required: true },
    examDate: { type: String, required: true },
    hoursPerDay: { type: Number, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    plan: [dayPlanSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
