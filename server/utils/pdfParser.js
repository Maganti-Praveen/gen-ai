const pdfParse = require('pdf-parse');

/**
 * Extracts text content from a PDF buffer.
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (err) {
    throw new Error('Failed to parse PDF: ' + err.message);
  }
};

module.exports = { extractTextFromPDF };
