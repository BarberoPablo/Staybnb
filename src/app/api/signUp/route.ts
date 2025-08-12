import { cleanString } from "@/lib/server-utils";
import { createClient } from "@/lib/supabase/server";
import { isValidUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { first_name, last_name, avatar_url, bio } = await req.json();
  const clean_first_name = cleanString(first_name);
  const clean_last_name = cleanString(last_name);
  const clean_bio = cleanString(bio);
  const clean_avatar_url = avatar_url ? (isValidUrl(avatar_url.trim()) ? avatar_url.trim() : "") : "";

  if (!clean_first_name || !clean_last_name) {
    return NextResponse.json({ error: "First name and last name are required and must be valid text." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error: insertError } = await supabase.from("profiles").insert([
    {
      id: user.id,
      first_name: clean_first_name,
      last_name: clean_last_name,
      avatar_url: clean_avatar_url,
      bio: clean_bio,
      role: "user",
    },
  ]);

  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
