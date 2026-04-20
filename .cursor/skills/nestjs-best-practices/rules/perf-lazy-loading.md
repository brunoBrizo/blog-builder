---
title: Use Lazy Loading for Large Modules
tags: performance, lazy-loading, modules
---

## Rule

Lazy-load only rare, heavy features after measuring startup or cold-start cost.
Do not hide core request-path modules behind lazy loading.

**Avoid**

```typescript
@Module({
  imports: [UsersModule, OrdersModule, ReportsModule, AdminModule],
})
export class AppModule {}
```

**Prefer**

```typescript
@Injectable()
export class ReportsFacade {
  private reportsModule?: ModuleRef;

  constructor(private readonly lazy: LazyModuleLoader) {}

  private async getReportsModule() {
    if (!this.reportsModule) {
      const { ReportsModule } = await import('./reports.module');
      this.reportsModule = await this.lazy.load(() => ReportsModule);
    }

    return this.reportsModule;
  }

  async generate(dto: GenerateReportDto) {
    const moduleRef = await this.getReportsModule();
    return moduleRef.get(ReportsService).generate(dto);
  }
}
```

- Use this for admin, reporting, export, or migration-only flows.
- Cache the loaded module reference if the feature can be called again.
- If the module is part of the hot path, load it normally.
