import { createHash, timingSafeEqual } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import ipaddr from 'ipaddr.js';

import { AppConfigService } from '../config/app-config.service';

const CRON_HEADER = 'x-cron-secret';
const REVALIDATE_HEADER = 'x-revalidate-secret';

function timingSafeCompare(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a, 'utf8').digest();
  const hb = createHash('sha256').update(b, 'utf8').digest();
  return timingSafeEqual(ha, hb);
}

@Injectable()
export class SharedSecretService {
  constructor(private readonly config: AppConfigService) {}

  getClientIp(req: Request): string | undefined {
    if (this.config.trustProxy) {
      const fly = req.headers['fly-client-ip'];
      if (typeof fly === 'string' && fly.length > 0) {
        return fly.trim();
      }
      const xff = req.headers['x-forwarded-for'];
      if (typeof xff === 'string') {
        return xff.split(',')[0]?.trim();
      }
    }
    return req.ip ?? req.socket.remoteAddress;
  }

  parseAllowlist(): string[] {
    const raw = this.config.cronIpAllowlistRaw;
    if (!raw.trim()) return [];
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  private ipAllowed(clientIp: string | undefined): boolean {
    const cidrs = this.parseAllowlist();
    if (cidrs.length === 0) return true;
    if (!clientIp) return false;
    let parsed: ipaddr.IPv4 | ipaddr.IPv6;
    try {
      parsed = ipaddr.parse(clientIp);
    } catch {
      return false;
    }
    for (const c of cidrs) {
      try {
        const range = ipaddr.parseCIDR(c);
        if (parsed.match(range[0], range[1])) {
          return true;
        }
      } catch {
        continue;
      }
    }
    return false;
  }

  /** Validates cron shared secret + optional IP allowlist. */
  validateCron(req: Request): boolean {
    const header = req.headers[CRON_HEADER];
    const secret = typeof header === 'string' ? header : '';
    if (!timingSafeCompare(secret, this.config.cronSharedSecret)) {
      return false;
    }
    return this.ipAllowed(this.getClientIp(req));
  }

  /**
   * Validates revalidate shared secret (no IP allowlist).
   */
  validateRevalidate(req: Request): boolean {
    const header = req.headers[REVALIDATE_HEADER];
    const secret = typeof header === 'string' ? header : '';
    return timingSafeCompare(secret, this.config.revalidateSharedSecret);
  }
}
