import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DreamSVin",
    short_name: "DreamSVin",
    description: "Your Business Architects. Your Growth Partners.",
    start_url: "/",
    display: "browser",
    background_color: "#F9F5EF",
    theme_color: "#F9F5EF",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
