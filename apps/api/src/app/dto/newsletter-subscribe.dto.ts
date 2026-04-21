import { NewsletterSubscribeInputSchema } from '@blog-builder/shared-types';
import { createZodDto } from 'nestjs-zod';

export class NewsletterSubscribeDto extends createZodDto(
  NewsletterSubscribeInputSchema,
) {}
