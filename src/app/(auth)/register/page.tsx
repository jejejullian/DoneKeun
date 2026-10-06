import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/todos");
  }

  return <RegisterForm />;
}
