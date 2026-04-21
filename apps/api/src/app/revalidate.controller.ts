import { Body, Controller, Post } from '@nestjs/common';

import { UseRevalidateAuth } from '../core/auth/auth.decorators';
import { ThrottleAdmin } from '../core/throttling/throttle.decorators';
import { RevalidatePathDto } from './dto/revalidate-path.dto';

@Controller('revalidate')
@UseRevalidateAuth()
export class RevalidateController {
  @Post()
  @ThrottleAdmin()
  trigger(@Body() body: RevalidatePathDto): { ok: boolean; path: string } {
    return { ok: true, path: body.path };
  }
}
