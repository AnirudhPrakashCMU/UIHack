const axios = require('axios');
jest.mock('axios');
const { fetchVoices, synthesize } = require('../src/inworld');
const fs = require('fs');
const path = require('path');

describe('inworld integration', () => {
  const tmp = path.join(__dirname, 'tmp');
  beforeAll(() => {
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
    process.env.INWORLD_API_KEY = 'base64key';
  });
  afterAll(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
    delete process.env.INWORLD_API_KEY;
  });

  test('fetchVoices saves voice list', async () => {
    axios.get.mockResolvedValue({ data: { voices: [{ name: 'Hades' }] } });
    const voices = await fetchVoices();
    expect(voices[0].name).toBe('Hades');
  });

  test('synthesize writes audio file', async () => {
    axios.post.mockResolvedValue({ data: { audioContent: Buffer.from('hi').toString('base64') } });
    const file = await synthesize('hello', 'Hades', tmp);
    expect(fs.existsSync(path.join(tmp, file))).toBe(true);
  });
});
