// src/SRM-SCRAPPER/logout.ts
export async function logoutUser(cookies: string): Promise<void> {
  try {
    await fetch(
      "https://academia.srmist.edu.in/accounts/p/10002227248/logout?servicename=ZohoCreator&serviceurl=https://academia.srmist.edu.in",
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/x-www-form-urlencoded",
          cookie: cookies,
        },
      }
    );
    // Nothing else needed, logout is triggered
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
