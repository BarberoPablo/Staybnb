import { createClient } from "@/lib/supabase/server";
import { CreateListingDB } from "@/lib/types/listing";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const supabase = await createClient();

    const city = params.get("city");
    const northEast = params.get("northEast")?.split(",").map(Number);
    const southWest = params.get("southWest")?.split(",").map(Number);

    const baseQuery = supabase.from("listings").select();

    if (city) {
      baseQuery.ilike("location->>city", `%${city}%`);
    }

    if (northEast && southWest && northEast.length === 2 && southWest.length === 2) {
      const [neLat, neLng] = northEast;
      const [swLat, swLng] = southWest;

      baseQuery
        .gte("location->lat", swLat.toString())
        .lte("location->lat", neLat.toString())
        .gte("location->lng", swLng.toString())
        .lte("location->lng", neLng.toString());
    }

    const { data: listings, error } = await baseQuery;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data: listings ?? [] }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Auth error:", authErr, user);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateListingDB = await req.json();
    const { error: insertError } = await supabase.from("listings").insert({
      ...body,
      host_id: user.id,
      status: "pending",
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ success: false, error: "Failed to create listing" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
