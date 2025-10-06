export interface ReservationEmailData {
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
  hostAvatarUrl?: string | null;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
