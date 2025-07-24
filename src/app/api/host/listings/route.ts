import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const includeReservationsParam = req.nextUrl.searchParams.get("includeReservations");
    const selectClause = includeReservationsParam === "true" ? "*, reservations(*)" : "*";

    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Auth error:", authErr, user);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: listingsWithReservations, error } = await supabase.from("listings").select(selectClause).eq("host_id", user.id);

    if (error) {
      throw error;
    }

    if (!listingsWithReservations) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: listingsWithReservations }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
