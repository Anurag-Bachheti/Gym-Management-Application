"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import PasswordInput from "../components/PasswordInput";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";

    const [formData, setFormData] = useState({
        email: initialEmail,
        otp: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/auth/reset-password", {
                email: formData.email,
                otp: formData.otp,
                password: formData.password,
            });
            setMessage(res.data.message);

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Reset failed. Please check OTP and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md border p-8 rounded-lg shadow-lg bg-white space-y-5"
            >
                <h1 className="text-2xl font-bold text-center text-gray-800">Set New Password</h1>
                <p className="text-sm text-gray-600 text-center">
                    Enter the 6-digit OTP sent to {formData.email} and your new password.
                </p>

                {error && (
                    <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded">{error}</p>
                )}
                {message && (
                    <p className="text-sm text-green-600 text-center bg-green-50 py-2 rounded">{message}</p>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                    <input
                        name="otp"
                        type="text"
                        maxLength={6}
                        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-black outline-none font-mono text-center text-lg tracking-widest"
                        placeholder="000000"
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        required
                    />
                </div>

                {/* New Password */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <PasswordInput
                        value={formData.password}
                        onChange={(value) =>
                            setFormData({ ...formData, password: value })
                        }
                    />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <PasswordInput
                        value={formData.confirmPassword}
                        onChange={(value) =>
                            setFormData({ ...formData, confirmPassword: value })
                        }
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2"
                >
                    {loading ? "Resetting Password..." : "Submit New Password"}
                </button>

                <div className="text-center pt-2">
                    <a href="/login" className="text-xs text-gray-400 hover:text-black">
                        Back to Login
                    </a>
                </div>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
