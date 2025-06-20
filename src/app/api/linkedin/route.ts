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
 * Here we should practically either scrape the profile from a LinkedIn profile URL or query the LinedkIn API.
 * I took a shortcut here and used a mock implementation.
 */
async function getLinkedInProfile(
  url: string,
): Promise<LinkedInProfile> {
  let contact: LinkedInProfile;
  if (url.includes("linkedin.com/in/brianhalligan/")) {
    contact = {
        name: "Brian Halligan",
        headline: "CEO @ HubSpot | Entrepreneur | Author",
        location: "Cambridge, Massachusetts, USA",
    };
  }
  else if (url.includes("linkedin.com/in/mariajohnson/")) {
    contact = {
        name: "Maria Johnson",
        headline: "Director Of Development at The Women’s Center of Jacksonville",
        location: "Jacksonville, Florida, United States",
    };
  } else {
        contact = {
        name: "John Kaller",
        headline: "Core Contributor @ PixeLAW | 42 Berlin | Business-Focused Software Engineer",
        location: "Barcelona, Catalonia, Spain",
    };
  }
  return contact;
}