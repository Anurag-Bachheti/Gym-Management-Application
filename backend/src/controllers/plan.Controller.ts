import { Request, Response } from 'express';
import { Plan } from '../models/Plan';

// create a new plan
export const createPlan = async (req: Request, res: Response) => {
    try {
        const { name, description, duration, price, features } = req.body;

        if (!name || !duration || !price) {
            return res.status(400).json({ message: "Name, duration and price are required" });
        }

        const plan = await Plan.create({
            name,
            description,
            durationInMonths: duration,
            price,
            features,
        })
        return res.status(201).json({
            success: true, data: plan
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: "Error creating plan"
        });
    }
};

// Get all plans
export const getPlans = async (req: Request, res: Response) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: plans
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching plans"
        });
    }
}