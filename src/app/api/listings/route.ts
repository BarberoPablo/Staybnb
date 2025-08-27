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

    const includeAmenities = params.get("includeAmenities") === "true";
    const amenities = params.get("amenities")?.split(",").filter(Boolean);
    const limit = parseInt(params.get("limit") || "50");
    const offset = parseInt(params.get("offset") || "0");

    // Build the select query
    let selectQuery = "*";

    if (includeAmenities) {
      selectQuery = `
        *,
        listing_amenities(
          amenities(
            id,
            name,
            category
          )
        )
      `;
    }

    // Start building the query
    let query = supabase.from("listings").select(selectQuery);

    // Apply filters
    if (city) {
      query = query.ilike("location->>city", `%${city}%`);
    }

    if (northEast && southWest && northEast.length === 2 && southWest.length === 2) {
      const [neLat, neLng] = northEast;
      const [swLat, swLng] = southWest;

      query = query
        .gte("location->lat", swLat.toString())
        .lte("location->lat", neLat.toString())
        .gte("location->lng", swLng.toString())
        .lte("location->lng", neLng.toString());
    }

    // Filter by specific amenities if provided
    if (amenities && amenities.length > 0) {
      const amenityIds = amenities.map((id) => parseInt(id)).filter((id) => !isNaN(id));
      if (amenityIds.length > 0) {
        query = query.in("listing_amenities.amenity_id", amenityIds);
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: listings, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data: listings ?? [],
        pagination: {
          limit,
          offset,
          total: listings?.length || 0,
        },
      },
      { status: 200 }
    );
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
