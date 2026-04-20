---
title: Use Compound Components
tags: composition, compound-components, architecture
---

Break complex UI into compound components backed by shared context instead of configuring one large component with props.

Bad:

```tsx
function Composer({ showFormatting, showEmojis, onSubmit }: Props) {
  return (
    <form>
      <Header />
      <Input />
      <Footer>
        {showFormatting && <Formatting />}
        {showEmojis && <Emojis />}
        <SubmitButton onPress={onSubmit} />
      </Footer>
    </form>
  )
}
```

Good:

```tsx
import { createContext, useContext } from 'react'

const ComposerContext = createContext<ComposerContextValue | null>(null)

function ComposerProvider({ children, state, actions, meta }: ProviderProps) {
  return (
    <ComposerContext.Provider value={{ state, actions, meta }}>
      {children}
    </ComposerContext.Provider>
  )
}

function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerInput() {
  const {
    state,
    actions: { update },
  } = useContext(ComposerContext)!
  return (
    <TextInput value={state.input} onChangeText={(text) => update((s) => ({ ...s, input: text }))} />
  )
}

function ComposerSubmit() {
  const {
    actions: { submit },
  } = useContext(ComposerContext)!
  return <Button onPress={submit}>Send</Button>
}

const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Input: ComposerInput,
  Submit: ComposerSubmit,
  Footer: ComposerFooter,
  Formatting: ComposerFormatting,
}

function Example() {
  return (
    <Composer.Provider state={state} actions={actions} meta={meta}>
      <Composer.Frame>
        <Composer.Input />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Submit />
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Provider>
  )
}
```

Note: use compound components when consumers need to decide structure, not just toggle options.
