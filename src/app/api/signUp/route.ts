import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { first_name, last_name, avatar_url, bio } = await req.json();

  console.log({ first_name, last_name, avatar_url, bio });

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
      first_name,
      last_name,
      avatar_url,
      bio,
      role: "user",
    },
  ]);

  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
