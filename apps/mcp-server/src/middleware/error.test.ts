import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorMiddleware, default as McpJsonRpcError } from './error.js';

describe('McpJsonRpcError', () => {
  it('creates error with default values', () => {
    const err = new McpJsonRpcError();
    expect(err.jsonrpc).toBe('2.0');
    expect(err.id).toBeDefined();
    expect(err.error.code).toBe(-32603);
    expect(err.error.message).toBe('Internal error');
    expect(err.statusCode).toBe(500);
  });

  it('creates error with custom message and id', () => {
    const err = new McpJsonRpcError('Not found', 'req-123');
    expect(err.error.message).toBe('Not found');
    expect(err.id).toBe('req-123');
  });

  it('creates error with custom code and statusCode', () => {
    const err = new McpJsonRpcError('Bad Request', undefined, -32000, 400);
    expect(err.error.code).toBe(-32000);
    expect(err.statusCode).toBe(400);
  });

  it('JSON getter returns correct structure', () => {
    const err = new McpJsonRpcError('Test error', 'id-1');
    const json = err.JSON;
    expect(json).toEqual({
      jsonrpc: '2.0',
      id: 'id-1',
      error: {
        message: 'Test error',
        code: -32603,
        data: undefined,
      },
    });
  });

  it('generates UUID when id not provided', () => {
    const err = new McpJsonRpcError('msg');
    expect(typeof err.id).toBe('string');
    expect(err.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});

describe('errorMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  it('handles McpJsonRpcError and returns correct status and JSON', () => {
    const err = new McpJsonRpcError('Custom error', 'req-1', -32000, 400);
    errorMiddleware(err as unknown as Error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      jsonrpc: '2.0',
      id: 'req-1',
      error: { message: 'Custom error', code: -32000, data: undefined },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('converts generic Error to McpJsonRpcError', () => {
    const err = new Error('Something went wrong');
    mockReq.body = { id: 'req-42' };
    errorMiddleware(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        jsonrpc: '2.0',
        id: 'req-42',
        error: expect.objectContaining({
          message: 'Something went wrong',
          code: -32603,
        }),
      }),
    );
  });

  it('calls next when headers already sent', () => {
    (mockRes as Response).headersSent = true;
    const err = new Error('Too late');
    errorMiddleware(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
