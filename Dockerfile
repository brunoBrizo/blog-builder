# Multi-stage image for apps/api (Nest + webpack bundle).
# Build: docker build -t blog-builder-api .
# Run:  docker run -e DATABASE_URL=... -e PORT=3001 -p 3001:3001 blog-builder-api

FROM node:24-bookworm-slim AS build
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./
COPY apps ./apps
COPY libs ./libs
COPY drizzle.config.ts ./

RUN pnpm install --frozen-lockfile
RUN pnpm exec nx run api:build:production

FROM node:24-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN groupadd -r nest --gid=1001 && useradd -r -g nest --uid=1001 nest

COPY --from=build /app/dist/apps/api ./dist/apps/api
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/libs/db ./libs/db
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/tsconfig.base.json ./tsconfig.base.json

RUN npm install -g tsx@4.21.0

USER nest

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3001)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/apps/api/main.js"]
