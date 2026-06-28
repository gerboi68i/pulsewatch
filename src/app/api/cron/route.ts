import { NextResponse } from "next/server";
import { runDueChecks } from "@/lib/checks";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && secret.length > 0) {
    const header = request.headers.get("authorization") ?? "";
    const url = new URL(request.url);
    const provided = header.startsWith("Bearer ") ? header.slice(7) : url.searchParams.get("key");
    if (provided !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const result = await runDueChecks();
  return NextResponse.json({ ok: true, ...result, at: new Date().toISOString() });
}
