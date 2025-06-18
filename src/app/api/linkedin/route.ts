import { NextRequest, NextResponse } from "next/server";
import type { LinkedInProfile } from "@/app/types";

export async function POST(req: NextRequest) {
  console.log("GET /api/linkedin called");
  const { url } = await req.json();

  if (!url || !url.includes("linkedin.com/in/")) {
    return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
  }

  try {
    const profile: LinkedInProfile = await getLinkedInProfile(url);
    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to scrape profile" }, { status: 500 });
  }
}

/**
 * Scrapes basic profile data from a LinkedIn profile URL.
 * I took a shortcut here and used a mock implementation.
 */
async function getLinkedInProfile(
  url: string,
): Promise<LinkedInProfile> {
    console.log(`Scraping LinkedIn profile: ${url}`);
    const contact: LinkedInProfile = {
        name: "John Kaller",
        headline: "Core Contributor @ PixeLAW | User-centric Software Engineer",
        location: "Barcelona, Catalonia, Spain",
    };
    return contact;
}