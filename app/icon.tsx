import { ImageResponse } from "next/og"

export const size = {
    width: 32,
    height: 32,
}
export const contentType = "image/png"

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {/* 阴影层 */}
                <div
                    style={{
                        position: "absolute",
                        top: 3,
                        left: 3,
                        width: 28,
                        height: 28,
                        backgroundColor: "#000",
                        borderRadius: 6,
                    }}
                />
                {/* 黄色背景层 */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 28,
                        height: 28,
                        backgroundColor: "#facc15",
                        border: "2px solid #000",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* MapPin SVG */}
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
