/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import type { Order, OrderCreateInput, OrderUpdateInput } from "../repositories/order.repository.contract";
import type { UserSession } from "../../domain/permissions";
import type { OrderStatus, Money } from "../../domain/types";
import type { OrderSnapshot } from "../../domain/order-snapshot";
import { createOrderSnapshot } from "../../domain/order-snapshot";
import { hasPermission, checkOperateInBranch } from "../../domain/permissions";
import type { IOrderRepository } from "../repositories/order.repository.contract";
import type { Client, Vehicle, Employee } from "../../domain/types";

// Order Lifecycle Service - сервис жизненного цикла заказа

export class OrderLifecycleService {
  constructor(
    private orderRepo: IOrderRepository,
  ) {}

  async createOrder(
    input: {
      clientId: string | null;
      vehicleId: string | null;
      services: Array<{ serviceId: string; price: Money; quantity: number }>;
      session: UserSession;
    },
  ): Promise<Order> {
    // Проверка прав
    if (!hasPermission(input.session, { group: "orders", action: "create" })) {
      throw new Error("Permission denied");
    }

    // Проверка доступа к филиалу
    if (!canOperateInBranch(input.session, "demo-branch-1")) {
      throw new Error("Access denied: cannot operate in this branch");
    }

    // Получение следующего номера
    const nextNumber = await this.orderRepo.getNextNumber("demo-branch-1");

    // Расчёт итоговой суммы
    const totalAmount = input.services.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0,
    );

    // Создание snapshot
    const client: Client = {
      id: input.clientId || "demo-client-1",
      displayName: "Demo Client",
      contactLabel: "demo-contact",
      contactChannel: null,
      source: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const vehicle: Vehicle | null = input.vehicleId ? {
      id: input.vehicleId,
      clientId: client.id,
      label: "Demo Vehicle",
      brand: "Demo Brand",
      model: "Demo Model",
      plateNumber: "DEMO-001",
      radius: "R16",
      createdAt: new Date(),
      updatedAt: new Date(),
    } : null;

    const snapshot: OrderSnapshot = createOrderSnapshot(
      client,
      vehicle,
      null, // executor
      null, // paymentMethod
      0, // paymentAmount
      totalAmount,
      0, // discount
      totalAmount,
      "new",
    );

    const createInput: OrderCreateInput = {
      branchId: "demo-branch-1",
      number: nextNumber,
      status: "new",
      clientId: input.clientId,
      vehicleId: input.vehicleId,
      totalAmount,
      clientSnapshotJson: snapshot.clientSnapshot,
      vehicleSnapshotJson: snapshot.vehicleSnapshot,
      executorSnapshotJson: snapshot.executorSnapshot,
      paymentSnapshotJson: snapshot.paymentSnapshot,
      totalsSnapshotJson: snapshot.totalsSnapshot,
    };

    return this.orderRepo.create(createInput);
  }

  async updateOrderStatus(
    orderId: string,
    nextStatus: OrderStatus,
    session: UserSession,
  ): Promise<Order> {
    // Проверка прав
    if (!hasPermission(session, { group: "orders", action: "update" })) {
      throw new Error("Permission denied");
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Валидация переходов статусов
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      draft: ["new", "cancelled"],
      new: ["in_work", "cancelled"],
      in_work: ["ready", "cancelled"],
      ready: ["paid", "cancelled"],
      paid: [],
      cancelled: [],
    };

    if (!validTransitions[order.status].includes(nextStatus)) {
      throw new Error(`Invalid status transition: ${order.status} -> ${nextStatus}`);
    }

    // Обновление snapshot при смене статуса
    const updateInput: OrderUpdateInput = {
      status: nextStatus,
      completedAt: nextStatus === "ready" ? new Date() : null,
      totalsSnapshotJson: {
        ...order.totalsSnapshotJson,
        status: nextStatus,
      },
    };

    return this.orderRepo.update(orderId, updateInput);
  }

  async cancelOrder(orderId: string, session: UserSession): Promise<Order> {
    return this.updateOrderStatus(orderId, "cancelled", session);
  }

  async completeOrder(orderId: string, session: UserSession): Promise<Order> {
    return this.updateOrderStatus(orderId, "ready", session);
  }
}
