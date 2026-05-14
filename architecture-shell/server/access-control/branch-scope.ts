/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import type { UserSession } from "../../domain/permissions";
import { canAccessBranch, canOperateInBranch } from "../../domain/permissions";

// Branch-aware filtering - фильтрация данных по филиалу

export interface BranchScoped<T> {
  branchId: string;
  data: T;
}

// Фильтрация списка сущностей по branchId
export function filterByBranch<T extends { branchId: string }>(
  items: T[],
  session: UserSession,
): T[] {
  if (session.roleId === "owner") {
    return items;
  }

  return items.filter((item) => item.branchId === session.currentBranchId);
}

// Проверка доступа к конкретной сущности
export function checkAccessToEntity<T extends { branchId: string }>(
  entity: T | null,
  session: UserSession,
): T | null {
  if (!entity) {
    return null;
  }

  if (!canAccessBranch(session, entity.branchId)) {
    return null;
  }

  return entity;
}

// Проверка возможности оперировать в филиале для создания/обновления
export function checkOperateInBranch(
  branchId: string,
  session: UserSession,
): void {
  if (!canOperateInBranch(session, branchId)) {
    throw new Error("Access denied: cannot operate in this branch");
  }
}

// Scope query builder helper - для Prisma queries
export interface BranchScopeQuery {
  branchId?: string;
}

export function buildBranchScope(
  session: UserSession,
): BranchScopeQuery {
  if (session.roleId === "owner") {
    return {};
  }

  return {
    branchId: session.currentBranchId,
  };
}
