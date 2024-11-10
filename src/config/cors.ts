import { cors } from 'hono/cors';
import env from '~/config/env.js';

export const corsConfig = cors({ origin: env.CORS_ORIGIN });
