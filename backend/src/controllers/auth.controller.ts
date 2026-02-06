import { Request, Response } from "express";
import * as AuthService from "../auth/auth.service";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.json({
        success: true,
        ...result,
    });
};

export const signup = async (req: Request, res: Response) => {
    const { name, email, password, plan } = req.body;

    const result = await AuthService.signup({ name, email, password, plan });

    res.status(201).json({
        success: true,
        message: "Signup successful",
        user: result,
    });
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await AuthService.getUserById(req.user._id);
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
