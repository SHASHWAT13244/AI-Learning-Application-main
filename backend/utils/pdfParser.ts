import { readFile } from "fs/promises";
import { PDFParse } from "pdf-parse";

/**
 * Extract text from PDF file
 * @param {Bufffer} Buffer - path to pdf file
 * @returns {Promise<{text:string, numPages:number, info:any}>}
 */
export const extractTextFromPDF = async (
  buffer: Buffer
): Promise<{ text: string; numPages: number; info: any }> => {
  try {
    // const dataBuffer = await readFile(buffer);
    //pdf-parse expects a Unit8Array, not a buffer
    const parser = new PDFParse(new Uint8Array(buffer));

    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.total,
      info: data,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from pdf");
  }
};
