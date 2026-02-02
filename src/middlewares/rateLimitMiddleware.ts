import rateLimit from 'express-rate-limit';
import config from '../config/config';

export const createRateLimiter = (route: string) => {
  const routeConfig = config.rateLimitSettings[route];
  if (!routeConfig) return null; // pas de limite si pas configuré

  return rateLimit({
    windowMs: (routeConfig.windowMs || 60) * 1000, // convert seconds → ms
    max: routeConfig.max || 10,
    message: 'Trop de requêtes, réessayez plus tard.',
    standardHeaders: true,
    legacyHeaders: false
  });
};
