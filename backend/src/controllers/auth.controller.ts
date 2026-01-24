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
