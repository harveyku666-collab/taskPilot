import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { acceptances } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handoffId = searchParams.get("handoffId");
  const taskId = searchParams.get("taskId");

  let where = undefined;
  if (handoffId) {
    where = eq(acceptances.handoffId, Number(handoffId));
  } else if (taskId) {
    where = eq(acceptances.taskId, Number(taskId));
  }

  const records = await db
    .select()
    .from(acceptances)
    .where(where)
    .orderBy(desc(acceptances.createdAt));

  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { handoffId, taskId, decision, notes, reviewerRole } = body;

  if (!handoffId || !taskId) {
    return NextResponse.json(
      { error: "handoffId and taskId are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(acceptances)
    .values({
      handoffId: Number(handoffId),
      taskId: Number(taskId),
      decision: decision || "pending",
      notes: notes || null,
      reviewerRole: reviewerRole || null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
