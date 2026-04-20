---
title: Use Message Queues for Background Jobs
tags: microservices, queues, bullmq
---

## Rule

Put slow, retryable, or non-user-critical work on a queue. Keep the request path
short and let workers handle retries.

**Avoid**

```typescript
@Post('reports')
async generate(@Body() dto: GenerateReportDto) {
  return this.reportsService.generate(dto);
}
```

**Prefer**

```typescript
@Controller('reports')
export class ReportsController {
  constructor(@InjectQueue('reports') private readonly reportsQueue: Queue) {}

  @Post()
  async create(@Body() dto: GenerateReportDto) {
    const job = await this.reportsQueue.add('generate', dto, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1_000 },
    });
    return { jobId: job.id };
  }
}

@Processor('reports')
export class ReportsProcessor {
  @Process('generate')
  async handle(job: Job<GenerateReportDto>) {
    return this.reportsService.generate(job.data);
  }
}
```

- Queue email, exports, webhooks, imports, and similar work.
- Make handlers idempotent. Retries are normal.
- Put queue connection settings in `ConfigModule`, not inline literals.
