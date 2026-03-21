"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashboardLayout from "../components/DashboardLayout";

type Member = {
    name: string;
    email: string;
    planName?: string;
    totalAttendance?: number;
    joinedAt?: string;
    attendanceToday?: boolean;
};

export default function MemberDashboard() {
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [marked, setMarked] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get("/auth/me");
                setMember(res.data.user);
                if (res.data.user.attendanceToday) {
                    setMarked(true);
                    setMessage("Already checked in today! Have a great workout!");
                }
            } catch (err) {
                console.error("Failed to load member profile");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleMarkAttendance = async () => {
        setMarking(true);
        setMessage("");
        try {
            await api.post("/attendance/member");
            setMarked(true);
            setMessage("Attendance marked successfully! Have a great workout!");
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Failed to mark attendance.");
        } finally {
            setMarking(false);
        }
    };

    function formatPlan(plan: string) {
        return plan
            .replace("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return (
        <DashboardLayout title="Member Dashboard">
            {loading ? (
                <div className="min-h-[60vh] flex items-center justify-center">
                    Loading dashboard...
                </div>
            ) : !member ? (
                <div className="min-h-[60vh] flex items-center justify-center text-red-500">
                    Failed to load member data
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white rounded-xl shadow p-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome, <span className="text-blue-600">{member.name}</span>
                        </h1>
                        <p className="text-gray-500 mb-8">Ready for your workout today?</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Current Plan</p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {member.planName || "No Active Plan"}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Joined On</p>
                                        <p className="text-sm font-semibold text-gray-700">
                                            {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total Visits</p>
                                        <p className="text-sm font-bold text-green-600">
                                            {member.totalAttendance || 0} Days
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-xs text-gray-500">Account: <span className="font-medium text-gray-700">{member.email}</span></p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                                <h3 className="font-bold text-blue-900">Today's Check-in</h3>
                                {message && (
                                    <p className={`text-sm font-medium ${marked ? 'text-green-600' : 'text-red-500'}`}>
                                        {message}
                                    </p>
                                )}
                                <button
                                    onClick={handleMarkAttendance}
                                    disabled={marking || marked}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${marked
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                        } disabled:opacity-50`}
                                >
                                    {marking ? "Checking in..." : marked ? "✓ Checked In" : "Mark Attendance"}
                                </button>
                                {!marked && <p className="text-[10px] text-blue-400">Click to record your entry for today</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
