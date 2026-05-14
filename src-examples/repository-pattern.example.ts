/**
 * SANITIZED PORTFOLIO EXAMPLE
 *
 * Это упрощённый пример repository pattern для демонстрации архитектурного подхода.
 * Реальная реализация содержит транзакции, error handling, валидацию и edge cases.
 * Реальные бизнес-правила и детали реализации удалены.
 */

// Domain types - доменные типы
type Order = {
  id: string;
  branchId: string;
  number: number;
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

type OrderCreateInput = {
  branchId: string;
  status: string;
  totalAmount: number;
};

type OrderUpdateInput = {
  status?: string;
  totalAmount?: number;
};

// Repository interface - интерфейс репозитория
interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByBranch(branchId: string): Promise<Order[]>;
  create(input: OrderCreateInput): Promise<Order>;
  update(id: string, input: OrderUpdateInput): Promise<Order>;
  delete(id: string): Promise<void>;
}

// Read repository - для чтения данных
interface IOrderReadRepository {
  findById(id: string): Promise<Order | null>;
  findByBranch(branchId: string): Promise<Order[]>;
  findActiveByBranch(branchId: string): Promise<Order[]>;
  findByDateRange(branchId: string, from: Date, to: Date): Promise<Order[]>;
}

// Write repository - для записи данных
interface IOrderWriteRepository {
  create(input: OrderCreateInput): Promise<Order>;
  update(id: string, input: OrderUpdateInput): Promise<Order>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<Order>;
}

// Пример реализации read repository
class OrderReadRepository implements IOrderReadRepository {
  async findById(id: string): Promise<Order | null> {
    // В реальном коде здесь Prisma query
    return {
      id: "order-1",
      branchId: "branch-1",
      number: 123,
      status: "in_work",
      totalAmount: 2400,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async findByBranch(branchId: string): Promise<Order[]> {
    // В реальном коде здесь Prisma query с branchId filter
    return [
      {
        id: "order-1",
        branchId: branchId,
        number: 123,
        status: "in_work",
        totalAmount: 2400,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async findActiveByBranch(branchId: string): Promise<Order[]> {
    // В реальном коде здесь Prisma query с status filter
    return [];
  }

  async findByDateRange(branchId: string, from: Date, to: Date): Promise<Order[]> {
    // В реальном коде здесь Prisma query с date range filter
    return [];
  }
}

// Пример реализации write repository
class OrderWriteRepository implements IOrderWriteRepository {
  async create(input: OrderCreateInput): Promise<Order> {
    // В реальном коде здесь Prisma create с транзакцией
    return {
      id: `order-${Date.now()}`,
      branchId: input.branchId,
      number: 0,
      status: input.status,
      totalAmount: input.totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async update(id: string, input: OrderUpdateInput): Promise<Order> {
    // В реальном коде здесь Prisma update с валидацией
    return {
      id,
      branchId: "branch-1",
      number: 123,
      status: input.status || "draft",
      totalAmount: input.totalAmount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async delete(id: string): Promise<void> {
    // В реальном коде здесь Prisma delete с проверками
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    // В реальном коде здесь Prisma update с бизнес-валидацией статусов
    return {
      id,
      branchId: "branch-1",
      number: 123,
      status,
      totalAmount: 2400,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

// Service layer - бизнес-логика использует репозитории
class OrderService {
  constructor(
    private readRepo: IOrderReadRepository,
    private writeRepo: IOrderWriteRepository,
  ) {}

  async getOrder(id: string): Promise<Order | null> {
    return this.readRepo.findById(id);
  }

  async createOrder(input: OrderCreateInput): Promise<Order> {
    // Бизнес-валидация
    if (input.totalAmount < 0) {
      throw new Error("Total amount cannot be negative");
    }

    return this.writeRepo.create(input);
  }

  async completeOrder(id: string): Promise<Order> {
    const order = await this.readRepo.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Бизнес-логика перехода статуса
    if (order.status === "paid") {
      throw new Error("Order is already paid");
    }

    return this.writeRepo.updateStatus(id, "ready");
  }
}

// Пример использования
export async function exampleUsage() {
  const readRepo = new OrderReadRepository();
  const writeRepo = new OrderWriteRepository();
  const service = new OrderService(readRepo, writeRepo);

  const newOrder = await service.createOrder({
    branchId: "branch-1",
    status: "draft",
    totalAmount: 2400,
  });

  return newOrder;
}
