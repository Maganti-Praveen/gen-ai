const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  topics: [{ type: String }],
  duration: { type: String },
  revision: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  notes: { type: String, default: '' },
});

const quizScoreSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  topics: [{ type: String }],
});

const studyPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    syllabus: { type: String, required: true },
    examDate: { type: String, required: true },
    hoursPerDay: { type: Number, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    plan: [dayPlanSchema],
    extractedTopics: { type: mongoose.Schema.Types.Mixed, default: null },
    shareToken: { type: String, unique: true, sparse: true },
    isPublic: { type: Boolean, default: false },
    quizScores: [quizScoreSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
