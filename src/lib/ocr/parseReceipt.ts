import { createWorker } from 'tesseract.js';

export interface OCRResult {
  amount?: number;
  merchant?: string;
  date?: string;
  rawText: string;
}

export async function parseReceiptImage(imageFile: File): Promise<OCRResult> {
  const worker = await createWorker('eng');
  const imageUrl = URL.createObjectURL(imageFile);
  
  const ret = await worker.recognize(imageUrl);
  const text = ret.data.text;
  await worker.terminate();
  URL.revokeObjectURL(imageUrl);

  let detectedAmount: number | undefined = undefined;
  let detectedMerchant: string | undefined = undefined;
  let detectedDate: string | undefined = undefined;

  // 1. Amount Extraction Regex (Find TOTAL, AMOUNT, DUE, or largest dollar figure)
  const lines = text.split('\n');
  const amountRegex = /(?:TOTAL|AMOUNT|BAL|DUE|PAID|\$|€|£)?\s*[:$€£]?\s*(\d+[.,]\d{2})/gi;
  
  const amounts: number[] = [];
  let match;
  while ((match = amountRegex.exec(text)) !== null) {
    const val = parseFloat(match[1].replace(',', '.'));
    if (!isNaN(val)) {
      amounts.push(val);
    }
  }

  // Look specifically for lines containing "TOTAL" or "AMOUNT"
  for (const line of lines) {
    if (/TOTAL|AMOUNT|BALANCE/i.test(line)) {
      const lineMatch = /(\d+[.,]\d{2})/.exec(line);
      if (lineMatch) {
        detectedAmount = parseFloat(lineMatch[1].replace(',', '.'));
        break;
      }
    }
  }

  // Fallback to highest amount found if no TOTAL line matched
  if (!detectedAmount && amounts.length > 0) {
    detectedAmount = Math.max(...amounts);
  }

  // 2. Merchant Extraction (Usually first prominent non-empty line)
  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine.length > 3 && !/\d{2}\/\d{2}/.test(cleanLine) && !/RECEIPT|WELCOME|TAX/i.test(cleanLine)) {
      detectedMerchant = cleanLine;
      break;
    }
  }

  // 3. Date Extraction Regex
  const dateRegex = /(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})|(\d{4}[\/\.-]\d{1,2}[\/\.-]\d{1,2})/;
  const dateMatch = dateRegex.exec(text);
  if (dateMatch) {
    try {
      const parsedDate = new Date(dateMatch[0]);
      if (!isNaN(parsedDate.getTime())) {
        detectedDate = parsedDate.toISOString().slice(0, 10);
      }
    } catch {
      // Ignore date parsing failure
    }
  }

  return {
    amount: detectedAmount,
    merchant: detectedMerchant,
    date: detectedDate,
    rawText: text,
  };
}
