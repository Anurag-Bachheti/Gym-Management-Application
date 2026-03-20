"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function MembersSection({ onBack }: any) {
    const [view, setView] = useState<"list" | "create" | null>(null);
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await api.get("/members");
                // The /api/members endpoint returns an array directly
                setMembers(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load members")
            }
        }
        fetchMembers()
    }, [])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "MEMBER",
        phone: "",
        plan: "",
    });

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/members", formData);
            alert("Member enrolled successfully");
            setView("list");
            // Refresh list
            const res = await api.get("/members");
            setMembers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Enrollment failed", err);
            alert("Enrollment failed");
        }
    };

    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        async function fetchPlans() {
            try {
                const res = await api.get("/plans");
                setPlans(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load plans")
            }
        }
        fetchPlans()
    }, [])

    return (
        <div className="space-y-4">
            <button onClick={onBack} className="text-sm underline text-blue-600 hover:text-blue-800">
                ← Back
            </button>

            {!view && (
                <div className="flex gap-4">
                    <button
                        onClick={() => setView("list")}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        List Members
                    </button>

                    <button
                        onClick={() => setView("create")}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Enroll New Member
                    </button>
                </div>
            )}

            {view === "list" && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-xl">Members List</h2>
                        <button onClick={() => setView(null)} className="text-xs text-gray-500 hover:underline">Close List</button>
                    </div>
                    <div className="bg-white rounded border divide-y overflow-hidden">
                        {members.length === 0 ? (
                            <p className="p-4 text-gray-500 italic">No members found</p>
                        ) : (
                            members.map((member: any) => (
                                <div key={member._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">{member.name}</p>
                                        <p className="text-sm text-gray-500 italic">{member.email}</p>
                                        <p className="text-sm text-gray-600">{member.phone}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded inline-block uppercase tracking-wider">
                                            {member.plan || "No Plan"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {view === "create" && (
                <div className="max-w-md bg-white p-6 rounded shadow border">
                    <h2 className="font-semibold text-xl mb-4 text-green-700">Enroll New Member</h2>
                    <form onSubmit={handleCreateMember} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Phone"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Membership Plan</label>
                            <select
                                required
                                value={formData.plan}
                                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select a Plan</option>
                                {plans.map((p) => (
                                    <option key={p._id} value={p.name || p._id}>
                                        {p.name || `${p.duration} Month`} - ₹{p.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
                            >
                                Enroll Member
                            </button>
                            <button
                                type="button"
                                onClick={() => setView(null)}
                                className="w-full mt-2 text-sm text-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}