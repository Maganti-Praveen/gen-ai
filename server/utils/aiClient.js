const OpenAI = require('openai');
const Groq = require('groq-sdk');

/**
 * AI Client with automatic fallback.
 *
 * Primary:  NVIDIA NIM (meta/llama-3.3-70b-instruct) — 10s timeout
 * Fallback: Groq (llama-3.1-8b-instant) — used if primary times out or fails
 *
 * Both are OpenAI-compatible, so the response shape is identical.
 */

// ── Primary: NVIDIA NIM ──
const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// ── Fallback: Groq ──
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const NVIDIA_MODEL = 'meta/llama-3.3-70b-instruct';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const TIMEOUT_MS = 10000; // 10 seconds

/**
 * Race a promise against a timeout.
 * @param {Promise} promise
 * @param {number} ms - timeout in milliseconds
 * @returns {Promise}
 */
const withTimeout = (promise, ms) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TIMEOUT')), ms);
    promise
      .then((val) => { clearTimeout(timer); resolve(val); })
      .catch((err) => { clearTimeout(timer); reject(err); });
  });
};

/**
 * Call AI with automatic NVIDIA → Groq fallback.
 *
 * @param {Object} params
 * @param {Array} params.messages  - Chat messages [{role, content}]
 * @param {number} [params.temperature=0.3]
 * @param {number} [params.max_tokens=4096]
 * @returns {Promise<{ text: string, provider: string }>}
 */
const callAI = async ({ messages, temperature = 0.3, max_tokens = 4096 }) => {
  // ── Try NVIDIA first (10s timeout) ──
  try {
    console.log('🔷 Calling NVIDIA NIM...');
    const completion = await withTimeout(
      nvidiaClient.chat.completions.create({
        model: NVIDIA_MODEL,
        messages,
        temperature,
        max_tokens,
      }),
      TIMEOUT_MS
    );

    const text = completion.choices[0]?.message?.content?.trim() || '';
    console.log('✅ NVIDIA responded successfully');
    return { text, provider: 'nvidia' };
  } catch (nvidiaErr) {
    const reason = nvidiaErr.message === 'TIMEOUT' ? 'timed out (>10s)' : nvidiaErr.message;
    console.warn(`⚠️ NVIDIA failed: ${reason} → Falling back to Groq...`);
  }

  // ── Fallback: Groq ──
  try {
    console.log('🟢 Calling Groq (fallback)...');
    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens,
    });

    const text = completion.choices[0]?.message?.content?.trim() || '';
    console.log('✅ Groq responded successfully');
    return { text, provider: 'groq' };
  } catch (groqErr) {
    console.error('❌ Both NVIDIA and Groq failed');
    throw new Error(`AI unavailable — NVIDIA and Groq both failed. Groq error: ${groqErr.message}`);
  }
};

module.exports = { callAI };
