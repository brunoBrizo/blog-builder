import { Test } from '@nestjs/testing';
import type { Request } from 'express';

import { AppConfigService } from '../config/app-config.service';
import { SharedSecretService } from './shared-secret.service';

function req(partial: Partial<Request> & Record<string, unknown>): Request {
  return partial as Request;
}

describe('SharedSecretService', () => {
  const cronSecret = 'cron-shared-secret-test';
  const revalidateSecret = 'revalidate-shared-secret-test';

  async function setup(overrides: Partial<AppConfigService> = {}) {
    const mockCfg: Pick<
      AppConfigService,
      | 'cronSharedSecret'
      | 'revalidateSharedSecret'
      | 'trustProxy'
      | 'cronIpAllowlistRaw'
    > = {
      cronSharedSecret: cronSecret,
      revalidateSharedSecret: revalidateSecret,
      trustProxy: false,
      cronIpAllowlistRaw: '',
      ...overrides,
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SharedSecretService,
        { provide: AppConfigService, useValue: mockCfg },
      ],
    }).compile();

    return moduleRef.get(SharedSecretService);
  }

  describe('validateCron', () => {
    it('returns false when header secret is wrong', async () => {
      const svc = await setup();
      const ok = svc.validateCron(
        req({
          headers: { 'x-cron-secret': 'wrong' },
          ip: '127.0.0.1',
          socket: { remoteAddress: '127.0.0.1' },
        }),
      );
      expect(ok).toBe(false);
    });

    it('returns true when secret matches and allowlist is empty', async () => {
      const svc = await setup();
      const ok = svc.validateCron(
        req({
          headers: { 'x-cron-secret': cronSecret },
          ip: '192.0.2.10',
          socket: { remoteAddress: '192.0.2.10' },
        }),
      );
      expect(ok).toBe(true);
    });

    it('returns false when IP not in allowlist', async () => {
      const svc = await setup({
        cronIpAllowlistRaw: '192.0.2.0/24',
      });
      const ok = svc.validateCron(
        req({
          headers: { 'x-cron-secret': cronSecret },
          ip: '198.51.100.1',
          socket: { remoteAddress: '198.51.100.1' },
        }),
      );
      expect(ok).toBe(false);
    });

    it('returns true when IP matches CIDR in allowlist', async () => {
      const svc = await setup({
        cronIpAllowlistRaw: '192.0.2.0/24, 10.0.0.0/8',
      });
      const ok = svc.validateCron(
        req({
          headers: { 'x-cron-secret': cronSecret },
          ip: '192.0.2.50',
          socket: { remoteAddress: '192.0.2.50' },
        }),
      );
      expect(ok).toBe(true);
    });

    it('returns false when client IP is missing and allowlist is set', async () => {
      const svc = await setup({
        cronIpAllowlistRaw: '127.0.0.1/32',
      });
      const ok = svc.validateCron(
        req({
          headers: { 'x-cron-secret': cronSecret },
          ip: undefined,
          socket: { remoteAddress: undefined },
        }),
      );
      expect(ok).toBe(false);
    });
  });

  describe('getClientIp', () => {
    it('uses Fly-Client-IP when trustProxy is true', async () => {
      const svc = await setup({ trustProxy: true });
      const ip = svc.getClientIp(
        req({
          headers: {
            'fly-client-ip': '  203.0.113.5  ',
            'x-forwarded-for': '198.51.100.1',
          },
          ip: '127.0.0.1',
        }),
      );
      expect(ip).toBe('203.0.113.5');
    });

    it('uses first X-Forwarded-For when trustProxy and no Fly header', async () => {
      const svc = await setup({ trustProxy: true });
      const ip = svc.getClientIp(
        req({
          headers: { 'x-forwarded-for': '198.51.100.2, 10.0.0.1' },
          ip: '127.0.0.1',
        }),
      );
      expect(ip).toBe('198.51.100.2');
    });

    it('uses req.ip when trustProxy is false', async () => {
      const svc = await setup({ trustProxy: false });
      const ip = svc.getClientIp(
        req({
          headers: { 'fly-client-ip': '203.0.113.1' },
          ip: '10.0.0.5',
          socket: {},
        }),
      );
      expect(ip).toBe('10.0.0.5');
    });
  });

  describe('validateRevalidate', () => {
    it('returns false for wrong secret', async () => {
      const svc = await setup();
      expect(
        svc.validateRevalidate(
          req({ headers: { 'x-revalidate-secret': 'nope' } }),
        ),
      ).toBe(false);
    });

    it('returns true for correct secret', async () => {
      const svc = await setup();
      expect(
        svc.validateRevalidate(
          req({ headers: { 'x-revalidate-secret': revalidateSecret } }),
        ),
      ).toBe(true);
    });
  });

  describe('parseAllowlist', () => {
    it('splits and trims comma-separated CIDRs', async () => {
      const svc = await setup({
        cronIpAllowlistRaw: ' 192.0.2.0/24 , 10.0.0.1/32 ',
      });
      expect(svc.parseAllowlist()).toEqual(['192.0.2.0/24', '10.0.0.1/32']);
    });
  });
});
