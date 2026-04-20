---
title: Use SWR for Automatic Deduplication
tags: client, swr, deduplication, data-fetching
---

Prefer SWR when multiple client components can request the same resource.

Bad:
```tsx
function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

Good:
```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

Note: use SWR's immutable or mutation helpers when the cache should never revalidate automatically or when writes need a dedicated mutation flow.
