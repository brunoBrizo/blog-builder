/** Minimal stub: `marked` ships ESM-only; Jest uses this in unit/integration tests. */
export const marked = {
  parse: (markdown: string): string =>
    `<p>${markdown.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`,
};
