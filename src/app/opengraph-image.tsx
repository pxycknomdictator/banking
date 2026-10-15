import { ImageResponse } from "next/og";

export const alt = "Banking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        <div
            style={{
                background: "#171717",
                color: "#fafafa",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px",
                width: "100%",
                height: "100%"
            }}
        >
            <div style={{ fontSize: 32, color: "#a3a3a3" }}>Banking</div>
            <div style={{ fontSize: 86, fontWeight: 700 }}>
                Your money, secure.
            </div>
        </div>
    );
}
