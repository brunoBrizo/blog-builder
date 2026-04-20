---
title: Define Generic Context Interfaces for Dependency Injection
tags: composition, context, state, typescript, dependency-injection
---

Define a stable context contract like `state`, `actions`, and `meta`. Make the UI consume that contract instead of one concrete hook or store.

Bad:

```tsx
function ComposerInput() {
  const { input, setInput } = useChannelComposerState()
  return <TextInput value={input} onChangeText={setInput} />
}
```

Good:

```tsx
interface ComposerState {
  input: string
  attachments: Attachment[]
  isSubmitting: boolean
}

interface ComposerContextValue {
  state: ComposerState
  actions: { update: (updater: (state: ComposerState) => ComposerState) => void; submit: () => void }
  meta: { inputRef: React.RefObject<TextInput> }
}

const ComposerContext = createContext<ComposerContextValue | null>(null)

function useComposer() {
  return useContext(ComposerContext)!
}

function ComposerInput() {
  const { state, actions, meta } = useComposer()
  return (
    <TextInput
      ref={meta.inputRef}
      value={state.input}
      onChangeText={(text) => actions.update((s) => ({ ...s, input: text }))}
    />
  )
}
```

Note: different providers can implement the same contract with `useState`, Zustand, or synced server state while the composed UI stays unchanged.
