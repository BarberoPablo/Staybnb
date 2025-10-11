import { ImageResponse } from "next/og";

// Image metadata
export const alt = "StayBnb - Find Your Perfect Vacation Rental";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// OpenGraph Image component
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #7FB069 0%, #5a8a4f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: "bold",
            marginBottom: 20,
            display: "flex",
          }}
        >
          StayBnb
        </div>
        <div
          style={{
            fontSize: 40,
            opacity: 0.9,
            display: "flex",
          }}
        >
          Find Your Perfect Vacation Rental
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
