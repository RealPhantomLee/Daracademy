import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { redirect } from "next/navigation";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if ((session.user as { role?: string }).role !== "ADMIN") {
    redirect("/auth/error?error=AccessDenied");
  }

  return session;
}
