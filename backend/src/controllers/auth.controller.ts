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
