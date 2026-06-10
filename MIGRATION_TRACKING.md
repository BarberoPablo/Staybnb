# Migration Progress

## Legend
- ✅ **Done** — Fully migrated (apiClient + Zod)
- 🔶 **In Progress** — Being worked on
- ❌ **Pending** — Backend endpoint needed first
- 🗑️ **Dead Code** — Unused, can be removed

---

## Health Endpoints

| Entity | Old Function | Status | Backend Route | New Schema | New HTTP |
|--------|-------------|--------|---------------|------------|----------|
| Amenities | `getAmenities` | ✅ Done | `GET /amenities` | `amenities.schema.ts` | `amenities.http.ts` |
| Favorites | All | ✅ Done | `GET/POST/DELETE /favorites/**` | `favorites.schema.ts` | `favorites.http.ts` |
| Host Draft Listings | All | ✅ Done | `GET/POST/PATCH/DELETE /host/draft-listings/**` | `draftListings.schema.ts` | `draftListings.http.ts` |
| Host Listings | All | ✅ Done | `GET/POST/PATCH /host/listings/**` | `host/listings.schema.ts` | `host/listings.http.ts` |

---

## Partially Migrated Endpoints

### reservations.ts
| Function | Status | Notes |
|----------|--------|-------|
| `getListingUnavailableDates` | ✅ Done | `GET /reservations/{id}/unavailable-dates` |
| `createReservation` | ✅ Done | `POST /reservations/{id}` |
| `getUserReservations` | ❌ Pending | Needs `GET /reservations/me` in backend |
| `getHostReservationsGroupedByListing` | ❌ Pending | Needs backend endpoint |
| `cancelReservation` | ❌ Pending | Needs backend endpoint |

### listings.ts
| Function | Status | Notes |
|----------|--------|-------|
| `getListingCheckout` | ✅ Done | `GET /listings/{id}/checkout` |
| `getListingDetails` | ✅ Done | `GET /listings/{id}` |
| `searchListings` | ✅ Done | `GET /listings` |
| `getPopularListings` | ✅ Done | `GET /listings/popular` |
| `getFeaturedListings` | ✅ Done | `GET /listings/featured` |
| `addReviewToListing` | ❌ Pending | Needs backend endpoint |
| `getAllListingsWithHost` | ❌ Pending | Admin — needs backend endpoint |
| `updateListingStatus` | ❌ Pending | Admin — needs backend endpoint |

### profile.ts
| Function | Status | Notes |
|----------|--------|-------|
| `getProfile` | ✅ Done | `GET /profiles/me` |
| `updateProfile` | ✅ Done | `PATCH /profiles/me` |
| `signUp` | ❌ Pending | Needs backend endpoint |

### cities.ts
| Function | Status | Notes |
|----------|--------|-------|
| `getPopularDestinations` | ✅ Done | `GET /cities/popular` |
| `getAllCities` | ❌ Pending | Uses Prisma |
| `searchCities` | 🗑️ Dead code | Not called anywhere |

---

## Direct Prisma Usage (Outside Endpoints)
| File | What it does | Status |
|------|-------------|--------|
| `requireUserWithProfile.ts` | `prisma.profiles.findUnique` | ❌ Pending |
| `sitemap.ts` | `prisma.listings.findMany` + `prisma.cities.findMany` | ❌ Pending |
