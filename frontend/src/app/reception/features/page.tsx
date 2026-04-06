"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashboardLayout from "../../components/DashboardLayout";
import Records from "../../components/reception/Records";

export default function ReceptionFeatures() {
  const [showRecords, setShowRecords] = useState(false);

  const handleShowRecords = () => {
    setShowRecords(true);
    localStorage.removeItem("receptionActiveTab");
  };

  return (
    <DashboardLayout title="Receptionist Features">
      <div className="flex flex-col items-center py-10 space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Reception Management
        </h1>

        {!showRecords ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center space-y-6 max-w-md w-full">
            <div className="p-4 bg-blue-50 rounded-full">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">Review Gym Records</h2>
              <p className="text-gray-500 mt-2">Access member lists and track daily walk-in visitors.</p>
            </div>
            <button
              onClick={handleShowRecords}
              className="w-full bg-black text-white px-8 py-4 text-xl font-bold rounded-xl shadow-lg hover:bg-gray-800 hover:scale-105 transition-all"
            >
              Show Records
            </button>
          </div>
        ) : (
          <div className="w-full max-w-5xl px-4">
            <div className="flex justify-start mb-6">
              <button
                onClick={() => setShowRecords(false)}
                className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-2"
              >
                ← Back to Features
              </button>
            </div>
            <Records />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
