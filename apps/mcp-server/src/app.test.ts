import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { app, transports } from './app.js';

describe('HTTP API 1', () => {
  describe('GET /health', () => {
    it('returns 200 with status ok and transport', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 'ok',
        server: 'spar-mcp',
        version: '0.1.0',
        transport: 'streamable-http',
      });
    });
  });

  describe('GET /info', () => {
    it('returns server metadata', async () => {
      const res = await request(app).get('/info');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: 'spar-mcp',
        version: '0.1.0',
        description: expect.any(String),
        transport: 'streamable-http',
      });
    });
  });

  describe('POST /mcp', () => {
    it('returns 400 when no session ID and body is not initialize request', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'ping' });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: No valid session ID' },
        id: null,
      });
    });

    it('returns 400 when session ID provided but invalid', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Content-Type', 'application/json')
        .set('Mcp-Session-Id', 'invalid-session-id')
        .send({ jsonrpc: '2.0', id: 1, method: 'ping' });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('Bad Request');
    });

    it('processes initialize request (not 400 Bad Request)', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Content-Type', 'application/json')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test-client', version: '1.0.0' },
          },
        });

      // Initialize is accepted (not 400) - MCP may return 200 or negotiate via 406
      expect(res.status).not.toBe(400);
      expect(res.body?.jsonrpc).toBe('2.0');
    });
  });

  describe('error middleware', () => {
    it('returns JSON-RPC error format for unhandled errors', async () => {
      // Trigger error by sending invalid JSON to a route that parses body
      const res = await request(app)
        .post('/mcp')
        .set('Content-Type', 'application/json')
        .send('invalid json {{{');

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        jsonrpc: '2.0',
        error: expect.objectContaining({
          code: expect.any(Number),
          message: expect.any(String),
        }),
      });
    });
  });
});

describe('transports cleanup', () => {
  afterAll(() => {
    for (const sid in transports) {
      delete transports[sid];
    }
  });

  it('transports object is exported for cleanup', () => {
    expect(transports).toBeDefined();
    expect(typeof transports).toBe('object');
  });
});
