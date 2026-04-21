import { RevalidatePathSchema } from '@blog-builder/shared-types';
import { createZodDto } from 'nestjs-zod';

export class RevalidatePathDto extends createZodDto(RevalidatePathSchema) {}
