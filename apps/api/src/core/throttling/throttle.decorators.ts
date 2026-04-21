import { Throttle } from '@nestjs/throttler';

import { parseEnv, type Env } from '../config/env.schema';

let cachedEnv: Env | null = null;

function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = parseEnv(process.env);
  }
  return cachedEnv;
}

/** Tighter limit for mutating public endpoints (`THROTTLE_PUBLIC_WRITE_*`). */
export function ThrottlePublicWrite(): ReturnType<typeof Throttle> {
  const e = getEnv();
  return Throttle({
    default: {
      limit: e.THROTTLE_PUBLIC_WRITE_LIMIT,
      ttl: e.THROTTLE_PUBLIC_WRITE_TTL_MS,
    },
  });
}

/** Admin-style routes (`THROTTLE_ADMIN_*`). */
export function ThrottleAdmin(): ReturnType<typeof Throttle> {
  const e = getEnv();
  return Throttle({
    default: {
      limit: e.THROTTLE_ADMIN_LIMIT,
      ttl: e.THROTTLE_ADMIN_TTL_MS,
    },
  });
}

/** Integration-test helper: low limit for 429 assertions. */
export function ThrottleTestTight(): ReturnType<typeof Throttle> {
  return Throttle({
    default: { limit: 2, ttl: 10_000 },
  });
}
