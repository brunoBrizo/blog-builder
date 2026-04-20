---
name: nestjs-best-practices
description: NestJS best practices for production backend work. Use when writing, reviewing, or refactoring NestJS modules, controllers, providers, DTOs, pipes, guards, interceptors, auth flows, testing, security, or performance-sensitive code.
license: MIT
metadata:
  author: Kadajett
  version: "1.1.0"
---

# NestJS Best Practices

Use this skill as a router for the rule library. Keep the default load small and
read only the rule files that match the task.

## Use It For

- New NestJS modules, controllers, providers, DTOs, pipes, guards, and interceptors
- NestJS architecture and dependency injection decisions
- Security, auth, validation, and error handling reviews
- Performance, testing, API design, and microservice patterns
- Refactors where Nest structure or framework usage is part of the problem

## Core Rules

- Prefer feature modules over technical-layer sprawl.
- Keep controllers thin and business logic in providers or use cases.
- Validate request shape at the boundary with DTOs and `ValidationPipe`; use route pipes for parsing and normalization.
- Use guards, interceptors, and filters deliberately for cross-cutting concerns.
- Measure before optimizing. Do not add caching or queueing by reflex.

## Rule Map

- `arch-*` architecture and module boundaries
- `di-*` dependency injection and provider design
- `error-*` exceptions and async failure handling
- `security-*` auth, guards, request validation, sanitization, rate limiting
- `perf-*` lifecycle hooks, caching, lazy loading, query performance
- `test-*` Nest testing utilities and external mocking
- `db-*` transactions, migrations, and N+1 avoidance
- `api-*` parsing and normalization pipes, DTO serialization, interceptors, versioning
- `micro-*` queues, health checks, and message patterns
- `devops-*` config, logging, and graceful shutdown

## Start Here

Read only the files you need:

- Architecture, module coupling, or persistence boundary issues:
  - `rules/arch-feature-modules.md`
  - `rules/arch-avoid-circular-deps.md`
  - `rules/arch-use-repository-pattern.md`
  - `rules/arch-single-responsibility.md`
- Nest injection or provider issues:
  - `rules/di-prefer-constructor-injection.md`
  - `rules/di-avoid-service-locator.md`
  - `rules/di-scope-awareness.md`
- Request validation and DTO boundaries:
  - `rules/security-validate-all-input.md`
  - `rules/api-use-dto-serialization.md`
- Parsing and normalization pipes:
  - `rules/api-use-pipes.md`
- Auth and authorization:
  - `rules/security-auth-jwt.md`
  - `rules/security-use-guards.md`
- Error handling:
  - `rules/error-use-exception-filters.md`
  - `rules/error-throw-http-exceptions.md`
- Performance:
  - `rules/perf-optimize-database.md`
  - `rules/perf-use-caching.md`
- Testing:
  - `rules/test-use-testing-module.md`
  - `rules/test-e2e-supertest.md`

## Working Style

- Do not read the whole rule library unless the task truly spans many areas.
- Load the relevant rule files, apply them, and stop.
- Prefer repo conventions when they do not conflict with the rule intent.
- If the issue is broader than Nest usage alone, pair this skill with a higher-level
  architecture or validation skill.

## Output Expectations

- When reviewing or auditing, report:
  - issue
  - why it matters in NestJS
  - affected rule file or rule family
  - recommended fix
  - severity or shipping risk
