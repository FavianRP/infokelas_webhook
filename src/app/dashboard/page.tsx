import { prisma } from "@/lib/prisma";
import {
  CheckCircle2,
  XCircle,
  Send,
  Link as LinkIcon,
  Activity,
} from "lucide-react";

// Mencegah Next.js melakukan cache statis agar data selalu fresh tiap di-reload
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Mengambil statistik dari database
  const totalSent = await prisma.message.count({ where: { status: "sent" } });
  const totalFailed = await prisma.message.count({
    where: { status: "failed" },
  });
  const activeWebhooks = await prisma.webhook.count({
    where: { is_deleted: false },
  });

  // Mengambil 10 pesan terakhir yang sudah dikirim (atau gagal)
  const recentMessages = await prisma.message.findMany({
    where: { status: { in: ["sent", "failed"] } },
    orderBy: { sent_at: "desc" },
    take: 10,
    include: {
      webhook: true, // Ambil juga relasi data webhooknya untuk menampilkan nama channel
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-600 mt-1">
          Pantau status pengiriman notifikasi dan webhook aktif.
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-full bg-blue-50 p-3 text-blue-600">
            <LinkIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Webhook Aktif</p>
            <p className="text-2xl font-bold text-gray-900">{activeWebhooks}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-full bg-green-50 p-3 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pesan Terkirim</p>
            <p className="text-2xl font-bold text-gray-900">{totalSent}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-full bg-red-50 p-3 text-red-600">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gagal Dikirim</p>
            <p className="text-2xl font-bold text-gray-900">{totalFailed}</p>
          </div>
        </div>
      </div>

      {/* Tabel Riwayat Pesan Terbaru */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-gray-50 px-6 py-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-800">Riwayat Pesan Terbaru</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b text-gray-900">
              <tr>
                <th className="px-6 py-3 font-medium">Channel Tujuan</th>
                <th className="px-6 py-3 font-medium">Isi Pesan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Waktu Kirim</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentMessages.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Belum ada pesan yang dikirim.
                  </td>
                </tr>
              ) : (
                recentMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {msg.webhook?.name || "Webhook Terhapus"}
                    </td>
                    <td className="px-6 py-4 truncate max-w-[300px]">
                      {msg.content}
                    </td>
                    <td className="px-6 py-4">
                      {msg.status === "sent" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3 w-3" /> Sukses
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                          <XCircle className="h-3 w-3" /> Gagal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {msg.sent_at
                        ? new Date(msg.sent_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
