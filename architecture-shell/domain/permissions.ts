/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

// Role/permission system - система ролей и разрешений

export type Role = "owner" | "admin" | "manager" | "mechanic";

export type PermissionGroup =
  | "orders"
  | "shifts"
  | "clients"
  | "services"
  | "settings"
  | "analytics"
  | "booking"
  | "storage"
  | "payroll";

export type PermissionAction = "read" | "create" | "update" | "delete" | "manage";

export interface Permission {
  group: PermissionGroup;
  action: PermissionAction;
}

export interface UserSession {
  userId: string;
  employeeId: string;
  roleId: Role;
  currentBranchId: string;
  accessibleBranchIds: string[];
}

// Разрешения по ролям
export const permissionsByRole: Record<Role, Permission[]> = {
  owner: [
    { group: "orders", action: "manage" },
    { group: "shifts", action: "manage" },
    { group: "clients", action: "manage" },
    { group: "services", action: "manage" },
    { group: "settings", action: "manage" },
    { group: "analytics", action: "read" },
    { group: "booking", action: "manage" },
    { group: "storage", action: "manage" },
    { group: "payroll", action: "manage" },
  ],
  admin: [
    { group: "orders", action: "manage" },
    { group: "shifts", action: "manage" },
    { group: "clients", action: "manage" },
    { group: "services", action: "manage" },
    { group: "settings", action: "manage" },
    { group: "analytics", action: "read" },
    { group: "booking", action: "manage" },
    { group: "storage", action: "manage" },
    { group: "payroll", action: "read" },
  ],
  manager: [
    { group: "orders", action: "manage" },
    { group: "shifts", action: "manage" },
    { group: "clients", action: "read" },
    { group: "services", action: "read" },
    { group: "settings", action: "read" },
    { group: "analytics", action: "read" },
    { group: "booking", action: "manage" },
    { group: "storage", action: "read" },
  ],
  mechanic: [
    { group: "orders", action: "update" },
    { group: "shifts", action: "read" },
    { group: "clients", action: "read" },
    { group: "services", action: "read" },
    { group: "booking", action: "read" },
  ],
};

// Проверка разрешения
export function hasPermission(
  session: UserSession,
  required: Permission,
): boolean {
  const rolePermissions = permissionsByRole[session.roleId];
  return rolePermissions.some(
    (p) => p.group === required.group && p.action === required.action,
  );
}

// Проверка доступа к филиалу
export function canAccessBranch(
  session: UserSession,
  branchId: string,
): boolean {
  if (session.roleId === "owner") {
    return true;
  }
  return session.accessibleBranchIds.includes(branchId);
}

// Проверка возможности работать в филиале
export function canOperateInBranch(
  session: UserSession,
  branchId: string,
): boolean {
  if (session.roleId === "owner") {
    return true;
  }
  return session.accessibleBranchIds.includes(branchId);
}

export function checkOperateInBranch(
  session: UserSession,
  branchId: string,
): void {
  if (!canOperateInBranch(session, branchId)) {
    throw new Error("Access denied: cannot operate in this branch");
  }
}
