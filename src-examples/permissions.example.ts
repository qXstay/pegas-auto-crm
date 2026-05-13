type Role = "owner" | "admin" | "manager" | "mechanic";

type Permission =
  | "orders:read"
  | "orders:write"
  | "shifts:manage"
  | "payroll:read"
  | "settings:write";

type User = {
  id: string;
  role: Role;
  branchIds: string[];
};

type Resource = {
  branchId: string;
};

const permissionsByRole: Record<Role, Permission[]> = {
  owner: ["orders:read", "orders:write", "shifts:manage", "payroll:read", "settings:write"],
  admin: ["orders:read", "orders:write", "shifts:manage", "payroll:read"],
  manager: ["orders:read", "orders:write", "shifts:manage"],
  mechanic: ["orders:read"],
};

export function canAccessBranch(user: User, branchId: string): boolean {
  return user.role === "owner" || user.branchIds.includes(branchId);
}

export function canPerform(
  user: User,
  permission: Permission,
  resource: Resource,
): boolean {
  const hasRolePermission = permissionsByRole[user.role].includes(permission);

  return hasRolePermission && canAccessBranch(user, resource.branchId);
}

export function assertCanPerform(
  user: User,
  permission: Permission,
  resource: Resource,
): void {
  if (!canPerform(user, permission, resource)) {
    throw new Error("Access denied");
  }
}

export const exampleUser: User = {
  id: "employee-1",
  role: "manager",
  branchIds: ["branch-1"],
};
