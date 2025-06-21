require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { loadSummaryFromFile } = require('../src/bookUtils');

async function generateImage(prompt) {
  if (!process.env.VISUAL_API_KEY) {
    console.error('VISUAL_API_KEY not set');
    process.exit(1);
  }
  const body = JSON.stringify({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json'
  });
  const resp = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VISUAL_API_KEY}`
    },
    body
  });
  console.log('Status:', resp.status);
  if (!resp.ok) {
    console.error('Request failed:', await resp.text());
    process.exit(1);
  }
  const data = await resp.json();
  const buffer = Buffer.from(data.data[0].b64_json, 'base64');
  const out = 'test_image.png';
  fs.writeFileSync(out, buffer);
  console.log('Saved image to', out);
}

if (require.main === module) {
  let promptArg = process.argv.slice(2).join(' ');
  if (!promptArg) {
    try {
      const logPath = path.join(__dirname, '..', 'impprompt.txt');
      const data = fs.readFileSync(logPath, 'utf8');
      const entries = data.split('\n===\n').filter(Boolean);
      const last = entries.pop() || '';
      const parts = last.split('\n---\n');
      if (parts.length >= 2) {
        promptArg = parts[1].trim();
      }
    } catch (_) {
      promptArg = '';
    }
  }
  if (!promptArg) promptArg = 'A scenic landscape';
  const storyFile = path.join(__dirname, '..', 'stories', 'hunger_games.json');
  const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  loadSummaryFromFile(storyFile, openai)
    .then(async ({ summary, characters }) => {
      const longPrompt =
        `Book summary: ${summary}\nCharacters: ${characters.join(', ')}\n` +
        promptArg;
      let finalPrompt = longPrompt;
      if (openai) {
        try {
          const resp = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: [
              {
                role: 'user',
                content: `Summarize this scene for an image in under 75 words:\n${longPrompt}`
              }
            ],
            max_tokens: 150
          });
          finalPrompt = resp.choices[0].message.content.trim();
        } catch (e) {
          console.error('Prompt summarization failed:', e.message);
        }
      }
      console.log('Prompt:', finalPrompt);
      return generateImage(finalPrompt);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
