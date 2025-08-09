// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin"); 
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
        Continue as
      </h1>

      <div className="flex gap-6 flex-col md:flex-row">
        <Link
          href="/user-app/home"
          className="w-56 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition transform text-center"
        >
          🚗 User
        </Link>

        <Link
          href="/merchant-app/home"
          className="w-56 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition transform text-center"
        >
          🏢 Merchant
        </Link>
      </div>
    </div>
  );
}
