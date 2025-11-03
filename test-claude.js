// Claude APIの直接テスト
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを読み込む
dotenv.config({ path: join(__dirname, '.env.local') });

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

console.log('Testing Claude API...');
console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length || 0);

const result = streamText({
  model: anthropic('claude-3-haiku-20240307'),
  messages: [
    {
      role: 'user',
      content: 'こんにちは',
    },
  ],
});

console.log('Stream created, reading...');

const reader = result.textStream.getReader();
let chunkCount = 0;

try {
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      console.log('Stream finished. Total chunks:', chunkCount);
      break;
    }

    chunkCount++;
    const text = new TextDecoder().decode(value);
    console.log(`Chunk ${chunkCount}:`, text);
  }
} catch (error) {
  console.error('Error reading stream:', error);
} finally {
  reader.releaseLock();
}