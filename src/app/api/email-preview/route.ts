import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Email preview only available in development" }, { status: 403 });
    }

    // Redirect to the preview page instead of rendering here
    return NextResponse.redirect(new URL("/email-preview", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (error) {
    console.error("Error generating email preview:", error);
    return NextResponse.json({ error: "Failed to generate email preview" }, { status: 500 });
  }
}
