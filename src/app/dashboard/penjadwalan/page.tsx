"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, X } from "lucide-react";
import axios from "axios";

export default function PenjadwalanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webhooks, setWebhooks] = useState<{ id: string; name: string }[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSave = async () => {
    try {
      await axios.post("/api/penjadwalan", {
        webhookId: selectedWebhook,
        content: content,
        sendAt: `${date}T${time}:00Z`, // Format ISO untuk database
      });
      alert("Jadwal berhasil disimpan!");
      setIsModalOpen(false);
    } catch (error) {
      alert("Gagal menyimpan jadwal");
    }
  };
  // Ambil data webhook agar bisa dipilih di dropdown
  useEffect(() => {
    if (isModalOpen) {
      axios.get("/api/webhooks").then((res) => setWebhooks(res.data));
    }
  }, [isModalOpen]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Penjadwalan</h2>
          <p className="text-sm text-gray-600 mt-1">
            Kelola pengingat otomatis untuk tugas dan UTS.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Buat Penjadwalan Baru
        </button>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-sm font-medium text-gray-900">Belum ada jadwal</h3>
        <p className="text-xs text-gray-500 mt-1">
          Klik "Buat Penjadwalan Baru" untuk mulai menambahkan reminder.
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Atur Penjadwalan Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-900">
                  Tujuan Channel
                </label>
                <select
                  value={selectedWebhook}
                  onChange={(e) => setSelectedWebhook(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-700 cursor-pointer"
                >
                  <option value="">-- Pilih Webhook Tujuan --</option>
                  {webhooks.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">
                    Waktu
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-900">
                  Pesan Reminder
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-700"
                  placeholder="Contoh: Jangan lupa deadline tugas Web Prog!"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 cursor-pointer hover:text-black"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-800"
              >
                Simpan Penjadwalan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
