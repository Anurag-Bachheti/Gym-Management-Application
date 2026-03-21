"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashboardLayout from "../components/DashboardLayout";

export default function OwnerDashboard() {
    const [gym, setGym] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGym() {
            try {
                const res = await api.get("/gyms/my-gym");
                if (res.data.success) {
                    setGym(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load gym data");
            } finally {
                setLoading(false);
            }
        }
        fetchGym();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

    if (!gym) return <div className="p-10 text-center text-red-500">Gym not found. Please contact support.</div>;

    return (
        <DashboardLayout title="Owner Dashboard">
            <div className="max-w-5xl mx-auto space-y-8 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">{gym.name}</h1>
                        <p className="text-blue-100 flex items-center gap-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                Registered Since {new Date(gym.createdAt).getFullYear()}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-green-100 p-4 rounded-xl text-green-600 text-2xl font-bold">₹</div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Revenue Today</p>
                            <p className="text-2xl font-black text-gray-900">COMING SOON</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-xl text-blue-600 text-2xl font-bold">👥</div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Staff</p>
                            <p className="text-2xl font-black text-gray-900">{gym.totalStaff || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-xl text-blue-600 text-2xl font-bold">👥</div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Members</p>
                            <p className="text-2xl font-black text-gray-900">{gym.totalMembers || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-purple-100 p-4 rounded-xl text-purple-600 text-2xl font-bold">🏋️</div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Equipment Items</p>
                            <p className="text-2xl font-black text-gray-900">{gym.totalEquipment || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Gym Info Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Gym Information</h2>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Edit Details</button>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Address</p>
                            <p className="text-gray-700 font-medium leading-relaxed">
                                {gym.address}<br />
                                {gym.city}, {gym.state} - {gym.zipCode}<br />
                                {gym.country}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Contact Info</p>
                            <div className="space-y-1">
                                <p className="text-gray-700 font-semibold">{gym.phone}</p>
                                <p className="text-gray-500 italic text-sm">{gym.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
