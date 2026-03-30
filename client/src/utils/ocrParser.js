import Tesseract from 'tesseract.js';

/**
 * Extract text from an image file using Tesseract.js OCR
 * @param {File} imageFile - The image file to process
 * @param {function} onProgress - Callback with progress percentage (0-100)
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImage = async (imageFile, onProgress = () => {}) => {
  try {
    const result = await Tesseract.recognize(imageFile, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && m.progress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });
    return result.data.text.trim();
  } catch (err) {
    throw new Error('OCR failed: ' + err.message);
  }
};
