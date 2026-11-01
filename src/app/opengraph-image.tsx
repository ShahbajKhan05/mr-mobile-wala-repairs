
import { ImageResponse } from "next/og";



export const alt = "MR MOBILE WALA - Buy, Sell & Repair Mobile Phones";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#FAFAF8",
          color: "#202B32",
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

        <div
          style={{
            width: 86,
            height: 86,
            borderRadius: 26,
            background: "#202B32",
            color: "#D8BB85",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          M
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -3,
            display: "flex",
          }}
        >
          MR MOBILE WALA
        </div>

        <div
          style={{
            width: 100,
            height: 4,
            background: "#C6A66B",
            marginTop: 28,
            marginBottom: 28,
            borderRadius: 10,
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: 27,
            color: "#687277",
            letterSpacing: 2,
            display: "flex",
          }}
        >
          BUY  ·  SELL  ·  REPAIR
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 58,
            fontSize: 20,
            color: "#A17D45",
            letterSpacing: 4,
            display: "flex",
          }}
        >
          YOUR MOBILE. OUR PRIORITY.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
