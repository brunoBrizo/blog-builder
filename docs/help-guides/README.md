# Help guides

Short, task-focused docs for local setup, configuration, and testing. Deeper reference lives under [`docs/`](../) (e.g. [Supabase setup](../supabase-setup.md), [Inngest pipeline](../inngest-article-pipeline.md)).

| Guide                                                                       | Purpose                                                                           |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Local first run](local-first-run.md)                                       | Install → env → database → run API + web → sanity checks.                         |
| [Environment variables](environment-variables.md)                           | What each layer needs, required vs optional, production-only rules.               |
| [Database workflows](database-workflows.md)                                 | Migrate, seed, studio, reset; pooled vs direct URL.                               |
| [Article generation — manual testing](article-generation-manual-testing.md) | Trigger the pipeline with `curl`, headers, and optional Inngest dev UI.           |
| [Inngest setup and testing](inngest-setup-and-testing.md)                   | Dev server, sync URL, Cloud vs local.                                             |
| [E2E (Playwright)](e2e-playwright.md)                                       | `nx e2e web-e2e`, `webServer`, `BASE_URL`, API/data for real pages.               |
| [Cost and safety knobs](cost-and-safety-knobs.md)                           | Kill switch, token budget, daily USD ceiling, Perplexity timeouts/pricing inputs. |

For stack and repo layout, see the root [README](../../README.md) and [tech stack](../tech-stack.md).
