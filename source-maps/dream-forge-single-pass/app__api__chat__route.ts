import { NextResponse } from "next/server";
import { z } from "zod";
import { previewChatPatch } from "@/lib/engine";

const ChatSchema = z.object({
  siteId: z.string().min(1),
  prompt: z.string().min(2)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ChatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid chat patch request", details: parsed.error.flatten() }, { status: 400 });
  }

  const patch = await previewChatPatch(parsed.data.prompt);
  return NextResponse.json({ patch });
}
