---
title: Avoid `forwardRef` on React 19+
tags: react19, refs
---

On React 19+, pass `ref` as a normal prop instead of wrapping components in `forwardRef`.

Bad:

```tsx
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />
})
```

Good:

```tsx
function ComposerInput({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />
}
```

Note: do not backport this guidance into React 18 codebases.
