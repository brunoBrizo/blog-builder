---
title: Create Explicit Component Variants
tags: composition, variants, architecture
---

When a component has meaningfully different modes, create named variants instead of one component with flags.

Bad:

```tsx
<Composer
  isThread
  channelId='abc'
  showAttachments
/>
```

Good:

```tsx
<ThreadComposer channelId="abc" />
<EditMessageComposer messageId="xyz" />
<ForwardMessageComposer messageId="123" />
```

Note: each variant should make its provider, structure, and actions obvious at the call site.
