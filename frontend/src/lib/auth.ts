export type Role =
  | "ADMIN"
  | "SUPER_ADMIN"
  | "MANAGER"
  | "TRAINER"
  | "RECEPTIONIST"
  | "MEMBER";

export function getDashboardRoute(role: string) {
  const normalizedRole = role.toUpperCase();

  switch (normalizedRole) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin";

    case "MANAGER":
      return "/manager";

    case "TRAINER":
      return "/trainer";

    case "RECEPTIONIST":
      return "/receptionist";

    case "MEMBER":
      return "/member";

    default:
      return "/login";
  }
}
