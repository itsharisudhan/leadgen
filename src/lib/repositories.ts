import Papa from "papaparse";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { makeId, mockStore, upsertMockLead } from "@/lib/mock-store";
import type { Lead, Proposal, SearchRecord } from "@/lib/types";

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
      rating: lead.rating ?? "",
      status: lead.status,
      notes: lead.notes ?? "",
    })),
  );
}
