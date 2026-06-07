"use client";

import { useState, useEffect, useRef } from "react";
import { Send, AlertCircle, CheckCircle2, X, Upload } from "lucide-react";
import axios from "axios";

type Webhook = {
  id: string;
  name: string;
};

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen && webhooks.length === 0) {
      axios
        .get("/api/webhooks")
        .then((res) => setWebhooks(res.data))
        .catch(() => console.error("Gagal memuat webhook"));
    }
  }, [isModalOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebhook || (!content && !file)) return;

    setIsSending(true);
    setNotification(null);

    const formData = new FormData();
    formData.append("webhookId", selectedWebhook);
    formData.append("content", content);
    if (file) formData.append("file", file);

    try {
      await axios.post("/api/messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotification({
        type: "success",
        message: "Pengumuman berhasil dikirim!",
      });
      setContent("");
      setFile(null);

      setTimeout(() => {
        setIsModalOpen(false);
        setNotification(null);
        window.location.reload();
      }, 1500);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Gagal mengirim pesan ke Discord.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 relative z-40">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">
        infokelas_discord
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-all shadow-sm"
      >
        <Send className="h-4 w-4" />
        Kirim Pesan
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                Kirim Pengumuman
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-5">
              {notification && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                    notification.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {notification.message}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Tujuan Channel
                </label>
                <select
                  required
                  value={selectedWebhook}
                  onChange={(e) => setSelectedWebhook(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                >
                  <option value="" disabled>
                    -- Pilih Webhook --
                  </option>
                  {webhooks.map((hook) => (
                    <option key={hook.id} value={hook.id}>
                      {hook.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Isi Pesan
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis pesanmu di sini..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Lampiran (Gambar)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all"
                >
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">
                    {file ? file.name : "Klik untuk upload gambar"}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-gray-900 disabled:opacity-50 transition-all"
                >
                  {isSending ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Kirim Pesan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
