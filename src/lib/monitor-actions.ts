"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { runCheckForMonitor } from "@/lib/checks";

export async function createMonitor(formData: FormData) {
  const uid = await getSessionUserId();
  if (!uid) return;

  const name = String(formData.get("name") ?? "").trim();
  let url = String(formData.get("url") ?? "").trim();
  const interval = Number(formData.get("interval") ?? 300);

  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    new URL(url);
  } catch {
    return;
  }

  await prisma.monitor.create({
    data: {
      userId: uid,
      name: name.length > 0 ? name : url,
      url,
      intervalSeconds: Number.isFinite(interval) ? interval : 300,
    },
  });
  revalidatePath("/dashboard");
}

export async function deleteMonitor(formData: FormData) {
  const uid = await getSessionUserId();
  if (!uid) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.monitor.deleteMany({ where: { id, userId: uid } });
  revalidatePath("/dashboard");
}

export async function checkNow(formData: FormData) {
  const uid = await getSessionUserId();
  if (!uid) return;
  const id = String(formData.get("id") ?? "");
  const monitor = await prisma.monitor.findFirst({
    where: { id, userId: uid },
    select: { id: true, url: true },
  });
  if (!monitor) return;
  await runCheckForMonitor(monitor);
  revalidatePath("/dashboard");
}

export async function checkAll() {
  const uid = await getSessionUserId();
  if (!uid) return;
  const monitors = await prisma.monitor.findMany({
    where: { userId: uid },
    select: { id: true, url: true },
  });
  for (const m of monitors) {
    await runCheckForMonitor(m);
  }
  revalidatePath("/dashboard");
}

export async function setMonitorPublic(formData: FormData) {
  const uid = await getSessionUserId();
  if (!uid) return;
  const id = String(formData.get("id") ?? "");
  const makePublic = String(formData.get("public") ?? "") === "1";
  if (!id) return;
  await prisma.monitor.updateMany({ where: { id, userId: uid }, data: { isPublic: makePublic } });
  revalidatePath("/dashboard");
}
