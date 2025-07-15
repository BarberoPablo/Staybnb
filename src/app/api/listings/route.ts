import { createClient } from "@/lib/supabase/server";
import { CreateListingDB } from "@/lib/types/listing";
import { NextRequest, NextResponse } from "next/server";

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

    if (!listings) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: listings }, { status: 200 });
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
    });

    console.log({ body });

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
