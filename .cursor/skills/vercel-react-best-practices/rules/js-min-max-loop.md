---
title: Use Loop for Min/Max Instead of Sort
tags: javascript, arrays, performance, sorting, algorithms
---

Do not sort an entire array when you only need the smallest or largest item.

Bad:
```ts
function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

Good:
```ts
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null

  let latest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }

  return latest
}
```

Note: `Math.min(...numbers)` and `Math.max(...numbers)` are fine for small primitive arrays, but a loop is the safer general rule.
