import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Auth error:", authErr, user);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("id, user_id, status, listing_id(host_id)")
      .eq("id", id)
      .single();

    if (fetchError || !reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    const isGuest = reservation.user_id === user.id;
    const isHost = reservation.listing_id?.host_id === user.id;

    if (!isGuest && !isHost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (reservation.status !== "active") {
      return NextResponse.json({ error: "Can only cancel active reservations" }, { status: 400 });
    }

    const { error: cancelError } = await supabase
      .from("reservations")
      .update({ status: isGuest ? "canceled" : "canceled_by_host" })
      .eq("id", id)
      .single();

    if (cancelError) {
      console.error("Error canceling reservation:", cancelError);
      return NextResponse.json({ success: false, error: "Error canceling reservation" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
