---
title: Avoid Boolean Prop Proliferation
tags: composition, props, architecture
---

Do not use boolean props to switch major layouts or actions. Create explicit variants instead.

Bad:

```tsx
function Composer({
  isThread,
  channelId,
  isEditing,
}: Props) {
  return (
    <form>
      <Header />
      <Input />
      {isThread ? (
        <AlsoSendToChannelField id={channelId} />
      ) : null}
      {isEditing ? <EditActions /> : <DefaultActions />}
      <Footer />
    </form>
  )
}
```

Good:

```tsx
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
```

Note: share internals like `Composer.Input` or `Composer.Footer`, but let each variant own its structure.
