import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { handoffs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get("taskId");

  const where = taskId ? eq(handoffs.taskId, Number(taskId)) : undefined;

  const records = await db
    .select()
    .from(handoffs)
    .where(where ? where : undefined)
    .orderBy(desc(handoffs.createdAt));

  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { taskId, fromRole, toRole, summary, status } = body;

  if (!taskId || !fromRole || !toRole || !summary) {
    return NextResponse.json(
      { error: "taskId, fromRole, toRole, and summary are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(handoffs)
    .values({
      taskId: Number(taskId),
      fromRole,
      toRole,
      summary,
      status: status || "pending",
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
