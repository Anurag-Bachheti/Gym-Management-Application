"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashboardLayout from "../components/DashboardLayout";
import Records from "../components/reception/Records";

type Receptionist = {
  name: string;
  email: string;
  role: string;
};

export default function ReceptionDashboard() {
  const [receptionist, setReceptionist] = useState<Receptionist | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/auth/me");
        setReceptionist(res.data.user);
      } catch (err) {
        console.error("Failed to load receptionist profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function formatRole(role: string) {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <DashboardLayout title="Receptionist Profile">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
          Loading profile...
        </div>
      ) : !receptionist ? (
        <div className="min-h-[60vh] flex items-center justify-center text-red-500">
          Failed to load profile data
        </div>
      ) : (
        <div className="max-w-3xl mx-auto py-10 px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            <div className="bg-blue-600 text-white p-8 md:w-1/3 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-extrabold mb-4 shadow-lg">
                  {receptionist.name[0]}
               </div>
               <h2 className="text-xl font-bold">{formatRole(receptionist.role)}</h2>
            </div>
            
            <div className="p-10 md:w-2/3 space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome,{" "}
                  <span className="text-blue-600">{receptionist.name}</span>
                </h1>
                <p className="text-gray-500">Logged in as Receptionist</p>
              </div>

              <div className="grid grid-cols-1 md:gap-x-12 gap-y-6 pt-6 border-t border-gray-100">
                {/* Name */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-xl font-medium text-gray-800">{receptionist.name}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-xl font-medium text-gray-800">{receptionist.email}</p>
                </div>

                {/* Role */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Official Role</p>
                  <p className="text-xl font-medium text-blue-600">{formatRole(receptionist.role)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
