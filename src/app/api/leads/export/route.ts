import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { exportLeadsAsCsv } from "@/lib/repositories";

export async function GET() {
  const user = await getCurrentUser();
  const csv = await exportLeadsAsCsv(user?.id);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}
