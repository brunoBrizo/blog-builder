---
title: Strategic Suspense Boundaries
tags: async, suspense, streaming, layout-shift
---

Put `Suspense` around the subtree that waits on data instead of blocking the whole page on one `await`.

Bad:
```tsx
async function Page() {
  const data = await fetchData()

  return (
    <div>
      <Sidebar />
      <Header />
      <DataDisplay data={data} />
      <Footer />
    </div>
  )
}
```

Good:
```tsx
function Page() {
  return (
    <div>
      <Sidebar />
      <Header />
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <Footer />
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData()
  return <div>{data.content}</div>
}
```

Note: this works best when the page shell can render before the data-heavy subtree finishes.
