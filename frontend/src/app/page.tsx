import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-bold">Gym Management System</h1>
            <p className="text-gray-600">Manage your gym smartly</p>

            <div className="flex gap-4">
                <Link href="/login" className="px-4 py-2 bg-black text-white rounded">
                    Login
                </Link>
                <Link href="/signup" className="px-4 py-2 border rounded">
                    Sign Up
                </Link>
            </div>
        </main>
    );
}
