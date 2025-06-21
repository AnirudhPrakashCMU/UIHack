const axios = require('axios');
const fs = require('fs');
const path = require('path');

let voices = null;

async function fetchVoices() {
  if (!process.env.INWORLD_API_KEY) {
    voices = [];
    return voices;
  }
  try {
    const url = 'https://api.inworld.ai/tts/v1alpha/voices';
    const headers = { Authorization: 'Basic ' + process.env.INWORLD_API_KEY };
    const resp = await axios.get(url, { headers });
    voices = resp.data.voices || [];
    console.log('[inworld] available voices:', voices.map(v => v.name).join(', '));
    return voices;
  } catch (err) {
    console.error('[inworld] failed to fetch voices', err.response?.status || '', err.message);
    voices = [];
    return voices;
  }
}

async function synthesize(text, voiceName, outputDir) {
  if (!process.env.INWORLD_API_KEY) return null;
  if (!voices) await fetchVoices();
  if (!voiceName || !voices.some(v => v.name === voiceName)) {
    voiceName = voices && voices[0] ? voices[0].name : voiceName || 'Hades';
  }
  const url = 'https://api.inworld.ai/tts/v1alpha/text:synthesize-sync';
  const headers = { 'Content-Type': 'application/json', Authorization: 'Basic ' + process.env.INWORLD_API_KEY };
  const body = {
    input: { text },
    voice: { name: voiceName, languageCode: 'en-US' },
    modelId: 'v3'
  };
  try {
    const resp = await axios.post(url, body, { headers });
    const fileName = `${Date.now()}.wav`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(resp.data.audioContent, 'base64'));
    return fileName;
  } catch (err) {
    console.error('[inworld] TTS request failed', err.response?.status || '', err.message);
    return null;
  }
}

module.exports = { fetchVoices, synthesize };
