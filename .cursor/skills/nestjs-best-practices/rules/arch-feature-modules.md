---
title: Organize by Feature Modules
tags: architecture, modules
---

Group controllers, services, DTOs, and data access by feature. Do not organize a Nest app by technical layer.

Incorrect:

```text
src/
  controllers/
  services/
  entities/
```

Correct:

```text
src/
  users/
    dto/
    users.controller.ts
    users.service.ts
    users.module.ts
  orders/
    dto/
    orders.controller.ts
    orders.service.ts
    orders.module.ts
```

Repo note: in Nx, feature modules usually map cleanly to feature libs.
