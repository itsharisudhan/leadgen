import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createProposal, listProposals } from "@/lib/repositories";

export async function GET() {
  const user = await getCurrentUser();
  const proposals = await listProposals(user?.id);
  return NextResponse.json({ proposals });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const body = await req.json();
  if (!body.lead_id || !body.content) {
    return NextResponse.json({ error: "lead_id and content are required" }, { status: 400 });
  }

  const proposal = await createProposal({
    user_id: user?.id,
    lead_id: body.lead_id,
    template: body.template ?? "Website Pitch",
    content: body.content,
  });
  return NextResponse.json({ proposal });
}
