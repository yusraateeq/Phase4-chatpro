import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Todo Pro",
        short_name: "TodoPro",
        description: "The world's most advanced manifestation workspace. Engineered for peak performance and focused execution.",
        start_url: "/",
        display: "standalone",
        background_color: "#030014",
        theme_color: "#7c3aed",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/icon-512-maskable.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
