import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cleanString } from "@/lib/server-utils";
import { isValidUrl } from "@/lib/utils";
import { UpdateProfileDB } from "@/lib/types/profile";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (profileError) {
    if (profileError.code === "PGRST116") {
      return NextResponse.json(
        {
          success: false,
          error: "Profile not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: profileError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: profile }, { status: 201 });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const bodyJson = await req.json();

  const allowedKeys: (keyof UpdateProfileDB)[] = ["first_name", "last_name", "avatar_url", "bio"];
  const body: Partial<UpdateProfileDB> = {};

  for (const key of allowedKeys) {
    const value = bodyJson[key];

    if (typeof value === "string") {
      if (key === "avatar_url") {
        const clean_avatar_url = isValidUrl(value.trim()) ? value.trim() : "";
        if (clean_avatar_url) {
          body.avatar_url = clean_avatar_url;
        }
      } else {
        if (value.trim().length > 0) {
          body[key] = cleanString(value);
        }
      }
    }
  }

  const { data, error } = await supabase.from("profiles").update(body).eq("id", user.id).select().single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}
