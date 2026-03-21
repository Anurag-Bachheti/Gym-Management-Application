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
  const [showRecords, setShowRecords] = useState(false);

  useEffect(() => {
    const savedShow = localStorage.getItem("receptionShowRecords") === "true";
    if (savedShow) setShowRecords(true);

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

  const handleShowRecords = () => {
    setShowRecords(true);
    localStorage.setItem("receptionShowRecords", "true");
  };

  function formatRole(role: string) {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <DashboardLayout title="Receptionist Dashboard">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
          Loading dashboard...
        </div>
      ) : !receptionist ? (
        <div className="min-h-[60vh] flex items-center justify-center text-red-500">
          Failed to load receptionist data
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <h1 className="text-3xl font-bold">
            Welcome,{" "}
            <span className="text-blue-600">{receptionist.name}</span>
          </h1>

          <div className="border-t pt-4 space-y-4">
            {/* Name */}
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium">{receptionist.name}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{receptionist.email}</p>
            </div>

            {/* Role */}
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-medium">{formatRole(receptionist.role)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center py-4 space-y-4">
        {!showRecords ? (
          <button
            onClick={handleShowRecords}
            className="bg-black text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors"
          >
            Show Records
          </button>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex justify-center">
               <button
                disabled
                className="bg-gray-400 text-white px-8 py-3 text-lg font-semibold rounded-lg cursor-default"
              >
                Show Records
              </button>
            </div>
            <div className="p-6 border-t">
              <Records />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
