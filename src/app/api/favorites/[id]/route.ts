import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const listingId = parseInt(id);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);

    if (error) {
      console.error("Error removing from favorites:", error);
      return NextResponse.json({ success: false, error: "Failed to remove from favorites" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
