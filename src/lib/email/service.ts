import { resend } from "./resend";
import { ReservationEmailData, EmailResult } from "./types";
import { ReservationConfirmationEmail } from "./templates";
import { ReactElement } from "react";

export async function sendReservationConfirmationEmail(data: ReservationEmailData): Promise<EmailResult> {
  try {
    const emailContent = ReservationConfirmationEmail({
      userName: data.userName,
      listingTitle: data.listingTitle,
      listingAddress: data.listingAddress,
      listingImages: data.listingImages,
      startDate: data.startDate,
      endDate: data.endDate,
      totalNights: data.totalNights,
      guests: data.guests,
      totalPrice: data.totalPrice,
      nightPrice: data.nightPrice,
      discount: data.discount,
      discountPercentage: data.discountPercentage,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      hostName: data.hostName,
      hostAvatarUrl: data.hostAvatarUrl || undefined,
      reservationId: data.reservationId,
    });

    const result = await resend.emails.send({
      from: "Staybnb <staybnb@resend.dev>",
      to: [data.userEmail],
      subject: `Reservation Confirmed - ${data.listingTitle}`,
      react: emailContent as ReactElement,
    });

    if (result.error) {
      console.error("Resend API error:", result.error);
      return {
        success: false,
        error: result.error.message || "Failed to send email",
      };
    }

    console.log("Email sent successfully:", result.data?.id);
    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending reservation confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Utility function to format guest information for email
export function formatGuestsForEmail(guests: Record<string, number>): Record<string, number> {
  const formattedGuests: Record<string, number> = {};

  // Capitalize first letter and handle pluralization
  Object.entries(guests).forEach(([type, count]) => {
    if (count > 0) {
      const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
      formattedGuests[formattedType] = count;
    }
  });

  return formattedGuests;
}
