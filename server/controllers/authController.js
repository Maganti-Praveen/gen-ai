const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudyPlan = require('../models/StudyPlan');

/**
 * Helper: sign a JWT for a given user id
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Helper: strip HTML tags from a string
 */
const sanitize = (str) => (str ? str.replace(/<[^>]*>/g, '').trim() : '');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      name: sanitize(name),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plansGenerated: user.plansGenerated,
        quizzesTaken: user.quizzesTaken,
        totalStudyHours: user.totalStudyHours,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plansGenerated: user.plansGenerated,
        quizzesTaken: user.quizzesTaken,
        totalStudyHours: user.totalStudyHours,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
};

/**
 * GET /api/auth/me (protected)
 */
const getMe = async (req, res) => {
  try {
    return res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        plansGenerated: req.user.plansGenerated,
        quizzesTaken: req.user.quizzesTaken,
        totalStudyHours: req.user.totalStudyHours,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/auth/profile (protected)
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = sanitize(name);
    if (email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const dup = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: req.user._id } });
      if (dup) return res.status(409).json({ error: 'Email already in use' });
      updates.email = email.toLowerCase().trim();
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plansGenerated: user.plansGenerated,
        quizzesTaken: user.quizzesTaken,
        totalStudyHours: user.totalStudyHours,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/auth/dashboard (protected)
 */
const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    const plans = await StudyPlan.find({ user: user._id }).sort({ createdAt: -1 });

    const totalPlans = plans.length;
    const recentPlans = plans.slice(0, 5).map((p) => ({
      _id: p._id,
      examDate: p.examDate,
      difficulty: p.difficulty,
      hoursPerDay: p.hoursPerDay,
      daysCount: p.plan.length,
      completedDays: p.plan.filter((d) => d.completed).length,
      topicCount: p.plan.reduce((sum, d) => sum + (d.topics ? d.topics.length : 0), 0),
      createdAt: p.createdAt,
    }));

    const daysActive = Math.ceil(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plansGenerated: totalPlans,
        quizzesTaken: user.quizzesTaken,
        totalStudyHours: user.totalStudyHours,
        daysActive,
        createdAt: user.createdAt,
      },
      recentPlans,
      totalPlans,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile, getDashboardStats };
