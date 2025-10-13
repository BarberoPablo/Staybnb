import { ReservationConfirmationEmailPreview } from "@/lib/email/templates";

// Sample data for email preview
const sampleEmailData = {
  userName: "John Doe",
  listingTitle: "Cozy Beachfront Villa with Ocean View",
  listingAddress: "123 Ocean Drive, Malibu, CA 90265",
  listingImages: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
  ],
  startDate: new Date("2024-02-15"),
  endDate: new Date("2024-02-18"),
  totalNights: 3,
  guests: {
    adults: 2,
    children: 1,
    infants: 0,
    pets: 0,
  },
  totalPrice: 450.0,
  nightPrice: 150.0,
  discount: 45.0,
  discountPercentage: 10,
  checkInTime: "3:00 PM",
  checkOutTime: "11:00 AM",
  hostName: "Sarah Johnson",
  hostAvatarUrl: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
  reservationId: "RES-2024-001234",
};

export default function EmailPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-2">📧 Email Template Preview</h1>
          <p className="text-gray-600 mb-4">This is how your reservation confirmation email will look to users.</p>
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Refresh Preview</button>
            <a href="/api/email-preview" target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Open in New Tab
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ReservationConfirmationEmailPreview {...sampleEmailData} />
        </div>
      </div>
    </div>
  );
}
