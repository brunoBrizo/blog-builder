/**
 * Inject inline citation links into article HTML.
 * Matches `[N]` patterns and wraps them in anchor tags pointing to #cite-N.
 */
export function injectCitationLinks(
  html: string,
  citationCount: number,
): string {
  return html.replace(/\[\s*(\d+)\s*\]/g, (match, num) => {
    const n = parseInt(num, 10);
    if (n >= 1 && n <= citationCount) {
      return `<a href="#cite-${n}" class="text-indigo-600 hover:underline">${match}</a>`;
    }
    return match;
  });
}
