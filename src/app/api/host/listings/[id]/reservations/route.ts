import { createClient } from "@/lib/supabase/server";
import { ReservationStatusDB } from "@/lib/types/reservation";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string; status: ReservationStatusDB }> }) {
  try {
    const { id, status } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    const supabase = await createClient();

    let query = supabase.from("reservations").select("*").eq("listing_id", Number(id));

    if (status) {
      query = query.eq("status", status);
    }

    const { data: reservationsData, error: reservationsError } = await query.order("start_date", {
      ascending: true,
    });

    if (reservationsError) {
      console.error("Error fetching reservations:", reservationsError);
      return NextResponse.json({ success: false, error: "Error fetching reservations" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        data: reservationsData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
