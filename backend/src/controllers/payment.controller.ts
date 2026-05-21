import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/User";
import { Plan } from "../models/Plan";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...", {
    apiVersion: "2025-01-27.acacia" as any,
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { planId, method = "card" } = req.body;
        const user = (req as any).user;

        if (!user || user.role !== "MEMBER") {
            res.status(403).json({ message: "Only members can purchase plans." });
            return;
        }

        const plan = await Plan.findById(planId);
        if (!plan) {
            res.status(404).json({ message: "Plan not found." });
            return;
        }

        // UPI may not support subscription mode depending on region and Stripe config. 
        // We will configure one-time payment for UPI, and subscription for card if required, 
        // or just stick to one-time payment if mode is payment.
        // But since you want INR, we will conditionally set recurring only for 'card'
        
        const isUPI = method === "upi";

        const lineItem: any = {
            price_data: {
                currency: "inr",
                product_data: {
                    name: plan.name,
                    description: plan.description || "Gym Membership",
                },
                unit_amount: Math.round(plan.price * 100), // in paise
            },
            quantity: 1,
        };

        if (!isUPI) {
            lineItem.price_data.recurring = { interval: "month", interval_count: plan.durationInMonths || 1 };
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: [method],
            line_items: [lineItem],
            mode: isUPI ? "payment" : "subscription",
            success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/member?success=true&planId=${planId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/member?canceled=true`,
            customer_email: user.email,
            metadata: {
                userId: user._id.toString(),
                planId: plan._id.toString(),
            },
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error: any) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: error.message || "Failed to create checkout session" });
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionId, planId } = req.body;
        const user = (req as any).user;

        if (!user || user.role !== "MEMBER") {
            res.status(403).json({ message: "Only members can verify plans." });
            return;
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === "paid") {
            const plan = await Plan.findById(planId);
            if (!plan) {
                res.status(404).json({ message: "Plan not found." });
                return;
            }

            // Update user and member plan
            user.plan = plan._id;
            await user.save();

            // Find member profile and update it too
            const Member = require("../models/Member").default;
            const memberProfile = await Member.findOne({ user: user._id });
            if (memberProfile) {
                memberProfile.plan = plan._id;
                await memberProfile.save();
            } else {
                // If member profile doesn't exist, create one
                await Member.create({
                    user: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    plan: plan._id,
                });
            }

            res.status(200).json({ message: "Payment successful, plan updated." });
        } else {
            res.status(400).json({ message: "Payment not completed." });
        }
    } catch (error: any) {
        console.error("Stripe Verify Error:", error);
        res.status(500).json({ message: error.message || "Failed to verify payment" });
    }
};
