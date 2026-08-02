import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PantryPulse – Track Food, Save Money, Waste Less",
    short_name: "PantryPulse",
    description: "Track groceries, receive expiry reminders, reduce household food waste, and understand your food-saving habits with PantryPulse.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f7d53",
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
    ],
  };
}
