import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: listing, error: listingError } = await supabase.from("listings").select("*").eq("id", Number(id)).single();

    if (listingError || !listing) {
      console.error("Error fetching listing:", listingError);
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: reservations, error: reservationsError } = await supabase
      .from("reservations")
      .select("start_date, end_date")
      .eq("listing_id", Number(id))
      .gte("end_date", today);

    if (reservationsError) {
      console.error("Error fetching reservations", reservationsError);
      return NextResponse.json({ error: "Could not fetch reservations" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...listing,
          reservations: reservations || [],
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
