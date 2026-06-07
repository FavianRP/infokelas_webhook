import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function GET() {
  const now = new Date();

  // Cari pesan yang jadwalnya sudah lewat & statusnya masih pending
  const toSend = await prisma.penjadwalan.findMany({
    where: { status: "pending", sendAt: { lte: now } },
    include: { webhook: true },
  });

  for (const item of toSend) {
    try {
      await axios.post(item.webhook.url, { content: item.content });
      await prisma.penjadwalan.update({
        where: { id: item.id },
        data: { status: "sent" },
      });
    } catch (e) {
      console.error(`Gagal kirim jadwal ${item.id}`);
    }
  }

  return NextResponse.json({ processed: toSend.length });
}
