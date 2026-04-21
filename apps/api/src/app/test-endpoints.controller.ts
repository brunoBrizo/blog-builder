import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UseCronAuth } from '../core/auth/auth.decorators';
import { ThrottleTestTight } from '../core/throttling/throttle.decorators';
import { TestEndpointsGuard } from './test-endpoints.guard';
import { NewsletterSubscribeDto } from './dto/newsletter-subscribe.dto';

@Controller('test')
@UseGuards(TestEndpointsGuard)
export class TestEndpointsController {
  @Get('cron')
  @UseCronAuth()
  cronOk(): { ok: boolean } {
    return { ok: true };
  }

  @Post('rate-limit')
  @ThrottleTestTight()
  rateLimitProbe(): { ok: boolean } {
    return { ok: true };
  }

  @Post('validate-newsletter')
  validateNewsletter(@Body() body: NewsletterSubscribeDto): { ok: boolean } {
    void body;
    return { ok: true };
  }
}
