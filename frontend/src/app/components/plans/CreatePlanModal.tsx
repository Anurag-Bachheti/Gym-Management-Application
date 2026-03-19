"use client";

import { useState } from "react";
import { createPlan } from "@/services/plan.service";

export const CreatePlanModal = ({ onClose, onSuccess }: any) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        duration: "",
        price: "",
        features: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await createPlan({
                name: form.name,
                description: form.description,
                duration: Number(form.duration),
                price: Number(form.price),
                features: form.features.split(',').map(f => f.trim()).filter(f => f !== ""),
            });
            if (res.success) {
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create plan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Create New Plan</h2>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Plan Name</label>
                            <input
                                placeholder="E.g. Monthly Premium"
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.name}
                                required
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                placeholder="Short description of the plan"
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-20"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Duration (Months)</label>
                                <input
                                    type="number"
                                    placeholder="1"
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={form.duration}
                                    required
                                    onChange={(e) =>
                                        setForm({ ...form, duration: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input
                                    type="number"
                                    placeholder="999"
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={form.price}
                                    required
                                    onChange={(e) =>
                                        setForm({ ...form, price: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                            <input
                                placeholder="Free WiFi, Yoga Class, etc."
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.features}
                                onChange={(e) =>
                                    setForm({ ...form, features: e.target.value })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Plan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
