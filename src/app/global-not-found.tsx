import { redirect } from "next/navigation";

export default function GlobalNotFound() {
  return redirect("/auth/login");
}
