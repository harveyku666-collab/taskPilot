import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contextMemories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  const memories = await db
    .select()
    .from(contextMemories)
    .where(eq(contextMemories.projectId, Number(projectId)))
    .limit(1);

  return NextResponse.json(memories[0] || null);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectId, summary, currentStatus, blockers, nextStep } = body;

  if (!projectId || !summary || !currentStatus || !nextStep) {
    return NextResponse.json(
      { error: "projectId, summary, currentStatus, and nextStep are required" },
      { status: 400 }
    );
  }

  // Upsert: insert or update on conflict with project_id unique constraint
  const [result] = await db
    .insert(contextMemories)
    .values({ projectId: Number(projectId), summary, currentStatus, blockers, nextStep })
    .onConflictDoUpdate({
      target: contextMemories.projectId,
      set: { summary, currentStatus, blockers, nextStep },
    })
    .returning();

  return NextResponse.json(result);
}
