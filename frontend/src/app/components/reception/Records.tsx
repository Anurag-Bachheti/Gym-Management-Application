"use client";

import { useState } from "react";
import MembersSection from "./MembersSection";
import WalkInSection from "./WalkInSection";

export default function Records() {
    const [activeTab, setActiveTab] = useState<"members" | "walkins" | null>(null);

    return (
        <div className="space-y-6">
            {!activeTab && (
                <div className="flex flex-col items-center py-4 gap-4">
                    <button
                        onClick={() => setActiveTab("members")}
                        className="bg-black text-white px-10 py-5 text-xl font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all w-full max-w-xs"
                    >
                        Members
                    </button>

                    <button
                        onClick={() => setActiveTab("walkins")}
                        className="bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all w-full max-w-xs"
                    >
                        Walk-ins
                    </button>
                </div>
            )}

            {activeTab === "members" && (
                <MembersSection onBack={() => setActiveTab(null)} />
            )}

            {activeTab === "walkins" && (
                <WalkInSection onBack={() => setActiveTab(null)} />
            )}
        </div>
    );
}