"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import PasswordInput from "../components/PasswordInput";

export default function RegisterGymPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gymName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/gyms/register", formData);
            if (res.data.success) {
                alert("Gym registered successfully! You can now login as an owner.");
                router.push("/login");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Register Your Gym</h1>
                    <p className="text-gray-600">Join our network and manage your gym with ease</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="p-8 space-y-8">
                        {/* Owner Information */}
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 border-b pb-2 mb-4">Owner Account</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="e.g. Rahul Sharma" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="owner@gym.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <PasswordInput value={formData.password} onChange={(val) => setFormData({ ...formData, password: val })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <PasswordInput value={formData.confirmPassword} onChange={(val) => setFormData({ ...formData, confirmPassword: val })} />
                                </div>
                            </div>
                        </section>

                        {/* Gym Information */}
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 border-b pb-2 mb-4">Gym Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label>
                                    <input required name="gymName" value={formData.gymName} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="e.g. Powerhouse Gym" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                        <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="+91 98765-43210" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                        <input required name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="Plot No. 123, Sector 4" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input required name="city" value={formData.city} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="Chandigarh" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input required name="state" value={formData.state} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="Punjab" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                        <input required name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="160001" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {error && <div className="mx-8 mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">{error}</div>}

                    <div className="p-8 bg-gray-50 border-t flex flex-col items-center">
                        <button disabled={loading} type="submit" className="w-full max-w-xs bg-black text-white py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all transform active:scale-95 disabled:bg-gray-400">
                            {loading ? "Registering..." : "Register My Gym"}
                        </button>
                        <p className="mt-4 text-sm text-gray-500">
                            Already have an account? <span onClick={() => router.push("/login")} className="text-black font-bold cursor-pointer hover:underline">Sign In</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
