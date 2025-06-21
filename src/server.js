require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { StoryEngine } = require('./storyEngine');
const VisualCache = require('./visualCache');
const OpenAIGame = require('./openaiEngine');
const multer = require('multer');
const { spawn } = require('child_process');
const { CharacterInterface } = require('./characterInterface');
const https = require('https');
const { fetchVoices, synthesize } = require('./inworld');
const { OpenAI } = require('openai');

const openaiGlobal = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function checkInworldConnectivity() {
  if (!process.env.INWORLD_API_KEY) {
    // no key provided; character features disabled
    return;
  }
  await fetchVoices();
}

const app = express();
let gameMode = process.env.GAME || null;
function isZork() {
  return gameMode === 'zork' || gameMode === 'hitchhiker';
}
let engine = null;
let cache = null;
let frotzProc = null;
let outputBuffer = '';
let frotzLog = '';
let lastText = '';
let lastAudio = null;
let lastImage = null;
let lastImagePrompt = null;
// character interactions will be wired in Task 2.5
checkInworldConnectivity();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

async function prepare() {
  // clear previous prompts and visuals on each start
  fs.writeFileSync(path.join(__dirname, '..', 'impprompt.txt'), '');
  cache = new VisualCache(path.join(__dirname, '..', 'cache'));
  cache.clear();
  if (!isZork()) {
    let storyFile;
    if (gameMode === 'hunger') {
      storyFile = path.join(__dirname, '..', 'stories', 'hunger_games.json');
    } else if (gameMode === 'starwars') {
      storyFile = path.join(__dirname, '..', 'stories', 'star_wars.json');
    } else {
      storyFile = path.join(__dirname, '..', 'stories', 'example_story.json');
    }
    engine = new OpenAIGame(storyFile);
    try {
      const text = await engine.initPromise;
      await engine.summaryPromise;
      if (text) {
        const { text: finalText, audioPath } = await generateAudioFor(text);
        lastText = finalText;
        lastAudio = audioPath;
        lastImage = await ensureVisual(Date.now().toString(), finalText, '');
      }
    } catch (err) {
      console.error('Initial game setup failed:', err.message);
    }
  } else {
    const fileName = gameMode === 'hitchhiker' ? 'hitchhikersguide.z3' : 'zork1.z3';
    const gamePath = path.join(__dirname, '..', 'game_data', fileName);
    const command = fs.existsSync('/usr/games/dfrotz')
      ? '/usr/games/dfrotz'
      : fs.existsSync('/usr/bin/dfrotz')
        ? '/usr/bin/dfrotz'
        : 'dfrotz';
    frotzLog = '';
    let first = true;
    frotzProc = spawn(command, [gamePath]);
    const firstOutput = new Promise(resolve => {
      frotzProc.stdout.once('data', async d => {
        let text = d.toString();
        text = text.replace(/Using normal formatting.*\n?/i, '');
        text = text.replace(/Loading.*\n?/i, '');
        outputBuffer += text;
        frotzLog += text;
        if (!lastImage) {
          lastImage = await ensureVisual(Date.now().toString(), outputBuffer, '', frotzLog);
        }
        first = false;
        resolve();
      });
    });
    frotzProc.stdout.on('data', async d => {
      if (first) return; // handled in firstOutput
      const text = d.toString();
      outputBuffer += text;
      frotzLog += text;
    });
    await firstOutput;
  }
}

app.use(express.json());
app.use('/visual', express.static(path.join(__dirname, '..', 'cache')));
app.use(express.static(path.join(__dirname, '..', 'public')));

const audioDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// visual generation with debug logging
function truncateWords(str, n) {
  return str.split(/\s+/).slice(0, n).join(' ');
}

async function summarizeForImage(text) {
  const client = engine && engine.openai ? engine.openai : openaiGlobal;
  if (!client) return truncateWords(text, 75);
  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'user',
          content: `Summarize this scene for an image in under 75 words:\n${text}`
        }
      ],
      max_tokens: 150
    });
    return resp.choices[0].message.content.trim();
  } catch (err) {
    console.error('[server] prompt summarization failed', err.message);
    return truncateWords(text, 75);
  }
}

