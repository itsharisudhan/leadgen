import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveSearch } from "@/lib/repositories";
import type { SearchResult } from "@/lib/types";

function fallbackResults(query: string, location: string): SearchResult[] {
  const niches = ["Cafe", "Boutique", "Studio", "Clinic", "Law Firm", "Agency", "Gym", "Spa", "Bakery", "Garage"];
  const results: SearchResult[] = [];

  for (let i = 1; i <= 22; i++) {
    const niche = niches[i % niches.length];
    const name = `${location} ${niche} ${i > 10 ? "Pro" : "Hub"}`;
    const hasWebsite = i % 3 === 0; // Only ~33% have websites
    const hasSocialMedia = i % 2 === 0; // ~50% have social media
    
    results.push({
      placeId: `demo_${i}`,
      name: name,
      formattedAddress: `${location} Street No. ${100 + i}, Area ${i}`,
      nationalPhoneNumber: `+91 90000 ${String(i).padStart(5, "0")}`,
      websiteUri: hasWebsite ? `https://example${i}.com` : null,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      userRatingCount: Math.floor(Math.random() * 200),
      googleMapsUri: "https://maps.google.com",
      hasWebsite,
      hasOnlinePresence: hasWebsite,
      hasSocialMedia,
    });
  }
  return results;
}

function toAddress(tags: Record<string, string> | undefined) {
  if (!tags) return "";
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.join(", ");
}

async function fetchOpenStreetMapResults(query: string, location: string): Promise<SearchResult[]> {
  const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`;
  const geocodeResponse = await fetch(geocodeUrl, {
    headers: {
      "User-Agent": "LeadGen Demo (contact: demo@leadgen.local)",
    },
    cache: "no-store",
  });
  if (!geocodeResponse.ok) return [];

  const geoData = await geocodeResponse.json();
  const first = geoData?.[0];
  if (!first?.lat || !first?.lon) return [];

  const lat = Number(first.lat);
  const lon = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return [];

  const q = query.replace(/"/g, "");
  const overpass = `[out:json][timeout:25];
(
  nwr(around:18000,${lat},${lon})["name"]["shop"~"${q}",i];
  nwr(around:18000,${lat},${lon})["name"]["amenity"~"${q}",i];
  nwr(around:18000,${lat},${lon})["name"]["office"~"${q}",i];
  nwr(around:18000,${lat},${lon})["name"]["craft"~"${q}",i];
  nwr(around:18000,${lat},${lon})["name"]["tourism"~"${q}",i];
);
out tags center 80;`;

  const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "User-Agent": "LeadGen Demo (contact: demo@leadgen.local)",
    },
    body: overpass,
    cache: "no-store",
  });
  if (!overpassResponse.ok) return [];

  const overpassData = await overpassResponse.json();
  const elements = Array.isArray(overpassData?.elements) ? overpassData.elements : [];

  const mapped = elements
    .filter((el: any) => el?.tags?.name)
    .map((el: any) => {
      const tags = el.tags ?? {};
      const website = tags.website ?? tags["contact:website"] ?? null;
      const phone = tags.phone ?? tags["contact:phone"] ?? null;
      const address = toAddress(tags) || location;
      return {
        placeId: `osm_${el.type}_${el.id}`,
        name: tags.name,
        formattedAddress: address,
        nationalPhoneNumber: phone,
        websiteUri: website,
        rating: null,
        userRatingCount: null,
        googleMapsUri: null,
        hasWebsite: Boolean(website),
        hasOnlinePresence: Boolean(website),
        hasSocialMedia: Boolean(tags.facebook || tags.instagram || tags.twitter || tags.linkedin),
      } as SearchResult;
    });

  // Remove duplicates by placeId.
  const uniq = new Map<string, SearchResult>();
  mapped.forEach((item: SearchResult) => {
    if (!uniq.has(item.placeId)) uniq.set(item.placeId, item);
  });

  return Array.from(uniq.values()).slice(0, 80);
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
    let source: "google" | "openstreetmap" | "demo" = "demo";

    if (apiKey) {
      let pageToken: string | undefined;
      for (let page = 0; page < 3; page++) {
        const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.googleMapsUri,nextPageToken",
          },
          body: JSON.stringify({
            textQuery: `${query} in ${location}`,
            pageSize: 20,
            pageToken,
          }),
        });

        if (!response.ok) break;
        const data = await response.json();

        const pageResults = (data.places ?? []).map((place: any) => {
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
            hasSocialMedia: false, // Default to false for demo purposes to highlight "gaps"
          } as SearchResult;
        });
        results.push(...pageResults);

        pageToken = data.nextPageToken;
        if (!pageToken) break;
      }

      if (results.length > 0) {
        source = "google";
      }
    } else {
      results = await fetchOpenStreetMapResults(query, location);
      if (results.length > 0) {
        source = "openstreetmap";
      }
    }

    if (results.length === 0) {
      results = fallbackResults(query, location);
      source = "demo";
    }

    // Avoid duplicate rows in UI when multi-page results overlap.
    const unique = new Map<string, SearchResult>();
    results.forEach((item: SearchResult) => {
      if (!unique.has(item.placeId)) {
        unique.set(item.placeId, item);
      }
    });
    results = Array.from(unique.values()).slice(0, 80);

    await saveSearch(user?.id, query, location, results.length);
    return NextResponse.json({ results, source });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
