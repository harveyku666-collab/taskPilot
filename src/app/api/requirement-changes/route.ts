import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirementChanges } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requirementId = searchParams.get("requirementId");

  const where = requirementId ? eq(requirementChanges.requirementId, Number(requirementId)) : undefined;

  const records = await db
    .select()
    .from(requirementChanges)
    .where(where ? where : undefined)
    .orderBy(desc(requirementChanges.createdAt));

  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { requirementId, versionLabel, changeSummary, rationale, status } = body;

  if (!requirementId || !versionLabel || !changeSummary) {
    return NextResponse.json(
      { error: "requirementId, versionLabel, and changeSummary are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(requirementChanges)
    .values({
      requirementId: Number(requirementId),
      versionLabel,
      changeSummary,
      rationale: rationale || null,
      status: status || "draft",
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
