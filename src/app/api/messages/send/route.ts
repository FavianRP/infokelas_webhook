import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const webhookId = formData.get("webhookId") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });
    if (!webhook)
      return NextResponse.json(
        { error: "Webhook tidak ditemukan" },
        { status: 404 },
      );

    const message = await prisma.message.create({
      data: {
        userId: webhook.userId,
        webhookId: webhook.id,
        content: content,
        status: "sending",
      },
    });

    // Kirim ke Discord menggunakan FormData agar file terunggah
    const discordPayload = new FormData();
    discordPayload.append("content", content);
    if (file) {
      discordPayload.append("file", file);
    }

    try {
      await axios.post(webhook.url, discordPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await prisma.message.update({
        where: { id: message.id },
        data: { status: "sent", sent_at: new Date() },
      });
      return NextResponse.json({ success: true });
    } catch (err) {
      await prisma.message.update({
        where: { id: message.id },
        data: { status: "failed" },
      });
      return NextResponse.json(
        { error: "Gagal kirim ke Discord" },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Error server" }, { status: 500 });
  }
}
