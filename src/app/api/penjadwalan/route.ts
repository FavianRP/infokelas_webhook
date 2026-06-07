import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { webhookId, content, sendAt } = await req.json();

    const newJadwal = await prisma.penjadwalan.create({
      data: {
        webhookId,
        content,
        sendAt: new Date(sendAt),
        status: "pending",
      },
    });

    return NextResponse.json(newJadwal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan jadwal" },
      { status: 500 },
    );
  }
}
