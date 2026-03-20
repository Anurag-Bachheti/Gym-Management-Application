"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function WalkInSection({ onBack }: any) {
    const [view, setView] = useState<"new" | "existing" | null>(null);
    const [loading, setLoading] = useState(false);
    const [walkins, setWalkins] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        amount: "",
    });

    const handleCreateWalkIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post("/attendance/walkin", {
                ...formData,
                amount: Number(formData.amount)
            });
            if (res.data.success) {
                alert("Walk-in created successfully");
                setFormData({ name: "", phone: "", amount: "" });
                setView("existing");
            }
        } catch (err) {
            console.error("Failed to create walk-in", err);
            alert("Failed to create walk-in");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === "existing") {
            const fetchWalkins = async () => {
                try {
                    setLoading(true);
                    const res = await api.get("/attendance/walkin");
                    if (res.data.success) {
                        setWalkins(res.data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch walk-ins", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchWalkins();
        }
    }, [view]);

    return (
        <div className="space-y-4">
            <button onClick={() => {
                if (view) {
                    setView(null); // go back one step
                } else {
                    onBack(); // go to parent
                }
            }}
                className="text-sm underline text-blue-600 hover:text-blue-800">
                ← Back
            </button>

            {!view && (
                <div className="flex gap-4">
                    <button
                        onClick={() => setView("existing")}
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-gray-800 transition-all"
                    >
                        List of Walk-ins
                    </button>
                    <button
                        onClick={() => setView("new")}
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-gray-800 transition-all"
                    >
                        Walk-in Signup
                    </button>
                </div>
            )}

            {view === "new" && (
                <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Walk-In User</h2>
                    <form onSubmit={handleCreateWalkIn} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                required
                                type="tel"
                                maxLength={10}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                                placeholder="10-digit number"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Payment Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400">₹</span>
                                <input
                                    required
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full border rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-black outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-lg font-bold shadow-md hover:bg-gray-800 disabled:bg-gray-400 transition-all mt-4"
                        >
                            {loading ? "Processing..." : "Complete Check-in"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setView(null)}
                            className="w-full text-sm text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {view === "existing" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Walk-in History</h2>
                        <button onClick={() => setView(null)} className="text-sm text-gray-500 border px-2 py-1 rounded">Close</button>
                    </div>

                    {loading ? (
                        <p className="text-gray-500 italic">Loading records...</p>
                    ) : walkins.length === 0 ? (
                        <p className="text-gray-500 py-4 text-center border rounded-lg bg-gray-50">No walk-in records found today.</p>
                    ) : (
                        <div className="grid gap-3">
                            {walkins.map((entry) => (
                                <div key={entry._id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-900">{entry.name}</p>
                                        <p className="text-sm text-gray-500">{entry.phone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-600 font-bold">₹{entry.amount}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                            {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}