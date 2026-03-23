export type LeadStatus = "new" | "contacted" | "proposal_sent" | "won" | "lost";

export type Lead = {
  id: string;
  user_id?: string;
  place_id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  has_online_presence: boolean;
  notes: string | null;
  status: LeadStatus;
  created_at: string;
};

export type SearchRecord = {
  id: string;
  user_id?: string;
  query: string;
  location: string;
  result_count: number;
  created_at: string;
};

export type Proposal = {
  id: string;
  user_id?: string;
  lead_id: string;
  template: string;
  content: string;
  created_at: string;
};

export type SearchResult = {
  placeId: string;
  name: string;
  formattedAddress: string;
  nationalPhoneNumber: string | null;
  websiteUri: string | null;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  hasWebsite: boolean;
  hasOnlinePresence: boolean;
};
