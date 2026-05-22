"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import DashboardLayout from "../components/DashboardLayout";

type Member = {
    name: string;
    email: string;
    planName?: string;
    totalAttendance?: number;
    joinedAt?: string;
    attendanceToday?: boolean;
    cancelAtPeriodEnd?: boolean;
};

function MemberDashboardInner() {
    const searchParams = useSearchParams();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [marked, setMarked] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [plans, setPlans] = useState<any[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState(false);
    const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<string | null>(null);

    useEffect(() => {
        const success = searchParams.get("success");
        const sessionId = searchParams.get("session_id");
        const planId = searchParams.get("planId");

        async function verifyAndFetchProfile() {
            if (success === "true" && sessionId && planId) {
                setSuccessMsg(true);
                try {
                    await api.post("/payment/verify", { sessionId, planId });
                    // After verifying, we want to fetch the updated profile immediately
                    const updatedProfile = await api.get("/auth/me");
                    setMember(updatedProfile.data.user);
                } catch (err) {
                    console.error("Payment verification failed", err);
                }
            } else {
                try {
                    const res = await api.get("/auth/me");
                    setMember(res.data.user);
                    if (res.data.user.attendanceToday) {
                        setMarked(true);
                        setMessage("Already checked in today! Have a great workout!");
                    }
                } catch (err) {
                    console.error("Failed to load member profile");
                }
            }
            setLoading(false);
        }
        verifyAndFetchProfile();
    }, [searchParams]);

    const fetchPlans = async () => {
        setLoadingPlans(true);
        try {
            const res = await api.get("/plans");
            let fetchedPlans = [];
            if (Array.isArray(res.data.data)) {
                fetchedPlans = res.data.data;
            } else if (Array.isArray(res.data)) {
                fetchedPlans = res.data;
            }
            setPlans(fetchedPlans);
            setIsSubscriptionModalOpen(true);
        } catch (err) {
            console.error("Failed to fetch plans", err);
            alert("Could not load plans");
        } finally {
            setLoadingPlans(false);
        }
    };

    const handleBuyNow = async (planId: string, method: string) => {
        setPurchasing(planId);
        setSelectedPlanForPayment(null); // Close the payment method modal
        try {
            const res = await api.post("/payment/create-checkout-session", { planId, method });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err: any) {
            console.error("Payment error", err);
            alert(err.response?.data?.message || "Failed to initiate payment");
        } finally {
            setPurchasing(null);
        }
    };

    const handleMarkAttendance = async () => {
        setMarking(true);
        setMessage("");
        try {
            await api.post("/attendance/member");
            setMarked(true);
            setMessage("Attendance marked successfully! Have a great workout!");
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Failed to mark attendance.");
        } finally {
            setMarking(false);
        }
    };

    function formatPlan(plan: string) {
        return plan
            .replace("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return (
        <DashboardLayout title="Member Dashboard">
            {loading ? (
                <div className="min-h-[60vh] flex items-center justify-center">
                    Loading dashboard...
                </div>
            ) : !member ? (
                <div className="min-h-[60vh] flex items-center justify-center text-red-500">
                    Failed to load member data
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-6 relative">
                    {successMsg && (
                        <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow-sm text-center font-semibold mb-4">
                            Payment Successful! Your account has been updated.
                        </div>
                    )}
                    <div className="bg-white rounded-xl shadow p-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome, <span className="text-blue-600">{member.name}</span>
                        </h1>
                        <p className="text-gray-500 mb-8">Ready for your workout today?</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Current Plan</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {member.planName || "No Active Plan"}
                                            {member.cancelAtPeriodEnd && (
                                                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase tracking-wide font-semibold align-middle">Cancels at Period End</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {member.planName && !member.cancelAtPeriodEnd && (
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm("Are you sure you want to cancel your subscription?")) {
                                                        try {
                                                            const res = await api.post("/payment/cancel-subscription");
                                                            alert(res.data.message);
                                                            // reload profile
                                                            const updatedProfile = await api.get("/auth/me");
                                                            setMember(updatedProfile.data.user);
                                                        } catch (err: any) {
                                                            alert(err.response?.data?.message || "Failed to cancel subscription.");
                                                        }
                                                    }
                                                }}
                                                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                                            >
                                                Cancel Plan
                                            </button>
                                        )}
                                        <button
                                            onClick={fetchPlans}
                                            disabled={loadingPlans}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                        >
                                            {loadingPlans ? "Loading..." : (member.planName ? "Upgrade / Downgrade Plan" : "Buy Subscription")}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Joined On</p>
                                        <p className="text-sm font-semibold text-gray-700">
                                            {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total Visits</p>
                                        <p className="text-sm font-bold text-green-600">
                                            {member.totalAttendance || 0} Days
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-xs text-gray-500">Account: <span className="font-medium text-gray-700">{member.email}</span></p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                                <h3 className="font-bold text-blue-900">Today's Check-in</h3>
                                {message && (
                                    <p className={`text-sm font-medium ${marked ? 'text-green-600' : 'text-red-500'}`}>
                                        {message}
                                    </p>
                                )}
                                <button
                                    onClick={handleMarkAttendance}
                                    disabled={marking || marked}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${marked
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                        } disabled:opacity-50`}
                                >
                                    {marking ? "Checking in..." : marked ? "✓ Checked In" : "Mark Attendance"}
                                </button>
                                {!marked && <p className="text-[10px] text-blue-400">Click to record your entry for today</p>}
                            </div>
                        </div>
                    </div>

                    {isSubscriptionModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto relative mt-20 mb-10">
                                <button
                                    onClick={() => setIsSubscriptionModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>

                                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Available Membership Plans</h2>

                                {plans.length === 0 ? (
                                    <p className="text-center text-gray-500">No plans available at the moment.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {plans.map((plan) => {
                                            const isCurrentPlan = plan.name === member.planName;
                                            return (
                                                <div key={plan._id} className={`border ${isCurrentPlan ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'} rounded-xl p-6 flex flex-col hover:shadow-xl transition-shadow bg-gray-50 relative`}>
                                                    {isCurrentPlan && (
                                                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                            Current Plan
                                                        </span>
                                                    )}
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{formatPlan(plan.name)}</h3>
                                                    <div className="mb-4">
                                                        <span className="text-3xl font-extrabold text-indigo-600">${plan.price}</span>
                                                        <span className="text-gray-500 text-sm"> / {plan.durationInMonths} month(s)</span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-6 italic">"{plan.description || "Get access to our premium facilities and workout equipment."}"</p>

                                                    {plan.features && plan.features.length > 0 && (
                                                        <ul className="mb-6 flex-grow space-y-2">
                                                            {plan.features.map((feature: string, idx: number) => (
                                                                <li key={idx} className="flex items-start text-sm text-gray-600">
                                                                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    {!plan.features || plan.features.length === 0 ? <div className="flex-grow"></div> : null}

                                                    <button
                                                        onClick={() => setSelectedPlanForPayment(plan._id)}
                                                        disabled={purchasing === plan._id || isCurrentPlan}
                                                        className={`w-full font-bold py-3 rounded-lg transition-colors disabled:opacity-50 ${isCurrentPlan ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                                    >
                                                        {purchasing === plan._id ? "Processing..." : (isCurrentPlan ? "Active" : "Buy Now")}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedPlanForPayment && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center relative">
                                <button
                                    onClick={() => setSelectedPlanForPayment(null)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                                <h3 className="text-xl font-bold mb-6 text-gray-800">Select Payment Method</h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleBuyNow(selectedPlanForPayment, "card")}
                                        className="w-full border-2 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-700 font-bold py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                        <span>Pay with Card</span>
                                    </button>
                                    <button
                                        onClick={() => handleBuyNow(selectedPlanForPayment, "upi")}
                                        className="w-full border-2 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-300 text-green-700 font-bold py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        <span>Pay with UPI</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}

export default function MemberPage() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
            <MemberDashboardInner />
        </Suspense>
    );
}
