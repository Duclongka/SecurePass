import Tesseract from 'tesseract.js';

export interface OCRResult {
  cardNumber?: string;
  expiryDate?: string;
  idNumber?: string;
}

export const ocrService = {
  scanImage: async (imageSrc: string, type: 'card' | 'document'): Promise<OCRResult> => {
    try {
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng', {
        logger: m => console.log(m)
      });

      const result: OCRResult = {};

      if (type === 'card') {
        // Card Number: 16 digits
        const cardMatch = text.replace(/\s/g, '').match(/\d{16}/);
        if (cardMatch) result.cardNumber = cardMatch[0];

        // Expiry Date: MM/YY
        const expiryMatch = text.match(/\d{2}\/\d{2}/);
        if (expiryMatch) result.expiryDate = expiryMatch[0];
      } else if (type === 'document') {
        // ID Number: 12 digits
        const idMatch = text.replace(/\s/g, '').match(/\d{12}/);
        if (idMatch) result.idNumber = idMatch[0];
      }

      return result;
    } catch (error) {
      console.error('OCR Error:', error);
      throw error;
    }
  }
};
