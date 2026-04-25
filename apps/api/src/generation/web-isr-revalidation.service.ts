import { Injectable, Logger } from '@nestjs/common';

import { AppConfigService } from '../core/config/app-config.service';
import { GenerationRepository } from './generation.repository';

@Injectable()
export class WebIsrRevalidationService {
  private readonly logger = new Logger(WebIsrRevalidationService.name);

  constructor(
    private readonly cfg: AppConfigService,
    private readonly repo: GenerationRepository,
  ) {}

  /**
   * Calls apps/web POST /api/revalidate for blog paths after publish.
   */
  async revalidateAfterPublish(articleId: string): Promise<void> {
    const origin = this.cfg.webPublicOrigin.trim().replace(/\/$/, '');
    if (origin.length === 0) {
      if (this.cfg.nodeEnv === 'production') {
        throw new Error('WEB_PUBLIC_ORIGIN is required for ISR revalidation');
      }
      this.logger.warn(
        'Skipping ISR revalidation: WEB_PUBLIC_ORIGIN is not set',
      );
      return;
    }

    const rows = await this.repo.listTranslationSlugsForArticle(articleId);
    const paths = new Set<string>();
    for (const loc of ['en', 'pt-BR', 'es'] as const) {
      paths.add(`/${loc}`);
      paths.add(`/${loc}/blog`);
      paths.add(`/${loc}/articles`);
    }
    for (const r of rows) {
      paths.add(`/${r.locale}/blog/${r.slug}`);
    }
    paths.add('/sitemap.xml');

    const res = await fetch(`${origin}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': this.cfg.revalidateSharedSecret,
      },
      body: JSON.stringify({ paths: [...paths] }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `ISR revalidate failed HTTP ${res.status}: ${text.slice(0, 400)}`,
      );
    }
  }
}
