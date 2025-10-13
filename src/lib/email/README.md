# 📧 Email Notification System

This directory contains the email notification system for the Airbnb Clone application. It sends confirmation emails when users create reservations.

## 🏗️ Architecture

### Files Structure

```
src/lib/email/
├── index.ts          # Main exports
├── resend.ts         # Resend client configuration
├── service.ts        # Email service functions
├── templates.tsx     # React email templates
├── types.ts          # TypeScript type definitions
└── README.md         # This documentation
```

### Dependencies

- **Resend**: Email delivery service
- **React**: For email templates
- **TypeScript**: Type safety

## 📧 Email Templates

### Reservation Confirmation Email

- **Purpose**: Sent when a user creates a reservation
- **Template**: `ReservationConfirmationEmail`
- **Content**:
  - Reservation details (dates, guests, pricing)
  - Property information
  - Host contact information
  - Confirmation number

### Email Features

- ✅ Responsive design
- ✅ Professional styling
- ✅ All reservation details
- ✅ Pricing breakdown with discounts
- ✅ Host information
- ✅ Check-in/check-out times

## 🔧 Usage

### Sending Reservation Confirmation

```typescript
import { sendReservationConfirmationEmail } from "@/lib/email";

const emailData: ReservationEmailData = {
  userEmail: "user@example.com",
  userName: "John Doe",
  reservationId: "res-123",
  // ... other reservation data
};

const result = await sendReservationConfirmationEmail(emailData);
```

### Integration with Reservation Creation

The email is automatically sent when:

1. User creates a reservation through `createReservation()`
2. Reservation is successfully saved to database
3. Email data is prepared and sent asynchronously

### Email Failure Behavior

- ✅ Reservation creation is NOT blocked by email failures
- ✅ Email errors are logged to console
- ✅ User still gets successful reservation confirmation
- ✅ Graceful degradation if email service is down

## 📊 Email Data Structure

### ReservationEmailData Interface

```typescript
interface ReservationEmailData {
  // User information
  userEmail: string;
  userName: string;

  // Reservation details
  reservationId: string;
  startDate: Date;
  endDate: Date;
  guests: Record<string, number>;
  totalNights: number;
  totalPrice: number;
  nightPrice: number;
  discount?: number;
  discountPercentage?: number;

  // Listing information
  listingId: number;
  listingTitle: string;
  listingImages: string[];
  listingAddress: string;
  checkInTime: string;
  checkOutTime: string;

  // Host information
  hostName: string;
  hostEmail?: string;
}
```

## 🔮 Future Enhancements

### Potential Features

- 📧 Host notification emails
- 📧 Cancellation confirmation emails
- 📧 Reminder emails (24h before check-in)
- 📧 Review request emails
- 📧 Multi-language support
- 📧 Email preferences in user settings
- 📧 Email analytics and tracking

### Email Templates to Add

- Host new reservation notification
- Reservation cancellation
- Check-in reminders
- Review requests
- Welcome emails for new users
