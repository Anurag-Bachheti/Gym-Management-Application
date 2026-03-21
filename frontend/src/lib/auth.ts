export type Role =
  | "ADMIN"
  | "SUPER_ADMIN"
  | "MANAGER"
  | "TRAINER"
  | "RECEPTIONIST"
  | "GYM_OWNER"
  | "MEMBER";

export function getDashboardRoute(role: string) {
  const normalizedRole = role.toUpperCase();

  switch (normalizedRole) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin";

    case "MANAGER":
    case "GYM_MANAGER":
      return "/manager";

    case "GYM_ADMIN":
      return "/gym-admin";

    case "TRAINER":
      return "/trainer";

    case "RECEPTIONIST":
      return "/reception";

    case "GYM_OWNER":
      return "/owner";

    case "MEMBER":
      return "/member";

    default:
      return "/login";
  }
}
