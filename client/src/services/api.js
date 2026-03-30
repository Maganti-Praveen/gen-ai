import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request interceptor: attach Bearer token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('s2s_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('s2s_token');
      // Don't redirect here — let AuthContext handle state
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser = (data) => API.post('/api/auth/login', data);
export const getMe = (token) =>
  API.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
export const updateProfileApi = (data) => API.put('/api/auth/profile', data);
export const getDashboardStats = () => API.get('/api/auth/dashboard');

// ── Plans ──
export const generatePlanFromText = (payload) => API.post('/api/generate-plan', payload);
export const generatePlanFromFile = (formData) =>
  API.post('/api/generate-plan', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getPlans = () => API.get('/api/plans');
export const getPlanById = (id) => API.get(`/api/plans/${id}`);
export const deletePlan = (id) => API.delete(`/api/plans/${id}`);
export const updateProgress = (id, dayIndex, completed) =>
  API.patch(`/api/plans/${id}/progress`, { dayIndex, completed });
export const editPlanApi = (id, plan) => API.patch(`/api/plans/${id}/edit`, { plan });

// ── AI Features ──
export const extractTopicsApi = (syllabus) => API.post('/api/extract-topics', { syllabus });
export const getStudyTips = (topic, difficulty) => API.post('/api/study-tips', { topic, difficulty });
export const generateQuiz = (topics, difficulty) => API.post('/api/generate-quiz', { topics, difficulty });
export const saveQuizScore = (planId, score, total, topics) =>
  API.post(`/api/plans/${planId}/quiz-score`, { score, total, topics });

// ── Sharing ──
export const sharePlanApi = (id) => API.post(`/api/plans/${id}/share`);
export const getSharedPlan = (token) => API.get(`/api/shared/${token}`);

export default API;
