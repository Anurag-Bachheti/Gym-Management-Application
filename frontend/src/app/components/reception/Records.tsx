"use client";

import { useState } from "react";
import MembersSection from "./MembersSection";
import WalkInSection from "./WalkInSection";

export default function Records() {
    const [activeTab, setActiveTab] = useState<"members" | "walkins" | null>(null);

    return (
        <div className="space-y-6">
            {!activeTab && (
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab("members")}
                        className="bg-black text-white px-6 py-3 rounded"
                    >
                        Members
                    </button>

                    <button
                        onClick={() => setActiveTab("walkins")}
                        className="bg-gray-800 text-white px-6 py-3 rounded"
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