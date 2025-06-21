const request = require('supertest');
const path = require('path');
const fs = require('fs');
process.env.GAME = 'example';
const app = require('../src/server');

describe('server', () => {
  test('serves initial state', async () => {
    const res = await request(app).get('/state');
    expect(res.status).toBe(200);
    expect(typeof res.body.text).toBe('string');
  });

  test('can switch games', async () => {
    const res = await request(app)
      .post('/select-game')
      .send({ game: 'starwars' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.text).toBeDefined();
  });
});
