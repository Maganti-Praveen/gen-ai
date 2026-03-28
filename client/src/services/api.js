import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

/**
 * Generate a study plan from text input
 * @param {Object} payload - { syllabus, examDate, hoursPerDay, difficulty }
 */
export const generatePlanFromText = (payload) =>
  API.post('/api/generate-plan', payload);

/**
 * Generate a study plan from a file upload
 * @param {FormData} formData - contains file, examDate, hoursPerDay, difficulty
 */
export const generatePlanFromFile = (formData) =>
  API.post('/api/generate-plan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * Get all saved study plans
 */
export const getPlans = () => API.get('/api/plans');

/**
 * Get a single plan by ID
 */
export const getPlanById = (id) => API.get(`/api/plans/${id}`);

/**
 * Update day completion status
 * @param {string} id - plan ID
 * @param {number} dayIndex - index of the day in plan array
 * @param {boolean} completed
 */
export const updateProgress = (id, dayIndex, completed) =>
  API.patch(`/api/plans/${id}/progress`, { dayIndex, completed });

export default API;
