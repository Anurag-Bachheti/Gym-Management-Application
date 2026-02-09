"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/auth/forgot-password", { email });
            setMessage(res.data.message);

            // Redirect to reset-password after a short delay
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm border p-8 rounded-lg shadow-lg bg-white space-y-6"
            >
                <h1 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h1>
                <p className="text-sm text-gray-600 text-center">
                    Enter your email address and we'll send you an OTP to reset your password.
                </p>

                {error && (
                    <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded">{error}</p>
                )}
                {message && (
                    <p className="text-sm text-green-600 text-center bg-green-50 py-2 rounded">{message}</p>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-black outline-none transition-all"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div className="text-center">
                    <a href="/login" className="text-sm text-gray-500 hover:text-black">
                        Back to Login
                    </a>
                </div>
            </form>
        </div>
    );
}
