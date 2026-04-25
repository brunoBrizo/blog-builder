/**
 * Extract H2 headings with `id` attributes from article HTML for the TOC.
 */
export function extractTocFromHtml(
  html: string,
): { id: string; title: string }[] {
  const matches = [...html.matchAll(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi)];
  const results: { id: string; title: string }[] = [];
  for (const [, id, rawTitle] of matches) {
    if (id) {
      results.push({
        id,
        title: rawTitle?.replace(/<[^>]*>/g, '') ?? '',
      });
    }
  }
  return results;
}
