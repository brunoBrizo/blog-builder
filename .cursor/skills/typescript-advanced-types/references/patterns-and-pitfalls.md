# Patterns And Pitfalls

Use this file when the problem is real, reusable, and hard to model safely with
basic TypeScript.

## Useful Patterns

### Key Filtering

```typescript
type PickByValue<T, TValue> = {
  [K in keyof T as T[K] extends TValue ? K : never]: T[K];
};
```

Use this when you need to derive a view of an existing type from value kinds.

### Tagged Unions

```typescript
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

Prefer discriminated unions over boolean flags that can drift into invalid
combinations.

### Builder State Tracking

```typescript
type ConfigBuilder<T extends { host?: string; port?: number }> = {
  setHost(host: string): ConfigBuilder<T & { host: string }>;
  setPort(port: number): ConfigBuilder<T & { port: number }>;
  build(): T extends { host: string; port: number }
    ? { host: string; port: number }
    : never;
};
```

Use this only when compile-time guarantees materially improve the API.

## Testing Types

Keep type utilities testable. Use lightweight compile-time assertions:

```typescript
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type _result = Expect<Equal<NonNullable<string | null>, string>>;
```

If a helper is important enough to keep, it is important enough to test.

## Common Failure Modes

### Over-abstracted helpers

If a helper needs a paragraph to explain, split it or replace it with explicit
types.

### `any` leakage

One `any` inside a utility can silently defeat the whole type contract.

### Runtime/type mismatch

Do not encode guarantees in types that runtime code does not actually enforce.

### Recursive type blowups

Deep recursive types can make the compiler slow or produce unreadable errors.
Use bounded depth or simplify.

## Performance And Readability

- Favor shallow helpers over giant meta-types.
- Reuse named helper types instead of nesting everything inline.
- Optimize for error clarity, not just expressiveness.
- If compile times or IDE responsiveness suffer, simplify the type model.

## Review Questions

- Does this type prevent a real bug?
- Is there a simpler equivalent with built-ins?
- Will another engineer understand it quickly?
- Does runtime behavior actually honor the claimed invariant?
