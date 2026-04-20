/** @type {import('lint-staged').Configuration} */
module.exports = {
  '*.{ts,tsx,js,jsx,cjs,mjs}': [
    'prettier --write',
    'eslint --fix --max-warnings=0',
  ],
  '*.{json,md,mdx,css,yml,yaml}': ['prettier --write'],
};
