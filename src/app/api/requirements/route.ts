import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirements } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  const reqs = await db
    .select()
    .from(requirements)
    .where(eq(requirements.projectId, Number(projectId)))
    .orderBy(asc(requirements.id));

  return NextResponse.json(reqs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectId, title, description, status, priority } = body;

  if (!projectId || !title) {
    return NextResponse.json(
      { error: "projectId and title are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(requirements)
    .values({
      projectId: Number(projectId),
      title,
      description: description || null,
      status: status || "draft",
      priority: priority || "P1",
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
