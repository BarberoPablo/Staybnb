import { createClient } from "@/lib/supabase/server";
import { Location, PromotionDB } from "@/lib/types/listing";
import { calculateNights, createUTCDate, twoDecimals } from "@/lib/utils";
import { NextResponse } from "next/server";
import { Database } from "../../../../database.types";

type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];
type ListingWithLocation = Omit<Database["public"]["Tables"]["listings"]["Row"], "location" | "promotions"> & {
  location: Location;
  promotions: PromotionDB[];
};

// To get user reservations
export async function GET() {
  try {
    const supabase = await createClient();
    // At this point supabase.auth.getUser() will read from cookies:
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Auth error:", authErr, user);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
      *,
      listing:listing_id (
        id,
        title,
        location,
        night_price,
        images,
        property_type,
        privacy_type,
        check_in_time,
        check_out_time
      )
    `
      )
      .eq("user_id", user.id)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Getting reservations error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    // At this point supabase.auth.getUser() will read from cookies:
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Auth error:", authErr, user);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, startDate, endDate, guests } = await req.json();
    const { error: listingFromDBError, data: listingFromDB } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single<ListingWithLocation>();

    if (listingFromDBError || !listingFromDB) {
      console.error("Listing does not exist:");
      return NextResponse.json({ error: "Listing does not exist" }, { status: 401 });
    }

    if (!guests) {
      return NextResponse.json({ error: "Guests are required" }, { status: 400 });
    }

    const userSelectedCheckIn = createUTCDate(startDate.substring(0, 10), listingFromDB.check_in_time, listingFromDB.location.timezone);
    const userSelectedCheckOut = createUTCDate(endDate.substring(0, 10), listingFromDB.check_out_time, listingFromDB.location.timezone);

    if (userSelectedCheckIn > userSelectedCheckOut) {
      console.error("Error, checkin date must be before checkout date");
      return NextResponse.json({ error: "Check-in date must be before check-out date" }, { status: 400 });
    }

    const totalNights = calculateNights(userSelectedCheckIn, userSelectedCheckOut);
    const promotion = listingFromDB.promotions && listingFromDB.promotions.filter((promo) => promo.min_nights <= totalNights)[0];
    const total_price = listingFromDB.night_price * totalNights;
    const discount = twoDecimals(promotion ? (promotion.discount_percentage / 100) * total_price : 0);
    const discount_percentage = twoDecimals(promotion ? promotion.discount_percentage : 0);

    //  Checking dates
    const { data: existingReservations, error: reservationFetchError } = await supabase
      .from("reservations")
      .select("start_date, end_date")
      .eq("listing_id", listingId)
      .eq("status", "active");

    if (reservationFetchError) {
      console.error("Error fetching existing reservations:", reservationFetchError);
      return NextResponse.json({ error: "Could not verify availability" }, { status: 500 });
    }

    const existingDateRanges = existingReservations.map((res) => ({
      start: createUTCDate(res.start_date.substring(0, 10), listingFromDB.check_in_time, listingFromDB.location.timezone),
      end: createUTCDate(res.end_date.substring(0, 10), listingFromDB.check_out_time, listingFromDB.location.timezone),
    }));

    const isOverlapping = existingDateRanges.some(({ start, end }) => {
      return (
        (userSelectedCheckIn >= start && userSelectedCheckIn < end) ||
        (userSelectedCheckOut > start && userSelectedCheckOut <= end) ||
        (userSelectedCheckIn <= start && userSelectedCheckOut >= end)
      );
    });

    if (isOverlapping) {
      return NextResponse.json({ error: "Selected dates are not available" }, { status: 400 });
    }

    const newReservation: ReservationInsert = {
      user_id: user.id,
      listing_id: listingId,
      start_date: userSelectedCheckIn.toISOString(),
      end_date: userSelectedCheckOut.toISOString(),
      guests,
      total_price,
      total_nights: totalNights,
      night_price: listingFromDB.night_price,
      discount,
      discount_percentage,
      status: "active",
    };

    const { error: insertError } = await supabase.from("reservations").insert(newReservation);

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ success: false, error: "Failed to create reservation" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
