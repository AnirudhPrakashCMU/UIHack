const { OpenAI } = require('openai');
const fs = require('fs');
const { extractSummaryAndCharacters } = require('./bookUtils');


class OpenAIGame {
  constructor(bookPath, client) {
    let text = fs.readFileSync(bookPath, 'utf8');
    if (bookPath.endsWith('.json')) {
      try {
        const obj = JSON.parse(text);
        if (Array.isArray(obj.rooms)) {
          text = obj.rooms.map(r => r.text).join('\n');
        }
      } catch (_) {}
    }
    this.openai = client || (process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null);
    this.summaryPromise = extractSummaryAndCharacters(text, this.openai)
      .then(({ summary, characters }) => {
        this.bookSummary = summary;
        this.characters = characters;
      })
      .catch(err => {
        console.error('[OpenAIGame] Failed to derive summary', err.message);
        const fallback = text.slice(0, 200);
        this.bookSummary = fallback;
        this.characters = [];
      });
    const lines = text.split(/\r?\n/);
    const start = Math.floor(Math.random() * lines.length);
    this.bookText = lines.slice(start).join('\n');
    this.log = [];
    this.initialized = false;
    this.baseSystem =
      'You are a text adventure game engine. Provide the next portion of the story. Options may be offered if helpful. Never use markdown, bold, or italic text. Bold text is racist. Keep replies in plain prose and incorporate any character dialogue directly.';
    this.startPrompt = 'Begin the adventure based on the book.';
    // API key presence is checked but no verbose logging
    this.initPromise = this.initialize();
  }

  async initialize() {
    if (!this.openai) return;
    const messages = [
      {
        role: 'system',
        content:
          'You are a text adventure game. Use the following book as source material:\n' +
          this.bookText
      },
      { role: 'user', content: this.startPrompt }
    ];
    const chat = await this.openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages,
      max_tokens: 200
    });
    const reply = chat.choices[0].message.content.trim();
    this.log.push({ role: 'user', content: this.startPrompt });
    this.log.push({ role: 'assistant', content: reply });
    this.initialized = true;
    return reply;
  }

  async submit(command) {
    if (!this.initialized) {
      await this.initPromise;
    }
    const messages = [
      { role: 'system', content: this.baseSystem },
      ...this.log,
      { role: 'user', content: command }
    ];
    if (!this.openai) throw new Error('OPENAI_API_KEY not set');
    try {
      const chat = await this.openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages,
        max_tokens: 200
      });
      const reply = chat.choices[0].message.content.trim();
      this.log.push({ role: 'user', content: command });
      this.log.push({ role: 'assistant', content: reply });
      return reply;
    } catch (err) {
      console.error('[OpenAIGame] OpenAI request failed:', err.response?.status, err.message);
      throw err;
    }
  }

  getLog() {
    return this.log.slice();
  }

  clearLog() {
    this.log = [];
  }

  reset() {
    this.log = [];
    this.initialized = false;
    this.initPromise = this.initialize();
  }
}

module.exports = OpenAIGame;


