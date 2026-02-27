/**
 * split text into chunks for AI processing
 * @param {string} text - Full text
 * @param {number} chunkSize - Target size per chunk (im words)
 * @param {number} overlap - Number of words to overlap betweeen chunks
 * @returns {Array<{content:string,chunkIndex:number, pageNumber:number}>}
 */

import { stopWords } from '../helper';
import { TEXT_CHUNK_TYPES } from '../types';

export const textChunkFunc = ({
  text,
  chunkSize = 500,
  overlap = 50,
}: {
  text: string;
  chunkSize?: number;
  overlap?: number;
}) => {
  //Handle edge case: empty or whitespace-only text
  if (!text || text.trim().length === 0) {
    return [];
  }

  //clean the text while preserving paragraph struct
  const cleanedText = text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\s+/g, ' ') // Replace multiple spaces/tabs with a single space
    .replace(/\n /g, '\n') // Remove space after newline
    .replace(/ \n/g, '\n') // Remove space before newline
    .trim();

  //try to split by paragraphs (single or double newlines)
  const paragraph: string[] = cleanedText
    .split(/\n+/)
    .filter((p) => p.trim().length > 0);
  const chunks: TEXT_CHUNK_TYPES[] = [];
  let currentChunk: string[] = [];
  let currWordCount: number = 0;
  let chunkIndex: number = 0;

  // Iterate through paragraphs to create chunks
  for (const para of paragraph) {
    const paragraphWords: string[] = para.trim().split(/\s+/);
    const paraWordCount: number = paragraphWords.length;

    //if single para exceeds chunk size, split by words
    if (paraWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join('\n\n'),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        currentChunk = [];
        currWordCount = 0;
      }

      //split large para into word-based chunk
      for (let i = 0; i < paragraphWords?.length; i += chunkSize - overlap) {
        const chunkWords: string[] = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(' '),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });

        // Stop if the next slice would start past the end of the words
        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue;
    }

    //if adding this paragraph exceeds chunk size, save current chunk
    if (currWordCount + paraWordCount > chunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join('\n\n'),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      //create overlap from previous chunk
      const previousChunkText: string = currentChunk.join(' ');
      const previousWords: string[] = previousChunkText.split(/\s+/);
      const overlapText: string = previousWords
        .slice(-Math.min(overlap, previousWords.length))
        .join(' ');

      currentChunk = [overlapText, para.trim()];
      currWordCount = overlapText.split(/\s+/).length + paraWordCount;
    } else {
      //add paragraph to current chunk
      currentChunk.push(para.trim());
      currWordCount += paraWordCount;
    }
  }

  //add the last chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      chunkIndex: chunkIndex,
      pageNumber: 0,
    });
  }

  //Fall back: if no chunks created, split by words
  if (chunks.length === 0 && cleanedText.length > 0) {
    const allwords: string[] = cleanedText.split(/\s+/);

    for (let i = 0; i < allwords.length; i += chunkSize - overlap) {
      const chunkWords: string[] = allwords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(' '),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      if (i + chunkSize >= allwords.length) break;
    }
  }
  return chunks;
};

/**
 * key word match
 * @param {Array<Object>} chunk - array of chunk
 * @param {string} query - search query
 * @param {number} maxChunks - Maximum chunks to return
 * @param {Array<Object>}
 */
export const findRelevantChunks = ({
  chunks,
  query,
  maxChunks = 3,
}: {
  chunks: TEXT_CHUNK_TYPES[];
  query: string;
  maxChunks?: number;
}) => {
  //Handle edge case: empty
  if (!chunks || chunks?.length === 0 || !query) {
    return [];
  }

  //extract  and clean  query words
  const queryWords: string[] = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    //Return clean chunk objects without Mongoose metadata
    return chunks.slice(0, maxChunks).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content: string = chunk.content.toLowerCase();
    const contentWords: number = content.split(/\s+/).length;
    let score: number = 0;

    //score  each query  word
    for (const word of queryWords) {
      //exact words match(high score)
      const exactWordMatches: number = (
        content.match(new RegExp(`\\b${word}\\b`, 'g')) || []
      ).length;
      score += exactWordMatches * 3;

      //partial match (lower score)
      const partialWordMatches: number = (
        content.match(new RegExp(word, 'g')) || []
      ).length;
      score += Math.max(0, partialWordMatches - exactWordMatches) * 1.5;
    }

    //Bonus multiple query word found
    const getUniqueWords: number = queryWords.filter((w) =>
      content.includes(w)
    ).length;

    if (getUniqueWords > 1) {
      score += getUniqueWords * 2;
    }

    //Normalize by content length
    const normalizedScore: number = score / Math.sqrt(contentWords);

    //bonus for earlier chunk
    const positionBouns = 1 - (index / chunks.length) * 0.1;

    //Return clean obj (exclude mongoose metadata)
    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBouns,
      rawScore: score,
      matchedWords: getUniqueWords,
    };
  });
  return scoredChunks
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.matchedWords !== a.matchedWords) {
        return b.matchedWords - a.matchedWords;
      }
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
