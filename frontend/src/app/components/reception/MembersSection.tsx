"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function MembersSection({ onBack }: any) {
    const [view, setView] = useState<"list" | "create" | null>(null);
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await api.get("/users");
                // The /api/users endpoint returns an array directly
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
    });

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/users", formData);
            alert("Member enrolled successfully");
            setView("list");
            // Refresh list
            const res = await api.get("/users");
            setMembers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Enrollment failed", err);
            alert("Enrollment failed");
        }
    };

    return (
        <div className="space-y-4">
            <button onClick={onBack} className="text-sm underline">
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
                        <button onClick={() => setView(null)} className="text-xs">Close List</button>
                    </div>
                    <div className="bg-white rounded border divide-y">
                        {members.length === 0 ? (
                            <p className="p-4 text-gray-500">No members found</p>
                        ) : (
                            members.filter((u: any) => u.role === "MEMBER").map((member: any) => (
                                <div key={member._id} className="p-3">
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
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