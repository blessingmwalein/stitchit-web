import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stitch't — Custom Tufted Rugs",
    short_name: "Stitch't",
    description: "Premium custom tufted rugs, handcrafted in Zimbabwe.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#f97316",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
