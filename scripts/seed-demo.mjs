import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
const prisma = new PrismaClient();
const EMAIL = "demo@pulsewatch.app";
function checks(monitorId, count, base, jitter, downRange) {
  const now = Date.now(); const rows = [];
  for (let i = 0; i < count; i++) {
    const checkedAt = new Date(now - i * 300000);
    const down = downRange && i >= downRange[0] && i <= downRange[1];
    const up = !down;
    rows.push({ monitorId, up, statusCode: up ? 200 : null, responseTimeMs: up ? Math.round(base + Math.random() * jitter) : null, checkedAt });
  }
  return rows;
}
const user = await prisma.user.upsert({ where: { email: EMAIL }, update: {}, create: { email: EMAIL, name: "Demo", passwordHash: await bcrypt.hash("demodemo123", 10) } });
await prisma.monitor.deleteMany({ where: { userId: user.id } });
const defs = [
  ["Marketing Site","https://stripe.com",300,90,60,null],
  ["Core API","https://api.github.com",60,140,80,null],
  ["App Dashboard","https://vercel.com",300,210,120,[3,6]],
  ["Docs","https://developer.mozilla.org",600,70,40,null]
];
for (const d of defs) {
  const m = await prisma.monitor.create({ data: { userId: user.id, name: d[0], url: d[1], intervalSeconds: d[2], isPublic: true } });
  await prisma.check.createMany({ data: checks(m.id, 48, d[3], d[4], d[5]) });
  if (d[5]) await prisma.incident.create({ data: { monitorId: m.id, startedAt: new Date(Date.now() - d[5][1]*300000), resolvedAt: new Date(Date.now() - d[5][0]*300000), cause: "HTTP 503" } });
}
const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
const token = await new SignJWT({ uid: user.id }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
console.log("TOKEN=" + token);
console.log("USER=" + user.id);
await prisma.$disconnect();
