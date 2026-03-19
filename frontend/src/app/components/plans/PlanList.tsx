"use client";

import { useEffect, useState } from "react";
import { getPlans } from "@/services/plan.service";

export const PlanList = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
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

    useEffect(() => {
        fetchPlans();
    }, []);

    if (loading) return <div className="text-center py-10">Loading plans...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-500">No plans found. Create one!</div>
            ) : (
                plans.map((plan: any) => (
                    <div key={plan._id} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="text-sm text-gray-500">{plan.durationInMonths} Months</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-blue-600">₹{plan.price}</span>
                            </div>
                        </div>
                        
                        {plan.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {plan.description}
                            </p>
                        )}

                        {plan.features && plan.features.length > 0 && (
                            <div className="mt-auto pt-4 border-t">
                                <ul className="space-y-2">
                                    {plan.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="mt-4 flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {plan.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}