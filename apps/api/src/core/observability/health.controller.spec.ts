import { DRIZZLE } from '@blog-builder/db';
import { Test } from '@nestjs/testing';

import { AppConfigService } from '../config/app-config.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('health returns ok', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DRIZZLE,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AppConfigService,
          useValue: {
            gitSha: 'abc',
            releaseTag: 'v1',
            builtAt: '2026-01-01',
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(HealthController);
    expect(controller.health().status).toBe('ok');
  });
});
