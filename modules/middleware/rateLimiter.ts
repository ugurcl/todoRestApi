import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";


const redisClient = createClient({
  socket: {
    host: "127.0.0.1", 
    port: 6379,
  },
});

redisClient.connect().catch(console.error);

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests! Please try again in 15 minutes.",
  },
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});