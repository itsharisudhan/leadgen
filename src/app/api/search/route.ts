import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveSearch } from "@/lib/repositories";
import type { SearchResult } from "@/lib/types";

function fallbackResults(query: string, location: string): SearchResult[] {
  return [
    {
      placeId: "demo_1",
      name: `${query} Hub`,
      formattedAddress: `${location} Main Road`,
      nationalPhoneNumber: "+91 90000 00001",
      websiteUri: null,
      rating: 3.9,
      userRatingCount: 22,
      googleMapsUri: "https://maps.google.com",
      hasWebsite: false,
      hasOnlinePresence: false,
    },
    {
      placeId: "demo_2",
      name: `${query} Point`,
      formattedAddress: `${location} Market Street`,
      nationalPhoneNumber: null,
      websiteUri: "https://example.com",
      rating: 4.1,
      userRatingCount: 71,
      googleMapsUri: "https://maps.google.com",
      hasWebsite: true,
      hasOnlinePresence: true,
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const { query, location } = await req.json();
    if (!query || !location) {
      return NextResponse.json({ error: "Query and location are required." }, { status: 400 });
    }

    const user = await getCurrentUser();
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    let results: SearchResult[] = [];

    if (apiKey) {
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.googleMapsUri",
        },
        body: JSON.stringify({
          textQuery: `${query} in ${location}`,
          pageSize: 20,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        results = (data.places ?? []).map((place: any) => {
          const website = place.websiteUri ?? null;
          return {
            placeId: place.id,
            name: place.displayName?.text ?? "Unknown",
            formattedAddress: place.formattedAddress ?? "",
            nationalPhoneNumber: place.nationalPhoneNumber ?? null,
            websiteUri: website,
            rating: typeof place.rating === "number" ? place.rating : null,
            userRatingCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
            googleMapsUri: place.googleMapsUri ?? null,
            hasWebsite: Boolean(website),
            hasOnlinePresence: Boolean(website),
          } as SearchResult;
        });
      }
    }

    if (results.length === 0) {
      results = fallbackResults(query, location);
    }

    await saveSearch(user?.id, query, location, results.length);
    return NextResponse.json({ results, source: apiKey ? "google_or_fallback" : "demo" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
