# Hosting file structure

src/
├── app/
│ └── hosting/
│ └── create/
│ ├── layout.tsx # Layout exclusivo para el flow de creación
│ ├── page.tsx # Redirect automático al primer paso
│ ├── property-type/ # 🆕 Paso 1 - Tipo de propiedad
│ │ └── page.tsx
│ ├── privacy-type/ # Paso 2 - Nivel de privacidad
│ │ └── page.tsx
│ ├── location/ # Paso 3 - Ubicación + mapa
│ │ └── page.tsx
│ ├── basics/ # Paso 4 - Guests, beds, baños
│ │ └── page.tsx
│ ├── amenities/ # Paso 5 - Amenidades + seguridad
│ │ └── page.tsx
│ ├── photos/ # Paso 6 - Subida de imágenes
│ │ └── page.tsx
│ └── description/ # Paso 7 - Título + descripción + precio
│ └── page.tsx

---

# Technical information

---

# 🔐 Supabase Auth & Session Management with @supabase/ssr

This project uses Supabase for authentication and session handling via the official `@supabase/ssr package`. This replaces the now-deprecated `@supabase/auth-helpers-nextjs`.

## 🧠 How Authentication Works

- On the client side, we use a browser client (createBrowserClient) to handle login, registration, and access tokens.
- On the server side (Route Handlers, Server Components, Middleware), we use a server client (createServerClient) that reads and writes secure HTTP-only cookies to persist the session.
- A middleware layer ensures the session stays fresh (tokens are rotated when needed).
- We also sync the session in /auth/callback using supabase.auth.setSession() for OAuth and magic links.

### 🔄 Middleware Explained

Supabase provides a session-middleware utility to automatically refresh the user's session.

The `middleware.ts` from the `root-level` in the app, is the actual Next.js middleware. It will:

- Read the session from cookies
- Refresh the session (if needed)
- Write updated tokens back into the response

The `middleware.ts` from `lib/supabase/middleware.ts`, is is called from the `middleware.ts` at the `root-level`, so it's not executed independently. It encapsulates the logic for refreshing the session.

#### ⚠️ Why Two Middleware Files?

- `middleware.ts` in the root of the app is required by Next.js to register a middleware. It uses the matcher field to determine which routes the middleware applies to.
- `lib/supabase/middleware.ts` is just a helper you import and call from the root middleware. It contains all the Supabase-specific logic to refresh cookies and sessions.
- This separation keeps the root-level middleware clean and avoids duplication across environments.

# 👆🏻Reservation Flow (Client to Server)

1. On the client, there is a reservation payload and call `api.createReservation()`.
2. `api.createReservation` uses `customFetch.post()` to send a POST request to `/api/reservations`.
3. The server route (`app/api/reservations/route.ts`) uses `createServerClient()` from `@supabase/ssr` to:
   - Read the user session from cookies.
   - Insert the reservation into the database.

✅ This works securely, with sessions, and full server-side validation.

---

### About Server Actions

Next.js offers a new alternative: **Server Actions**.

They let you call a server function directly from your client or form (no manual `fetch`).

#### 🟢 Pros:

- Less boilerplate (no API routes, fetch config, headers).
- Clean function-based API.
- Native form support.

#### 🔴 Cons:

- Can’t be used directly in Client Components (unless wrapped in special helpers).
- Less control.
- Still evolving; less flexible than traditional API route + fetch.

For now, I stick with `customFetch` + `/api/*` route handlers for flexibility and full Supabase control.

---

# 🏡 Booking Components

UI components for selecting dates and calculating reservation prices. Includes logic for applying long-stay promotions.

## Components

- `BookingForm.tsx`: Calendar with price calculation. Rendered inline (desktop).
- `BookingModal.tsx`: Modal that wraps `BookingForm`. Triggered in mobile.
- `BookingButton.tsx`: Floating button that opens the booking modal. Used in mobile.

## Responsive Behavior

- 📱 **Mobile (`< sm`)** → `BookingButton` → opens `BookingModal`
- 💻 **Desktop (`≥ sm`)** → `BookingForm` displayed directly

## File Structure

```text
components/
  Booking/
    BookingForm.tsx
    BookingModal.tsx
    BookingButton.tsx
```

To configure Supabase for getting DB types run:
export SUPABASE_ACCESS_TOKEN=<token>
$ npx supabase gen types typescript --project-id <project-id> > database.types.ts
