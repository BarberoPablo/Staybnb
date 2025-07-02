import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    // At this point supabase.auth.getUser() will read from cookies:
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Insert error:", authErr, user);

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, startDate, endDate, guests, totalPrice, totalNights, nightPrice, discount, discountPercentage } = await req.json();

    console.log({ listingId, startDate, endDate, guests, totalPrice, totalNights, nightPrice, discount, discountPercentage });

    const { error: insertError } = await supabase.from("reservations").insert({
      user_id: user.id,
      listing_id: listingId,
      start_date: startDate,
      end_date: endDate,
      guests,
      total_price: totalPrice,
      total_nights: totalNights,
      night_price: nightPrice,
      discount,
      discount_percentage: discountPercentage,
    });

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
