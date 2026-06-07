import { redirect } from "next/navigation";

export default function Home() {
  // Otomatis melempar user dari '/' ke '/dashboard'
  redirect("/");
}
