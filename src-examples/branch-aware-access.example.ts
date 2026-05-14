/**
 * SANITIZED PORTFOLIO EXAMPLE
 *
 * Это упрощённый пример branch-aware access control для демонстрации архитектурного подхода.
 * Реальная реализация содержит дополнительные проверки, кэширование и edge cases.
 * Реальные данные сотрудников, филиалов и секреты удалены.
 */

// Типы для branch-aware доступа
type UserSession = {
  employeeId: string;
  roleId: string;
  currentBranchId: string;
  accessibleBranchIds: string[];
};

type BranchContext = {
  branchId: string;
};

// Проверка доступа к филиалу
export function canAccessBranch(
  session: UserSession,
  targetBranchId: string,
): boolean {
  // Owner может видеть все филиалы
  if (session.roleId === "owner") {
    return true;
  }

  // Другие роли только свои доступные филиалы
  return session.accessibleBranchIds.includes(targetBranchId);
}

// Применение branch-aware фильтра к запросу
export function applyBranchFilter<T extends { branchId: string }>(
  items: T[],
  session: UserSession,
): T[] {
  if (session.roleId === "owner") {
    return items;
  }

  return items.filter((item) => item.branchId === session.currentBranchId);
}

// Проверка права на операцию в филиале
export function canOperateInBranch(
  session: UserSession,
  targetBranchId: string,
): boolean {
  if (session.roleId === "owner") {
    return true;
  }

  // Проверяем, что филиал доступен и сотрудник может в нём работать
  return session.accessibleBranchIds.includes(targetBranchId);
}

// Пример использования в repository pattern
type Order = {
  id: string;
  branchId: string;
  status: string;
  totalAmount: number;
};

type OrderRepository = {
  findByBranch: (branchId: string) => Promise<Order[]>;
  findById: (id: string, session: UserSession) => Promise<Order | null>;
  create: (data: Omit<Order, "id">, session: UserSession) => Promise<Order>;
};

// Пример repository с branch-aware фильтрацией
const createOrderRepository = (): OrderRepository => {
  return {
    findByBranch: async (branchId: string) => {
      // В реальном коде здесь Prisma query с branchId filter
      return [
        {
          id: "order-1",
          branchId: branchId,
          status: "in_work",
          totalAmount: 2400,
        },
      ];
    },

    findById: async (id: string, session: UserSession) => {
      // Сначала получаем заказ
      const order = {
        id: "order-1",
        branchId: "branch-1",
        status: "in_work",
        totalAmount: 2400,
      } as Order;

      // Проверяем branch-aware доступ
      if (!canAccessBranch(session, order.branchId)) {
        return null;
      }

      return order;
    },

    create: async (data: Omit<Order, "id">, session: UserSession) => {
      // Проверяем, что сотрудник может работать в этом филиале
      if (!canOperateInBranch(session, data.branchId)) {
        throw new Error("Access denied: cannot operate in this branch");
      }

      // Создаём заказ с branchId
      return {
        id: "order-new",
        ...data,
      };
    },
  };
};

// Пример сессии сотрудника
const exampleSession: UserSession = {
  employeeId: "employee-demo-1",
  roleId: "manager",
  currentBranchId: "branch-demo-1",
  accessibleBranchIds: ["branch-demo-1", "branch-demo-2"],
};

// Пример использования
export async function exampleUsage() {
  const repo = createOrderRepository();
  const orders = await repo.findByBranch("branch-demo-1");
  return orders;
}
