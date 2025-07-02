import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const supabase = await createClient();
    const { data: listings, error } = await supabase
      .from("listings")
      .select()
      .ilike("location", `%${params.get("city")}%`);

    if (error) {
      throw error;
    }

    console.log("API", params.get("city"));

    if (!listings) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: listings }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 });
  }
}
