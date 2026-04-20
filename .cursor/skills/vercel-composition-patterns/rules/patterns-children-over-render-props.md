---
title: Prefer Composing Children Over Render Props
tags: composition, children, render-props
---

Use `children` for structural composition. Prefer render props only when the parent must pass data into the rendered child.

Bad:

```tsx
function Composer({
  renderHeader,
  renderFooter,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
    </form>
  )
}
```

Good:

```tsx
function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className='flex'>{children}</footer>
}

return (
  <Composer.Frame>
    <CustomHeader />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Emojis />
      <SubmitButton />
    </Composer.Footer>
  </Composer.Frame>
)
```

Note: keep render props for data-driven rendering like `renderItem`, not for page structure.
