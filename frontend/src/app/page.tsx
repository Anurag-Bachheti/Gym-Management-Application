import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-bold">Gym Management System</h1>
            <p className="text-gray-600">Manage your gym smartly</p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="px-6 py-3 bg-black text-white rounded-lg font-semibold text-center hover:bg-gray-800 transition-all shadow-md">
                    User / Owner / Admin Login
                </Link>
                <Link href="/signup" className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-50 transition-all">
                    I am a Member (Join Gym)
                </Link>
                <Link href="/register-gym" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition-all shadow-md">
                    Register My Gym (Owner)
                </Link>
            </div>
        </main>
    );
}
