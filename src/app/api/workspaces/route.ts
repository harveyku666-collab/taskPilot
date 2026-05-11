import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get("taskId");

  const where = taskId ? eq(workspaces.taskId, Number(taskId)) : undefined;

  const records = await db
    .select()
    .from(workspaces)
    .where(where ? where : undefined)
    .orderBy(desc(workspaces.createdAt));

  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { taskId, branchName, worktreePath, baseBranch, status } = body;

  if (!taskId || !branchName || !worktreePath) {
    return NextResponse.json(
      { error: "taskId, branchName, and worktreePath are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(workspaces)
    .values({
      taskId: Number(taskId),
      branchName,
      worktreePath,
      baseBranch: baseBranch || "main",
      status: status || "created",
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
