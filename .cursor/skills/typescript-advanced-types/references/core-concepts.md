# Core Concepts

Use this file when you need the right tool, not a type-system tour.

## Generics

Use generics when the shape stays the same but the member types vary.

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

Keep generic parameters minimal. If one type parameter can be inferred from
another, remove it.

## Conditional Types

Use conditional types when output shape depends on input shape.

```typescript
type ApiResult<T> = T extends Error
  ? { ok: false; error: T }
  : { ok: true; value: T };
```

Use `infer` when extracting nested pieces:

```typescript
type AwaitedValue<T> = T extends Promise<infer U> ? U : T;
```

Watch for unintended distributive behavior on unions. Wrap with tuples when you
want to disable it:

```typescript
type NonDistributed<T> = [T] extends [string] ? true : false;
```

## Mapped Types

Use mapped types to transform existing object types rather than rewriting them.

```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
```

Use key remapping when the public API shape changes:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

## Template Literal Types

Use template literal types when string APIs follow a stable pattern.

```typescript
type EventName = "created" | "updated";
type EventTopic = `user.${EventName}`;
```

Good fit:
- event names
- route keys
- config paths
- generated method names

Bad fit:
- open-ended freeform strings
- user input that is really a runtime concern

## Built-in Utility Types

Prefer built-ins before custom helpers:

- `Partial<T>`
- `Required<T>`
- `Readonly<T>`
- `Pick<T, K>`
- `Omit<T, K>`
- `Record<K, V>`
- `Exclude<T, U>`
- `Extract<T, U>`
- `NonNullable<T>`
- `Parameters<T>`
- `ReturnType<T>`

If a built-in expresses the intent, use it directly.

## Selection Guide

- Need reuse with varying types: generics
- Need branching by type relationship: conditional types
- Need property transformation: mapped types
- Need patterned string unions: template literal types
- Need extraction from existing callable or promise types: `infer`
