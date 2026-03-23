import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteLead, listLeads, saveLead, updateLead } from "@/lib/repositories";

export async function GET() {
  const user = await getCurrentUser();
  const leads = await listLeads(user?.id);
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const body = await req.json();
  const lead = await saveLead({
    user_id: user?.id,
    place_id: body.place_id,
    name: body.name,
    address: body.address,
    phone: body.phone ?? null,
    website: body.website ?? null,
    rating: body.rating ?? null,
    has_online_presence: Boolean(body.has_online_presence),
    notes: body.notes ?? null,
    status: body.status ?? "new",
  });
  return NextResponse.json({ lead });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const lead = await updateLead(body.id, body.updates ?? {});
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const ok = await deleteLead(body.id);
  return NextResponse.json({ success: ok });
}
