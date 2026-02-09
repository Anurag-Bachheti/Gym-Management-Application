import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

export const protect = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.userId);

    if (!user || user.isActive === false) {
        return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
};
