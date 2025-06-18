"use client";

import { useState } from "react";
import Image from "next/image";
import { HubSpotProfile } from "@/app/types";
import CollectData from "./components/ContactCard";

export default function Home() {
  const [leads, setLeads] = useState<HubSpotProfile[]>([]);

  const fetchHubSpotProfiles = async () => {
    const response = await fetch("/api/hubspot", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching HubSpot profiles:", errorData);
      return;
    }

    const profiles = await response.json();
    setLeads(profiles); // Save profiles to state
    console.log("HubSpot Profiles:", profiles);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/lead.png"
          alt="lead logo"
          width={180}
          height={38}
          priority
        />

        <button
          onClick={fetchHubSpotProfiles}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          List Leads
        </button>

        <ul className="flex flex-col gap-4 mt-4 w-full max-w-xl">
          {leads.map((lead, idx) => (
            <li
              key={idx}
              className="border p-6 rounded shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <CollectData lead={lead} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}