async function ensureVisual(key, prompt = 'scene', movement = '', extraLog = '') {
  let context = '';
  if (engine) {
    const logText = engine
      .getLog()
      .map(e => e.content)
      .join('\n');
    context = logText.slice(-1000);
  } else if (extraLog) {
    context = extraLog.slice(-1000);
  }
  const summary = engine ? engine.bookSummary : '';
  const chars = engine ? engine.characters.join(', ') : '';
  const longPrompt =
    (summary ? `Book summary: ${summary}\n` : '') +
    (chars ? `Characters: ${chars}\n` : '') +
    (context ? `History:\n${context}\n` : '') +
    (movement ? `Movement: ${movement}\n` : '') +
    `Current scene: ${prompt}`;

  // only use the scene text when generating the actual image prompt
  const finalPrompt = await summarizeForImage(prompt);
  // save request prompt for debugging
  const logPath = path.join(__dirname, '..', 'impprompt.txt');
  try {
    fs.appendFileSync(logPath, longPrompt + '\n---\n' + finalPrompt + '\n---\n');
  } catch (_) {}
  let generator;
  if (process.env.VISUAL_API_KEY) {
    generator = async () => {
      const body = JSON.stringify({
        model: 'dall-e-3',
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      });
      try {
        fs.appendFileSync(logPath, body + '\n===\n');
      } catch (_) {}
      const resp = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VISUAL_API_KEY}`
        },
        body
      });
      if (!resp.ok) {
        console.error('[server] OpenAI image request failed', resp.status);
        const b64 = fs.readFileSync(
          path.join(__dirname, '..', 'public', 'placeholder.png.base64'),
          'utf8'
        );
        return Buffer.from(b64, 'base64');
      }
      const data = await resp.json();
      return Buffer.from(data.data[0].b64_json, 'base64');
    };
  } else {
    generator = async () => {
      const b64 = fs.readFileSync(
        path.join(__dirname, '..', 'public', 'placeholder.png.base64'),
        'utf8'
      );
      return Buffer.from(b64, 'base64');
    };
  }
  const filePath = await cache.getVisual(key, generator);
  lastImagePrompt = prompt;
  return `/visual/${key}.png`;
}

async function createStoryFromImage(imagePath) {
  if (!openaiGlobal) throw new Error('OPENAI_API_KEY not set');
  const imageData = fs.readFileSync(imagePath, 'base64');
  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text:
            'Describe a short interactive story setting inspired by this image. Keep under 300 words.'
        },
        {
          type: 'image_url',
          image_url: { url: `data:image/png;base64,${imageData}` }
        }
      ]
    }
  ];
  const chat = await openaiGlobal.chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: 400
  });
  const text = chat.choices[0].message.content.trim();
  const filePath = path.join(uploadDir, 'custom_story.txt');
  fs.writeFileSync(filePath, text);
  return filePath;
}

function buildState() {
  if (!isZork()) {
    return { text: lastText, audioPath: lastAudio, imagePath: lastImage, isZork: false };
  }
  return { text: outputBuffer, imagePath: lastImage, isZork: true };
}

app.get('/state', async (req, res) => {
  res.json(buildState());
});

app.post('/select-game', async (req, res) => {
  const { game } = req.body;
  if (!['zork', 'hitchhiker', 'starwars', 'hunger', 'example', 'custom'].includes(game)) {
    return res.status(400).json({ error: 'invalid game' });
  }
  if (frotzProc) {
    frotzProc.kill();
    frotzProc = null;
  }
  gameMode = game;
  engine = null;
  cache = null;
  outputBuffer = '';
  frotzLog = '';
  lastText = '';
  lastAudio = null;
  lastImage = null;
  await prepare();
  res.json(buildState());
});

app.post('/build-story', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'image required' });
  if (frotzProc) {
    frotzProc.kill();
    frotzProc = null;
  }
  try {
    const storyPath = await createStoryFromImage(req.file.path);
    gameMode = 'custom';
    engine = new OpenAIGame(storyPath);
    fs.writeFileSync(path.join(__dirname, '..', 'impprompt.txt'), '');
    cache = new VisualCache(path.join(__dirname, '..', 'cache'));
    cache.clear();
    await engine.summaryPromise;
    lastText = await engine.initPromise;
    lastAudio = (await generateAudioFor(lastText)).audioPath;
    lastImage = await ensureVisual(Date.now().toString(), lastText, '');
    res.json(buildState());
  } catch (err) {
    console.error('custom build failed:', err.message);
    res.status(500).json({ error: 'failed to build story' });
  }
});

app.post('/reset', (req, res) => {
  if (frotzProc) {
    frotzProc.kill();
    frotzProc = null;
  }
  gameMode = null;
  engine = null;
  cache = null;
  outputBuffer = '';
  frotzLog = '';
  lastText = '';
  lastAudio = null;
  lastImage = null;
  res.json({ ok: true });
});


async function synthesizeSpeech(character, line) {
  const fileName = await synthesize(line, character, audioDir);
  return fileName ? `/audio/${fileName}` : null;
}

async function generateAudioFor(text) {
  let character = 'Narrator';
  let line = text;
  const m = text.match(/^([^:]+):\s*(.*)$/);
  if (m) {
    character = m[1].trim();
    line = m[2].trim();
  }
  const audioPath = await synthesizeSpeech(character, line);
  return { text, audioPath };
}

app.post('/action', async (req, res) => {
  if (!isZork()) {
    const { command } = req.body;
    if (typeof command !== 'string') {
      res.status(400).json({ error: 'command required' });
      return;
    }
    try {
      const reply = await engine.submit(command);
      const { text: finalText, audioPath } = await generateAudioFor(reply);
      lastText = finalText;
      lastAudio = audioPath;
      lastImage = await ensureVisual(Date.now().toString(), finalText, command);
      res.json(buildState());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    const { command } = req.body;
    if (typeof command !== 'string') {
      res.status(400).json({ error: 'command required' });
      return;
    }
    outputBuffer = '';
    frotzProc.stdin.write(command + '\n');
    setTimeout(async () => {
      frotzLog += outputBuffer;
      lastImage = await ensureVisual(
        Date.now().toString(),
        outputBuffer,
        command,
        frotzLog
      );
      res.json(buildState());
    }, 200);
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const start = () =>
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  if (gameMode) {
    prepare().then(start).catch(err => {
      console.error('Server failed to start:', err);
    });
  } else {
    start();
  }
}

module.exports = app;
