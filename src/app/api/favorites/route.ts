import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: favorites, error } = await supabase
      .from("favorites")
      .select(
        `
          *,
          listing:listing_id (
            id,
            title,
            images,
            night_price,
            location,
            score,
            property_type
          )
        `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { listingId } = await request.json();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("title, images, night_price, location, score")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        listing_id: listingId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: false, error: "Already in favorites" }, { status: 400 });
      }
      console.error("Error adding to favorites:", error);
      return NextResponse.json({ success: false, error: "Failed to add to favorites" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        listing: listing,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
