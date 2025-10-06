import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: ["/Landing/BigScreen.png"],
    },
    {
      url: "/auth/login",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: ["/Landing/BigScreenLogin.png"],
    },
  ];
}
