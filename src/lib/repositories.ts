import Papa from "papaparse";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { makeId, mockStore, upsertMockLead } from "@/lib/mock-store";
import type { Lead, Proposal, SearchRecord } from "@/lib/types";

async function ensureUserStarterData(userId: string | undefined) {
  if (!userId) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { count, error: countError } = await supabase
    .from("saved_leads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError || (count ?? 0) > 0) return;

  const seedLead = {
    user_id: userId,
    place_id: "starter_place_1",
    name: "Sunrise Bakery",
    address: "Anna Nagar, Chennai",
    phone: "+91 90000 00001",
    website: null,
    rating: 3.9,
    has_online_presence: false,
    has_social_media: false,
    notes: "Starter lead: no website or social media, good candidate for pitch.",
    status: "new",
  };

  const { data: insertedLead } = await supabase.from("saved_leads").insert(seedLead).select("id").single();
  await supabase.from("searches").insert({
    user_id: userId,
    query: "bakery",
    location: "Chennai",
    result_count: 2,
  });

  if (insertedLead?.id) {
    await supabase.from("proposals").insert({
      user_id: userId,
      lead_id: insertedLead.id,
      template: "Website Pitch",
      content:
        "Hi Sunrise Bakery team,\n\nI can help you launch a modern website to improve local discovery and daily orders.\n\nCan we do a quick 15-minute call this week?\n\nThanks,\nYour Name",
    });
  }
}

export async function saveSearch(userId: string | undefined, query: string, location: string, resultCount: number) {
  const supabase = await createSupabaseServerClient();
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("searches")
      .insert({ user_id: userId, query, location, result_count: resultCount })
      .select()
      .single();
    if (!error && data) return data as SearchRecord;
  }

  const local: SearchRecord = {
    id: makeId("search"),
    user_id: userId,
    query,
    location,
    result_count: resultCount,
    created_at: new Date().toISOString(),
  };
  mockStore.searches.unshift(local);
  return local;
}

export async function listSearches(userId: string | undefined) {
  await ensureUserStarterData(userId);
  const supabase = await createSupabaseServerClient();
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("searches")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error && data) return data as SearchRecord[];
  }
  return mockStore.searches.slice(0, 10);
}

export async function saveLead(input: Omit<Lead, "id" | "created_at">) {
  const supabase = await createSupabaseServerClient();
  if (supabase && input.user_id) {
    const { data, error } = await supabase
      .from("saved_leads")
      .upsert(input, { onConflict: "user_id,place_id" })
      .select()
      .single();
    if (!error && data) return data as Lead;
  }
  return upsertMockLead(input);
}

export async function listLeads(userId: string | undefined) {
  await ensureUserStarterData(userId);
  const supabase = await createSupabaseServerClient();
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("saved_leads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) return data as Lead[];
  }
  return mockStore.leads;
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("saved_leads").update(updates).eq("id", id).select().single();
    if (!error && data) return data as Lead;
  }
  const lead = mockStore.leads.find((l) => l.id === id);
  if (!lead) return null;
  Object.assign(lead, updates);
  return lead;
}

export async function deleteLead(id: string) {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("saved_leads").delete().eq("id", id);
    if (!error) return true;
  }
  const before = mockStore.leads.length;
  mockStore.leads = mockStore.leads.filter((lead) => lead.id !== id);
  return mockStore.leads.length < before;
}

export async function listProposals(userId: string | undefined) {
  await ensureUserStarterData(userId);
  const supabase = await createSupabaseServerClient();
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) return data as Proposal[];
  }
  return mockStore.proposals;
}

export async function createProposal(input: Omit<Proposal, "id" | "created_at">) {
  const supabase = await createSupabaseServerClient();
  if (supabase && input.user_id) {
    const { data, error } = await supabase.from("proposals").insert(input).select().single();
    if (!error && data) return data as Proposal;
  }
  const proposal: Proposal = {
    ...input,
    id: makeId("proposal"),
    created_at: new Date().toISOString(),
  };
  mockStore.proposals.unshift(proposal);
  return proposal;
}

export async function exportLeadsAsCsv(userId: string | undefined) {
  const leads = await listLeads(userId);
  return Papa.unparse(
    leads.map((lead) => ({
      name: lead.name,
      address: lead.address,
      phone: lead.phone ?? "",
      website: lead.website ?? "",
      social: lead.has_social_media ? "Yes" : "No",
      rating: lead.rating ?? "",
      status: lead.status,
      notes: lead.notes ?? "",
    })),
  );
}
