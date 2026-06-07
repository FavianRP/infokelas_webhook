import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Ke mana user ditendang jika belum login
  },
});

// Atur jalur mana saja yang wajib dilindungi oleh login
export const config = {
  matcher: ["/dashboard/:path*"],
};
