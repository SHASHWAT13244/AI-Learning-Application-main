import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  Difficulty,
  GENERATED_REQUEST_TYPES,
  GENERATED_FLASHCARD_RESPONSE_TYPES,
  GENERATED_QUIZ_RESPONSE_TYPES,
} from '../types';
import { Request } from 'express';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
  console.error(
    'FATAL ERROR: GEMINI_API_KEY isn`t set in enviornment variables'
  );
  process.exit(1);
}

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - no.of flashcards
 * @returns {Promise<Array<{question: string, answer: string, difficulty:string}>>}
 */
export const generateGeminiFlashCards = async ({
  text,
  count = 10,
}: GENERATED_REQUEST_TYPES): Promise<GENERATED_FLASHCARD_RESPONSE_TYPES[]> => {
  //  Input Validation
  if (!text || !text.trim()) {
    return [];
  }
  const prompt: string = `
    You are an educational AI assistant.
    Goal: Generate exactly ${count} flashcards based on the provided text.
 Format each flashcard as:
 Q:[Clear, specfic question]
 A:[Concise, accurate answwer]
 D:[Difficulty level: easy,medium or hard]

 Separate each flshcard with '---'

 Text:
 ${text.substring(0, 20000)}
 `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText: string | undefined = response.text;

    if (!generatedText) {
      return [];
    }
    //parse response
    const flashcards: GENERATED_FLASHCARD_RESPONSE_TYPES[] = [];
    const cards: string[] = generatedText?.split('---').filter((c) => c.trim());

    for (const card of cards) {
      const lines: string[] = card.trim().split('\n');
      let question: string = '',
        answer: string = '',
        difficulty: Difficulty = 'medium';

      for (const line of lines) {
        if (line.startsWith('Q:')) {
          question = line.substring(2).trim();
        } else if (line.startsWith('A:')) {
          answer = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          const diff: string = line.substring(2).trim().toLowerCase();
          if (['easy', 'mediun', 'hard'].includes(diff)) {
            difficulty = diff as Difficulty;
          }
        }
      }
      if (question && answer) {
        flashcards.push({
          question: question,
          answer: answer,
          difficulty: difficulty,
        });
      }
    }
    return flashcards.slice(0, count);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate flashcards');
  }
};

/**
 * Generate quiz qns from text
 * @param {string} text - Document text
 * @param {number} count - no.of qns
 * @returns {Promise<Array<{question: string, options:Array: answer: string, explanation:string, difficulty:string}>>}
 */

export const generateGeminiQuiz = async ({
  text,
  count = 5,
}: GENERATED_REQUEST_TYPES): Promise<GENERATED_QUIZ_RESPONSE_TYPES[]> => {
  if (!text || !text.trim()) {
    return [];
  }
  const prompt = `Genearate exactly ${count} multiple questions from the following text.
  Format of each question is:
   Q:[Question]
   O1:[Option 1]
   O2:[Option 2]
   O3:[Option 3]
   O4:[Option 4]
   C:[Correct Option - exactly as written above]
   E:[Brief Explanation]
   D:[Difficulty: easy, medium or hard]

   Separate questions with '---'

   Text: ${text.substring(0, 20000)}
   `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText: string | undefined = result.text;
    if (!generatedText) {
      return [];
    }

    //parse response
    const questions: GENERATED_QUIZ_RESPONSE_TYPES[] = [];
    const qnsBlock: string[] = generatedText
      ?.split('---')
      .filter((c) => c.trim());

    for (const bock of qnsBlock) {
      const lines: string[] = bock.trim().split('\n');
      let question: string = '',
        options: string[] = [],
        explanation: string = '',
        answer: string = '',
        difficulty: Difficulty = 'medium';

      for (const line of lines) {
        const trimmed: string = line.trim();
        if (trimmed.startsWith('Q:')) {
          question = trimmed.substring(2).trim();
        } else if (trimmed.match(/^O\d:/)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith('C:')) {
          answer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('E:')) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('D:')) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (['easy', 'mediun', 'hard'].includes(diff)) {
            difficulty = diff as Difficulty;
          }
        }
      }
      if (question && options.length === 4 && answer) {
        questions.push({
          question: question,
          options: options,
          correctAnswer: answer,
          explanation: explanation,
          difficulty: difficulty,
        });
      }
    }
    return questions.slice(0, count);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

/**
 * Generate document summary
 * @param {string} text - Document text
 * @returns {Promise<string>>}
 */
export const generateSummaryByGemini = async (
  text: string
): Promise<string> => {
  if (!text || !text.trim()) {
    return '';
  }
  const prompt: string = `Provide a concise summary of the following text,highlighting key concepts, main ideas, and keep the summary clean and structured
    Text: ${text.substring(0, 200000)}
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText: string = response.text || '';
    return generatedText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate summary');
  }
};

/**
 * chat with document content
 * @param {string} question - user qns
 * @param {Array<{content:string}>} chunks - Relevent document chunks
 * @returns {Promise<string>>}
 */
export const chatWithContext = async ({
  question,
  chunk,
}: {
  question: string;
  chunk: Array<{ content: string }>;
}) => {
  const context = chunk
    .map((c, i: number) => `[Chunk ${i + 1}]\n${c.content}`)
    .join('\n\n');

  const prompt = `Based on the following context from a document, Analyse the context and answer the user's question.
    If the answer in not in the context, say so.

    Context: ${context}

    Question: ${question}

    Answer:
    `;
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText: string = result.text || '';
    return generatedText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to process chat request');
  }
};

/**
 * Explain specfic concpet
 * @param {string} concept - concept to explain
 * @param {string} context - relavent context
 * @returns {Promise<string>>}
 */
export const explainConceptByGemini = async ({
  concept,
  context,
}: {
  concept: string;
  context: string;
}): Promise<string> => {
  const prompt: string = `Explain the concept of "${concept}" based on the following context.
    Provide a clear, educational explanation that's easy to understand.
    Include examples if relevent

    Context: ${context.substring(0, 10000)}
    `;
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText: string = result.text || '';
    return generatedText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to process chat request');
  }
};
