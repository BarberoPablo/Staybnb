
# Airbnb Migration Guide — Old Prisma → New apiClient + Zod

## Project Overview

Next.js Airbnb clone migrating from **in-project Prisma server actions** to an **external NestJS backend** accessed via `apiClient` (openapi-fetch) + Zod validation.

---

## Architecture

### Old Pattern (Prisma Direct)
```
Page/Component
  └─► server/endpoints/*.ts  (functions with "use server")
        └─► prisma (direct DB queries)
        └─► supabase (auth)
        └─► lib/parsers/*.ts  (snake_case → camelCase)
        └─► lib/types/*.ts    (Old DB-shape types — DO NOT USE)
```

### New Pattern (apiClient + Zod)
```
Page/Component
  └─► server/endpoints/*.ts  (thin wrapper, delegates to .http)
        └─► domain/*.http.ts  ("use server", calls apiClient, parses with Zod)
              └─► apiClient (openapi-fetch, typed via src/types/api.ts)
              └─► domain/*.schema.ts (Zod schemas + inferred types)
```

---

## Directory Layout

```
src/
├── types/api.ts                    ← Auto-generated OpenAPI types (from Swagger)
├── lib/
│   ├── api/
│   │   ├── client.ts               ← apiClient (openapi-fetch instance)
│   │   ├── server/
│   │   │   ├── endpoints/          ← Server actions (consumed by pages)
│   │   │   │   ├── amenities.ts
│   │   │   │   ├── cities.ts
│   │   │   │   ├── favorites.ts
│   │   │   │   ├── listings.ts
│   │   │   │   ├── profile.ts
│   │   │   │   ├── reservations.ts
│   │   │   │   └── host/
│   │   │   │       ├── daft-listings.ts
│   │   │   │       └── listings.ts
│   │   │   ├── errors.ts           ← AuthError, NotFoundError, ReservationError
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── amenities/              ← Fully migrated example
│   │   ├── cities/                 ← Partially migrated
│   │   ├── favorites/              ← Fully migrated
│   │   ├── listings/               ← Partially migrated
│   │   ├── profile/                ← Partially migrated
│   │   ├── reservations/           ← Partially migrated
│   │   ├── host/draftListings/     ← Fully migrated
│   │   ├── host/listings/          ← Fully migrated
│   │   └── shared/listing/
│   │       └── listing.fragments.schema.ts  ← Shared Zod fragments
│   ├── parsers/                    ← OLD bridge (DB→new types) — DO NOT USE for new migrations
│   ├── types/                      ← OLD DB types — DO NOT USE for new migrations
│   │   ├── listing.ts              ← snake_case (ListingDB, ReviewDB, ScoreDB, etc.)
│   │   ├── profile.ts              ← snake_case (ProfileDB, CreateProfileDB)
│   │   ├── favorites.ts            ← snake_case (FavoriteDB)
│   │   ├── reservation.ts          ← snake_case (ReservationDB)
│   │   └── cities.ts
│   └── schemas/                    ← Form Zod schemas (not API)
└── database.types.ts               ← OLD Supabase types — DO NOT USE
```

---

## File-by-File Pattern (New)

### 1. `*.schema.ts` — Zod validation + type exports
```typescript
import { components } from "@/types/api";
import { z } from "zod";

// Export OpenAPI type for use in http layer
export type MyType = components["schemas"]["SomeDto"];

// Zod schema validates runtime data
export const MySchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... camelCase fields
});

// Inferred types from Zod
export type MyInferredType = z.infer<typeof MySchema>;
```

### 2. `*.http.ts` — API client calls
```typescript
"use server";

import { cookies } from "next/headers";
import { apiClient } from "../client";
import { MySchema, MyType } from "./my.schema";

export async function fetchMyData(): Promise<MyType[]> {
  const cookieStore = await cookies();  // only if auth required

  const { data, error } = await apiClient.GET("/my-route", {
    headers: { Cookie: cookieStore.toString() },  // only if auth required
  });

  if (error) throw new Error("Failed to fetch my data");

  return MySchema.parse(data);
}
```

### 3. `server/endpoints/*.ts` — Thin wrapper
```typescript
"use server";

import { fetchMyData } from "../../domain/my.http";

export async function getMyData() {
  return fetchMyData();
}
```

---

## Migration Step-by-Step

### Step 1: Check if a backend endpoint exists
Look in `src/types/api.ts` under the `paths` interface. Search for a matching route path.

### Step 2: If no endpoint exists
Analyze the old function and provide backend specification:
- Route, method, auth requirements
- Service logic (business rules, not just CRUD)
- Response DTO shape (camelCase)
- Any special transformations (e.g., effective status computation)

### Step 3: Create/use the backend endpoint
Once the backend has the route, regenerate `src/types/api.ts` via openapi-typescript.

### Step 4: Create the frontend files
1. **`domain/*.schema.ts`** — Zod schema matching the backend response + inferred types
2. **`domain/*.http.ts`** — `"use server"` function calling `apiClient`, parsing with Zod
3. **Update `server/endpoints/*.ts`** — Add the new wrapper function (or replace old one)

### Step 5: Update the consumer
- Update the import in the page/component to use the new function
- Remove old type imports (from `@/lib/types/*`)
- Handle any type changes (e.g., `listingId` from `number` → `string`)

---

## Old Types to NEVER Use in New Migrations

| File | Types | Reason |
|------|-------|--------|
| `database.types.ts` | All | Supabase auto-generated, snake_case |
| `src/lib/types/listing.ts` | `ListingDB`, `ScoreDB`, `ReviewDB`, `CreateListingDB`, `ResumedListingDB`, `PromotionDB` | snake_case DB shapes |
| `src/lib/types/profile.ts` | `ProfileDB`, `CreateProfileDB`, `UpdateProfileDB`, `HostDB` | snake_case DB shapes |
| `src/lib/types/favorites.ts` | `FavoriteDB`, `FavoriteWithListingDB` | snake_case DB shapes |
| `src/lib/types/reservation.ts` | `ReservationDB`, `CreateReservationDB`, `ResumedReservationWithListingDB` | snake_case DB shapes |
| `src/lib/parsers/*.ts` | All parser functions | Bridge between old→new types, no longer needed |

## Correct Types/Schemas to Use

| Purpose | Source |
|---------|--------|
| OpenAPI-generated types (camelCase) | `src/types/api.ts` → `components["schemas"]["SomeDto"]` |
| Zod validation schemas | `src/lib/api/*/*.schema.ts` |
| Shared fragments (Structure, GuestLimits, Promotion, enums) | `src/lib/api/shared/listing/listing.fragments.schema.ts` |

---

## How to Check Endpoint Availability

Open `src/types/api.ts`. Look for:
```typescript
export interface paths {
  "/reservations/me": {  // ← check if this path exists
    get: operations["ReservationsController_findMy"];
    // ...
  };
}
```

The `paths` interface contains all available backend routes. If the path doesn't exist, the backend needs a new endpoint.

---

## Effective Status Logic (for migrations)

When computing reservation status based on dates:
```
if status is CANCELED or CANCELED_BY_HOST → keep as-is
if now > endDate → "COMPLETED"
else → "UPCOMING"
```

This logic should live in the backend service layer, not in the frontend.
