import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const moduleId = searchParams.get("moduleId");

  if (!moduleId) {
    return NextResponse.json(
      { error: "moduleId is required" },
      { status: 400 }
    );
  }

  const t = await db
    .select()
    .from(tasks)
    .where(eq(tasks.moduleId, Number(moduleId)))
    .orderBy(asc(tasks.id));

  return NextResponse.json(t);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { moduleId, title, description, status, stage, assignedRole, assignedTool, acceptanceCriteria, priority } = body;

  if (!moduleId || !title) {
    return NextResponse.json(
      { error: "moduleId and title are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(tasks)
    .values({
      moduleId: Number(moduleId),
      title,
      description: description || null,
      status: status || "draft",
      stage: stage || null,
      assignedRole: assignedRole || null,
      assignedTool: assignedTool || null,
      acceptanceCriteria: acceptanceCriteria || null,
      priority: priority || "P1",
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
