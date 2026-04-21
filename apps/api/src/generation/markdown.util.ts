import { marked } from 'marked';

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export function wordCountFromMarkdown(markdown: string): number {
  const trimmed = markdown.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

export function readingMinutesFromWordCount(words: number): number {
  return Math.max(1, Math.ceil(words / 200));
}
