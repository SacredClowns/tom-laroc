import AdminLogin from "@/components/AdminLogin";

export const metadata = { title: "Tom HQ — Sign in" };

export default function AdminLoginPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <AdminLogin />
    </main>
  );
}
