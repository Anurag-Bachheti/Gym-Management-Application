export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }
    next();
  };
};

export const isReceptionist = (req: any, res: any, next: any) => {
  if (!["RECEPTIONIST", "SUPER_ADMIN", "GYM_MANAGER"].includes(req.user?.role)) {
    return res.status(403).json({
      message: "Access denied",
    });
  }
  next();
};