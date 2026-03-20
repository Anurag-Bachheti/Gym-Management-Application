"use client";

import { useState } from "react";

export default function WalkInSection({ onBack }: any) {
    const [view, setView] = useState<"new" | "existing" | null>(null);

    return (
        <div className="space-y-4">
            <button onClick={onBack} className="text-sm underline">
                ← Back
            </button>

            {!view && (
                <div className="flex gap-4">
                    <button
                        onClick={() => setView("new")}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        New Walk-in
                    </button>

                    <button
                        onClick={() => setView("existing")}
                        className="bg-gray-700 text-white px-4 py-2 rounded"
                    >
                        Existing Walk-ins
                    </button>
                </div>
            )}

            {view === "new" && (
                <div>
                    <h2 className="font-semibold mb-2">New Walk-in</h2>
                    {/* Form: name, phone, payment */}
                </div>
            )}

            {view === "existing" && (
                <div>
                    <h2 className="font-semibold mb-2">Walk-in History</h2>
                    {/* Show attendance records with visitType = WALK_IN */}
                </div>
            )}
        </div>
    );
}