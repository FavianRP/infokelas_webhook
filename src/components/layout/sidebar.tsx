"use client";

import Link from "next/link";
import { Home, Link as LinkIcon, Calendar, Clock, LogOut } from "lucide-react";
import { signOut } from "next-auth/react"; // Sesuaikan jika kamu memakai Supabase Auth / library lain

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-white md:flex h-screen sticky top-0 justify-between">
      {/* Bagian Atas: Logo & Menu Navigasi */}
      <div className="flex flex-col flex-1">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-bold text-gray-900">infokelas_discord</h2>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Home className="h-5 w-5" />
            Overview
          </Link>
          <Link
            href="/dashboard/webhooks"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <LinkIcon className="h-5 w-5" />
            Webhooks
          </Link>
          <Link
            href="/dashboard/penjadwalan"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Calendar className="h-5 w-5" />
            Penjadwalan
          </Link>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Clock className="h-5 w-5" />
            Riwayat
          </Link>
        </nav>
      </div>

      {/* Bagian Bawah: Tombol Logout */}
      <div className="p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
