import type { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function createRateLimiter(windowMs: number = 60 * 1000, maxRequests: number = 10) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = rateLimitStore[ip];

    if (!record || now > record.resetTime) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        error: 'Has enviado demasiadas solicitudes en poco tiempo. Por favor espera un momento e inténtalo de nuevo.'
      });
      return;
    }

    record.count++;
    next();
  };
}
