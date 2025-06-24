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
