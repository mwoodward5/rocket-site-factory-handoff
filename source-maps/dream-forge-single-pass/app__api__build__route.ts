import { NextResponse } from "next/server";
import { z } from "zod";
import { enqueueMockBuild } from "@/lib/engine";

const IntakeSchema = z.object({
  name: z.string().min(2),
  industry: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional(),
  existingSiteUrl: z.string().url().optional(),
  gbpUrl: z.string().url().optional(),
  primaryKeyword: z.string().min(3),
  tier: z.enum(["starter", "premier", "domination"]).default("starter"),
  templateId: z.string().optional()
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = IntakeSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid intake", details: parsed.error.flatten() }, { status: 400 });
  }

  const job = await enqueueMockBuild({
    id: `biz-${crypto.randomUUID().slice(0, 8)}`,
    ...parsed.data
  });

  return NextResponse.json({ job }, { status: 201 });
}
