import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';

import { ArticlesService } from './articles.service';

const LocaleSchema = z.enum(['en', 'pt-BR', 'es']);
const CursorSchema = z.object({
  publishedAt: z.coerce.date(),
  id: z.string().uuid(),
});

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get(':locale/:slug')
  @Header('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  async findOne(@Param('locale') locale: string, @Param('slug') slug: string) {
    const parsedLocale = LocaleSchema.safeParse(locale);
    if (!parsedLocale.success) {
      throw new NotFoundException('Invalid locale');
    }

    try {
      return await this.articlesService.findPublishedBySlug(
        parsedLocale.data,
        slug,
      );
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new NotFoundException('Article not found');
    }
  }

  @Get()
  @Header('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  async findMany(
    @Query('locale') locale: string,
    @Query('limit') limitRaw?: string,
    @Query('cursor') cursorRaw?: string,
  ) {
    const parsedLocale = LocaleSchema.safeParse(locale);
    if (!parsedLocale.success) {
      throw new NotFoundException('Invalid locale');
    }

    const limit = Math.min(Math.max(Number(limitRaw ?? '20'), 1), 100);

    let cursor: { publishedAt: Date; id: string } | undefined;
    if (cursorRaw) {
      try {
        const parsed = CursorSchema.safeParse(JSON.parse(cursorRaw));
        if (parsed.success) {
          cursor = parsed.data;
        }
      } catch {
        // ignore invalid cursor
      }
    }

    return this.articlesService.listPublishedSummaries(
      parsedLocale.data,
      limit,
      cursor,
    );
  }
}
