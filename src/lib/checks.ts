import { prisma } from "@/lib/db";

const TIMEOUT_MS = 10_000;

export type CheckResult = {
  up: boolean;
  statusCode: number | null;
  responseTimeMs: number;
};

export async function runCheckForMonitor(monitor: { id: string; url: string }): Promise<CheckResult> {
  const start = Date.now();
  let up = false;
  let statusCode: number | null = null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(monitor.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "PulseWatch/1.0 (+https://pulsewatch.app)" },
    });
    clearTimeout(timer);
    statusCode = res.status;
    up = res.status >= 200 && res.status < 400;
  } catch {
    up = false;
  }

  const responseTimeMs = Date.now() - start;

  await prisma.check.create({
    data: { monitorId: monitor.id, up, statusCode, responseTimeMs },
  });

  const openIncident = await prisma.incident.findFirst({
    where: { monitorId: monitor.id, resolvedAt: null },
    orderBy: { startedAt: "desc" },
  });

  if (!up && !openIncident) {
    await prisma.incident.create({
      data: {
        monitorId: monitor.id,
        cause: statusCode ? "HTTP " + statusCode : "Request failed or timed out",
      },
    });
  } else if (up && openIncident) {
    await prisma.incident.update({
      where: { id: openIncident.id },
      data: { resolvedAt: new Date() },
    });
  }

  return { up, statusCode, responseTimeMs };
}

export async function runDueChecks(): Promise<{ checked: number; total: number }> {
  const monitors = await prisma.monitor.findMany({
    include: { checks: { orderBy: { checkedAt: "desc" }, take: 1 } },
  });
  const now = Date.now();
  const due = monitors.filter((m) => {
    const last = m.checks[0];
    return !last || now - last.checkedAt.getTime() >= m.intervalSeconds * 1000;
  });
  for (const m of due) {
    await runCheckForMonitor(m);
  }
  return { checked: due.length, total: monitors.length };
}
