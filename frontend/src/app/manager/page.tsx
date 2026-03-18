"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashboardLayout from "../components/DashboardLayout";

type Manager = {
  name: string;
  email: string;
  role: string;
}

export default function ManagerDashboard() {

  const [manager, setManager] = useState<Manager | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/auth/me");
        setManager(res.data.user);
      } catch (err) {
        console.error("Failed to load manager profile");
      } finally {
        setLoading(false);
      }

    }
    fetchProfile();
  }, []);

  function formatPlan(plan: string) {
    return plan
      .replace("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <DashboardLayout title="Manager Dashboard">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          Loading dashboard...
        </div>
      ) : !manager ? (
        <div className="min-h-[60vh] flex items-center justify-center text-red-500">
          Failed to load manager data
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <h1 className="text-3xl font-bold">
            Welcome, <span className="text-blue-600">{manager.name}</span>
          </h1>
          <div className="border-t pt-4 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{manager.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-medium">Manager</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
