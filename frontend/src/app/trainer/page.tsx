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
    <DashboardLayout title="Trainer Dashboard">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
          Loading dashboard...
        </div>
      ) : !trainer ? (
        <div className="min-h-[60vh] flex items-center justify-center text-red-500">
          Failed to load trainer data
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <h1 className="text-3xl font-bold">
            Welcome,{" "}
            <span className="text-blue-600">{trainer.name}</span>
          </h1>

          <div className="border-t pt-4 space-y-4">
            {/* Name */}
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium">{trainer.name}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{trainer.email}</p>
            </div>

            {/* Role */}
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-medium">{formatRole(trainer.role)}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
