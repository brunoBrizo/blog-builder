---
title: Use Caching Strategically
tags: performance, caching, cache
---

## Rule

Cache expensive, read-heavy data with a clear TTL and invalidation path. Do not
cache by reflex.

**Avoid**

```typescript
return this.productsService.getPopular();
// expensive query on every request
```

**Prefer**

```typescript
const POPULAR_KEY = 'products:popular:v1';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly productsRepo: ProductsRepository,
  ) {}

  async getPopular() {
    const cached = await this.cache.get<ProductSummary[]>(POPULAR_KEY);
    if (cached) return cached;

    const value = await this.productsRepo.findPopular({ take: 20 });
    await this.cache.set(POPULAR_KEY, value, 60_000);
    return value;
  }

  async updateProduct(id: string, input: UpdateProductDto) {
    const product = await this.productsRepo.update(id, input);
    await this.cache.del(POPULAR_KEY);
    await this.cache.del(`product:${id}:v1`);
    return product;
  }
}
```

- Cache stable, expensive reads first.
- Keep TTL and invalidation near the owning read/write path.
- Prefer shared cache backends when multiple app instances must agree on keys.
- Be careful caching auth, permissions, and other fast-moving state.
