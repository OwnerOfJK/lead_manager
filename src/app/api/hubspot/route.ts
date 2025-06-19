import { NextResponse } from "next/server";
import type { HubSpotProfile } from "@/app/types";

export async function GET() {
  console.log("GET /api/hubspot called");
  try {
    const contacts = await fetchNewHubspotContacts();
    return NextResponse.json(contacts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get HubSpot contacts" }, { status: 500 });
  }
}

async function fetchNewHubspotContacts(): Promise<HubSpotProfile[]> {
  const res = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,phone,hs_linkedin_url,hs_lead_status,hs_object_id,createdate`, {
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error("HubSpot API error:", await res.text());
    return [];
  }

  const data = await res.json();

  if (!data.results) return [];

  const newContacts = data.results
    .filter((contact: any) =>
      contact.properties.hs_lead_status === "NEW"
    )
    .map((contact: any): HubSpotProfile => ({
      firstname: contact.properties.firstname || "",
      lastname: contact.properties.lastname || "",
      email: contact.properties.email || "",
      phone: contact.properties.phone || undefined,
      lead_status: contact.properties.hs_lead_status || undefined,
      linkedin_url: contact.properties.hs_linkedin_url || undefined,
      contact_id: contact.id || undefined,
      createdate: contact.properties.createdate,
    }));

  return newContacts;
}