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
      .order("start_date", { ascending: false });

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

    const fullCheckin = createUTCDate(startDate.toISOString().substring(0, 10), listingFromDB.check_in_time, listingFromDB.location.timezone);
    const fullCheckout = createUTCDate(endDate.toISOString().substring(0, 10), listingFromDB.check_out_time, listingFromDB.location.timezone);

    const totalNights = calculateNights(fullCheckin, fullCheckout);
    const promotion = listingFromDB.promotions && listingFromDB.promotions.filter((promo) => promo.min_nights <= totalNights)[0];
    const total_price = listingFromDB.night_price * totalNights;
    const discount = twoDecimals(promotion ? (promotion.discount_percentage / 100) * total_price : 0);
    const discount_percentage = twoDecimals(promotion ? promotion.discount_percentage : 0);

    const newReservation: ReservationInsert = {
      user_id: user.id,
      listing_id: listingId,
      start_date: fullCheckin.toISOString(),
      end_date: fullCheckout.toISOString(),
      guests,
      total_price,
      total_nights: totalNights,
      night_price: listingFromDB.night_price,
      discount,
      discount_percentage,
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
