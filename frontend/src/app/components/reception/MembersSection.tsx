"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function MembersSection({ onBack }: any) {
    const [view, setView] = useState<"list" | "create" | "edit" | null>(null);

    // Persist view to localStorage
    useEffect(() => {
        const savedView = localStorage.getItem("membersSectionView");
        if (savedView === "list" || savedView === "create") {
            setView(savedView as any);
        } else if (savedView === "edit") {
            // Can't stay on edit without a selected member, fallback to list
            setView("list");
            localStorage.setItem("membersSectionView", "list");
        }
    }, []);

    const handleViewChange = (newView: "list" | "create" | "edit" | null) => {
        setView(newView);
        
        if (newView === "create") {
        setFormData({
            name: "",
            email: "",
            role: "MEMBER",
            phone: "",
            plan: "",
            totalAttendance: 0,
            joinedAt: ""
        });
        setEditingMemberId(null);
    }

        if (newView) {
            localStorage.setItem("membersSectionView", newView);
        } else {
            localStorage.removeItem("membersSectionView");
        }
    };

    const [members, setMembers] = useState<any[]>([]);
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

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

    const [formData, setFormData] = useState<any>({
        name: "",
        email: "",
        role: "MEMBER",
        phone: "",
        plan: "",
        totalAttendance: 0,
        joinedAt: ""
    });

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (view === "edit" && editingMemberId) {
                await api.put(`/members/${editingMemberId}`, formData);
                alert("Member updated successfully");
            } else {
                await api.post("/members", formData);
                alert("Member enrolled successfully");
            }
            handleViewChange("list");
            setEditingMemberId(null);
            setFormData({ name: "", email: "", role: "MEMBER", phone: "", plan: "", totalAttendance: 0, joinedAt: "" });
            // Refresh list
            const res = await api.get("/members");
            setMembers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Operation failed", err);
            alert("Operation failed");
        }
    };

    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        async function fetchPlans() {
            try {
                const res = await api.get("/plans");
                // The /api/plans endpoint returns { success: true, data: [...] }
                setPlans(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (err) {
                console.error("Failed to load plans")
            }
        }
        fetchPlans()
    }, [])

    return (
        <div className="space-y-4">
            <button onClick={() => {
                if (view) {
                    handleViewChange(null); // go back one step
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
                        onClick={() => handleViewChange("list")}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        List Members
                    </button>

                    <button
                        onClick={() => handleViewChange("create")}
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
                        <button onClick={() => handleViewChange(null)} className="text-xs text-gray-500 hover:underline">Close List</button>
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
                                        <div className="flex gap-4 pt-1">
                                            <p className="text-[11px] font-medium text-blue-600">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                                            <p className="text-[11px] font-medium text-green-600">Days Attended: {member.totalAttendance || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            {member.planName || (member.plan && typeof member.plan === 'object' ? member.plan.name : member.plan) || "No Plan"}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setFormData({
                                                        name: member.name,
                                                        email: member.email,
                                                        role: member.role || "MEMBER",
                                                        phone: member.phone || "",
                                                        plan: (typeof member.plan === 'object' ? member.plan._id : member.plan) || "",
                                                        totalAttendance: member.totalAttendance || 0,
                                                        joinedAt: member.joinedAt
                                                    });
                                                    setEditingMemberId(member._id);
                                                    handleViewChange("edit");
                                                }}
                                                className="text-xs px-3 py-1.5 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                disabled={member.attendanceToday}
                                                onClick={async () => {
                                                    try {
                                                        await api.post("/attendance/member", { userId: member._id });
                                                        setMembers((prev: any[]) =>
                                                            prev.map((m) =>
                                                                m._id === member._id ? { ...m, attendanceToday: true } : m
                                                            )
                                                        );
                                                    } catch (err: any) {
                                                        alert(err.response?.data?.message || "Failed to mark attendance");
                                                    }
                                                }}
                                                className={`text-xs px-3 py-1.5 rounded font-semibold shadow-sm transition-all active:scale-95 ${member.attendanceToday
                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                    : "bg-green-600 text-white hover:bg-green-700"
                                                    }`}
                                            >
                                                {member.attendanceToday ? "Present" : "Present"}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await api.post("/attendance/member/undo", { userId: member._id });
                                                        setMembers((prev: any[]) =>
                                                            prev.map((m) =>
                                                                m._id === member._id ? { ...m, attendanceToday: false } : m
                                                            )
                                                        );
                                                    } catch (err: any) {
                                                        alert(err.response?.data?.message || "Failed to mark absent");
                                                    }
                                                }}
                                                className={`text-xs px-3 py-1.5 rounded font-semibold shadow-sm transition-all active:scale-95 ${!member.attendanceToday
                                                    ? "bg-gray-100 text-gray-400 border border-gray-200"
                                                    : "bg-red-600 text-white hover:bg-red-700"
                                                    }`}
                                            >
                                                Absent
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {(view === "create" || view === "edit") && (
                <div className="max-w-md bg-white p-6 rounded shadow border">
                    <h2 className="font-semibold text-xl mb-4 text-green-700">
                        {view === "edit" ? "Edit Member" : "Enroll New Member"}
                    </h2>
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
                                    <option key={p._id} value={p._id}>
                                        {p.name || `${p.durationInMonths} Month`} - ₹{p.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {view === "edit" && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-tight mb-1">Membership Stats</label>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Days Attended:</span>
                                    <span className="text-sm font-bold text-green-600">{formData.totalAttendance || 0}</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-sm text-gray-600">Joined Date:</span>
                                    <span className="text-sm font-bold text-blue-600">{formData.joinedAt ? new Date(formData.joinedAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
                            >
                                {view === "edit" ? "Update Member" : "Enroll Member"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleViewChange(null);
                                    setEditingMemberId(null);
                                    setFormData({ name: "", email: "", role: "MEMBER", phone: "", plan: "", totalAttendance: 0, joinedAt: "" });
                                }}
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