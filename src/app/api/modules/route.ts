import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modules } from "@/db/schema";
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

  const mods = await db
    .select()
    .from(modules)
    .where(eq(modules.projectId, Number(projectId)))
    .orderBy(asc(modules.sequence), asc(modules.id));

  return NextResponse.json(mods);
}
