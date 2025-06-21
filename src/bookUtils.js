function extractCharacters(text) {
  const freq = {};
  const nameRegex = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)?\b/g;
  let match;
  while ((match = nameRegex.exec(text)) !== null) {
    const name = match[0];
    if (!/^(The|A|An|And|But|For|With|Without|In|On|At|By|To|From|I|He|She|They|We|It)$/.test(name)) {
      freq[name] = (freq[name] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([n]) => n);
}

function shortSummary(text, maxWords = 100) {
  const words = text.replace(/\n+/g, ' ').split(/\s+/).slice(0, maxWords);
  return words.join(' ');
}

async function extractSummaryAndCharacters(text, client) {
  let summary = shortSummary(text);
  if (client) {
    try {
      const chat = await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'user',
            content: `Summarize the following book in 100 words or less:\n${text}`
          }
        ],
        max_tokens: 200
      });
      summary = chat.choices[0].message.content.trim();
    } catch (err) {
      console.error('[bookUtils] OpenAI summary request failed', err.message);
    }
  }
  const characters = extractCharacters(text);
  return { summary, characters };
}

function loadSummaryFromFile(file, client) {
  const fs = require('fs');
  let text = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.json')) {
    try {
      const obj = JSON.parse(text);
      if (Array.isArray(obj.rooms)) {
        text = obj.rooms.map(r => r.text || r.description || '').join('\n');
      }
    } catch (_) {}
  }
  return extractSummaryAndCharacters(text, client);
}

module.exports = { extractSummaryAndCharacters, loadSummaryFromFile };
