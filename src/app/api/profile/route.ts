import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  console.log({ profile });
  console.log({ profileError });

  if (profileError) {
    // Si es un error de "no encontrado" (PGRST116), devolver 404
    if (profileError.code === "PGRST116") {
      return NextResponse.json(
        {
          success: false,
          error: "Profile not found",
        },
        { status: 404 }
      );
    }

    // Para otros errores, devolver 500
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
