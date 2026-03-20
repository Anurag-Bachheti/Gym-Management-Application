"use client";

import { useEffect, useState } from "react";
import { deletePlan, getPlans } from "@/services/plan.service";

export const PlanList = ({ refresh, onEdit }: any) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await getPlans();
            if (res.success) {
                setPlans(res.data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await deletePlan(deleteId);
            if (res.success) {
                setToast("Plan deleted successfully");
                setDeleteId(null);
                fetchPlans();
                setTimeout(() => setToast(null), 3000);
            }
        } catch (error) {
            console.error("Delete failed:", error);
            setToast("Failed to delete plan");
            setDeleteId(null);
            setTimeout(() => setToast(null), 3000);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [refresh]);

    if (loading) return <div className="text-center py-10 text-gray-400">Loading plans...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {/* Custom Toast Message */}
            {toast && (
                <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl z-[60] animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center gap-3 border border-gray-700">
                    <div className={`w-2 h-2 rounded-full ${toast.includes("failed") ? "bg-red-500" : "bg-green-500"}`}></div>
                    <span className="font-medium text-sm">{toast}</span>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70] animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to delete this plan? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {plans.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed text-gray-400">
                    <p className="text-lg font-medium">No plans found. Create one to get started!</p>
                </div>
            ) : (
                plans.map((plan: any) => (
                    <div key={plan._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{plan.name}</h3>
                                <p className="text-sm text-gray-500 font-medium">{plan.durationInMonths} Months</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-blue-600">₹{plan.price}</span>
                            </div>
                        </div>
                        
                        {plan.description && (
                            <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2 italic">
                                "{plan.description}"
                            </p>
                        )}

                        {plan.features && plan.features.length > 0 && (
                            <div className="mt-auto pt-5 border-t border-gray-50">
                                <ul className="space-y-3">
                                    {plan.features.slice(0, 3).map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center text-xs font-medium text-gray-500">
                                            <div className="w-4 h-4 rounded-full bg-green-50 text-green-500 flex items-center justify-center mr-2">
                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                    {plan.features.length > 3 && (
                                        <li className="text-[10px] text-blue-500 font-bold uppercase ml-6">+{plan.features.length - 3} More Features</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        
                        <div className="mt-6 flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {plan.isActive ? 'Active' : 'Inactive'}
                            </span>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => onEdit(plan)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    title="Edit Plan"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => setDeleteId(plan._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete Plan"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}