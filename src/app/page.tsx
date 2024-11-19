import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const credentialCookies = cookieStore.get("auth");
  if (credentialCookies) {
    redirect("/profile");
  }
  redirect("/login");
}
