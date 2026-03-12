import type { JSONRPCErrorResponse } from '@modelcontextprotocol/sdk/types.js';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);

  if (err instanceof McpJsonRpcError) return res.status(err.statusCode).json(err.JSON);

  const newErr = new McpJsonRpcError(err.message, req?.body?.id);
  return res.status(newErr.statusCode).json(newErr.JSON);
};

export default class McpJsonRpcError implements JSONRPCErrorResponse {
  jsonrpc: JSONRPCErrorResponse['jsonrpc'] = '2.0';
  id: JSONRPCErrorResponse['id'];
  error: JSONRPCErrorResponse['error'];
  statusCode: number;

  constructor(
    message: string = 'Internal error',
    id?: JSONRPCErrorResponse['id'],
    code = -32603,
    statusCode = 500,
    data?: unknown,
  ) {
    this.statusCode = statusCode;
    this.id = id ?? randomUUID();
    this.error = {
      message,
      code,
      data,
    };
  }

  get JSON() {
    return {
      jsonrpc: this.jsonrpc,
      id: this.id,
      error: this.error,
    };
  }
}
