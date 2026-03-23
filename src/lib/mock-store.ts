import type { Lead, Proposal, SearchRecord } from "@/lib/types";

const now = () => new Date().toISOString();

export const mockStore: {
  leads: Lead[];
  proposals: Proposal[];
  searches: SearchRecord[];
} = {
  leads: [],
  proposals: [],
  searches: [],
};

export function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function upsertMockLead(lead: Omit<Lead, "id" | "created_at">) {
  const existing = mockStore.leads.find((l) => l.place_id === lead.place_id);
  if (existing) {
    Object.assign(existing, lead);
    return existing;
  }

  const created: Lead = {
    ...lead,
    id: makeId("lead"),
    created_at: now(),
  };
  mockStore.leads.unshift(created);
  return created;
}
