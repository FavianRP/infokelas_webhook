import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Mengambil daftar webhook
export async function GET() {
  try {
    // Untuk saat ini, kita ambil semua webhook yang tidak dihapus
    const webhooks = await prisma.webhook.findMany({
      where: { is_deleted: false },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(webhooks);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

// POST: Menambah webhook baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, url } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Nama dan URL wajib diisi" },
        { status: 400 },
      );
    }

    // Ambil user pertama di database sebagai pemilik webhook ini (karena ini untuk pemakaian pribadi)
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const newWebhook = await prisma.webhook.create({
      data: {
        userId: user.id,
        name,
        url,
      },
    });

    return NextResponse.json(newWebhook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan webhook" },
      { status: 500 },
    );
  }
}
