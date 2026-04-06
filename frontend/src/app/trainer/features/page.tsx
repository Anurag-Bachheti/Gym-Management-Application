"use client";

import DashboardLayout from "../../components/DashboardLayout";

export default function TrainerFeatures() {
  return (
    <DashboardLayout title="Trainer Features">
       <div className="flex flex-col items-center py-20 space-y-12">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
          Trainer Specialization Console
        </h1>
        
        <div className="bg-white p-12 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col items-center space-y-8 max-w-2xl w-full text-center">
            <div className="p-6 bg-emerald-50 rounded-full animate-pulse">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M6 8H5a4 4 0 0 0 0 8h1" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
               <h2 className="text-3xl font-extrabold text-gray-800">Coming Soon</h2>
               <p className="text-xl text-gray-500 mt-4 leading-relaxed">We are building advanced workout tracking and member performance metrics for our specialized trainers.</p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-emerald-500 rounded-full"></div>
            </div>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Construction in progress • 65% Complete</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
