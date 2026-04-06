"use client"

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashboardLayout from "../components/DashboardLayout";

type Trainer = {
  name: string;
  email: string;
  role: string;
}

export default function TrainerDashboard() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/auth/me");
        setTrainer(res.data.user);
      } catch (err) {
        console.error("Failed to load trainer profile");
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
    <DashboardLayout title="Trainer Profile">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
          Loading profile...
        </div>
      ) : !trainer ? (
        <div className="min-h-[60vh] flex items-center justify-center text-red-500">
          Failed to load profile data
        </div>
      ) : (
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            <div className="bg-emerald-600 text-white p-10 md:w-1/3 flex flex-col items-center justify-center text-center">
               <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-5xl font-black mb-6 shadow-xl border-4 border-white/30">
                  {trainer.name[0]}
               </div>
               <h2 className="text-2xl font-bold tracking-tight">{formatRole(trainer.role)}</h2>
            </div>
            
            <div className="p-12 md:w-2/3 space-y-10">
              <div>
                <h1 className="text-5xl font-black text-gray-900 mb-2">
                  Welcome,{" "}
                  <span className="text-emerald-600">{trainer.name}</span>
                </h1>
                <p className="text-lg text-gray-500 font-medium tracking-tight">Fitness Specialist Dashboard</p>
              </div>

              <div className="grid grid-cols-1 md:gap-x-12 gap-y-8 pt-10 border-t border-gray-100">
                {/* Name */}
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Full Name</p>
                  <p className="text-2xl font-semibold text-gray-800">{trainer.name}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Email Address</p>
                  <p className="text-2xl font-semibold text-gray-800">{trainer.email}</p>
                </div>

                {/* Role */}
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Specialization</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatRole(trainer.role)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
