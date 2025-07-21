import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: reservationsData, error: reservationsError } = await supabase
      .from("reservations")
      .select(
        `
        start_date,
        end_date,
        listing:listing_id (
          id,
          location,
          check_in_time,
          check_out_time
        )
        `
      )
      .eq("listing_id", Number(id))
      .eq("status", "active")
      .order("start_date", { ascending: false });

    if (reservationsError) {
      console.error("Error fetching reservations:", reservationsError);
      return NextResponse.json({ error: "Error fetching reservations" }, { status: 500 });
    }

    //  Check if supabase is returning a string or an object
    //  eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseLocation = (location: any) => (typeof location === "string" ? JSON.parse(location) : location);

    if (reservationsData.length === 0) {
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .select("location, check_in_time, check_out_time")
        .eq("id", Number(id))
        .single();

      if (listingError || !listingData) {
        console.error("Error fetching listing:", listingError);
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }

      const parsedLocation = parseLocation(listingData.location);

      return NextResponse.json(
        {
          success: true,
          data: {
            reservations: [],
            listing: { timezone: parsedLocation.timezone, check_in_time: listingData.check_in_time, check_out_time: listingData.check_out_time },
          },
        },
        { status: 200 }
      );
    }

    //  Avoid extra data
    const reservations = reservationsData.map((reservation) => ({ start_date: reservation.start_date, end_date: reservation.end_date }));
    //  Take the listing information from the first reservation (all reservations share have the same listing)
    const { location, check_in_time, check_out_time } = reservationsData[0].listing;
    const parsedLocation = parseLocation(location);

    return NextResponse.json(
      {
        success: true,
        data: {
          reservations,
          listing: {
            timezone: parsedLocation.timezone,
            check_in_time,
            check_out_time,
          },
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
