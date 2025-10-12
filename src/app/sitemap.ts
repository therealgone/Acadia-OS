import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://acadia-os.vercel.app/"; // replace with your actual domain

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
    {
      url: `${baseUrl}/app/timetable`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
    {
      url: `${baseUrl}/app/attendance`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
      {
      url: `${baseUrl}/app/marks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
      {
      url: `${baseUrl}/app/course`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
     {
      url: `${baseUrl}/app/calendar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
     {
      url: `${baseUrl}/app/profile`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
  ];
}
