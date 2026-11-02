
import { ImageResponse } from "next/og";

export const alt = "MR MOBILE WALA REPAIRS - Original Brand Logo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoUrl = new URL(
    "/mr-mobile-wala-logo.png",
    "https://mr-mobile-wala-repairs.vercel.app"
  );

  const logoResponse = await fetch(logoUrl);

  if (!logoResponse.ok) {
    throw new Error("Unable to load MR MOBILE WALA original logo.");
  }

  const logoBuffer = await logoResponse.arrayBuffer();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFAF8",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 22,
            border: "2px solid #E7DDCA",
            borderRadius: 28,
            display: "flex",
          }}
        />

        <img
          src={logoBuffer as unknown as string}
          alt="MR MOBILE WALA"
          width="900"
          height="470"
          style={{
            width: "900px",
            height: "470px",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
