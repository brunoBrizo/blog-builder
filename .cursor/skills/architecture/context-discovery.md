# Context Discovery

> Before suggesting any architecture, gather context.

## Ask First

1. **Scale**
   - How many users? (10, 1K, 100K, 1M+)
   - Data volume? (MB, GB, TB)
   - Transaction rate? (per second/minute)
2. **Team**
   - Solo developer or team?
   - Team size and expertise?
   - Distributed or co-located?
3. **Timeline**
   - MVP/Prototype or long-term product?
   - Time to market pressure?
4. **Domain**
   - CRUD-heavy or business logic complex?
   - Real-time requirements?
   - Compliance/regulations?
5. **Constraints**
   - Budget limitations?
   - Legacy systems to integrate?
   - Technology stack preferences?

## Project Shape

- **MVP**: low scale, small team, speed matters most, architecture should stay simple
- **SaaS**: moderate scale, multi-domain product, modular boundaries matter
- **Enterprise**: high scale, larger teams, distribution and operational concerns matter more
