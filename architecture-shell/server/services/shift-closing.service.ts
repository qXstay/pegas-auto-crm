/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import type { Shift, ShiftUpdateInput } from "../repositories/shift.repository.contract";
import type { UserSession } from "../../domain/permissions";
import type { Money } from "../../domain/types";
import { hasPermission, canOperateInBranch } from "../../domain/permissions";
import type { IShiftRepository } from "../repositories/shift.repository.contract";
import type { IOrderRepository } from "../repositories/order.repository.contract";

// Shift Closing Service - сервис закрытия смены

export class ShiftClosingService {
  constructor(
    private shiftRepo: IShiftRepository,
    private orderRepo: IOrderRepository,
  ) {}

  async closeShift(
    shiftId: string,
    session: UserSession,
  ): Promise<Shift> {
    // Проверка прав
    if (!hasPermission(session, { group: "shifts", action: "manage" })) {
      throw new Error("Permission denied");
    }

    const shift = await this.shiftRepo.findById(shiftId);
    if (!shift) {
      throw new Error("Shift not found");
    }

    if (shift.status === "closed") {
      throw new Error("Shift is already closed");
    }

    // Проверка доступа к филиалу
    if (!canOperateInBranch(session, shift.branchId)) {
      throw new Error("Access denied: cannot operate in this branch");
    }

    // Расчёт итогов смены
    const orders = await this.orderRepo.findByBranch(shift.branchId);
    const shiftOrders = orders.filter((o) => {
      // В реальном коде здесь фильтр по дате и смене
      return o.status === "paid" || o.status === "ready";
    });

    const totals = this.calculateShiftTotals(shiftOrders);

    // Обновление смены
    const updateInput: ShiftUpdateInput = {
      status: "closed",
      closedAt: new Date(),
      revenueTotalSnapshot: totals.revenue,
      cashTotalSnapshot: totals.cash,
      cashlessTotalSnapshot: totals.cashless,
    };

    return this.shiftRepo.update(shiftId, updateInput);
  }

  private calculateShiftTotals(orders: any[]): {
    revenue: Money;
    cash: Money;
    cashless: Money;
  } {
    let revenue = 0;
    let cash = 0;
    let cashless = 0;

    for (const order of orders) {
      const total = Number(order.totalAmount);
      revenue += total;

      // В реальном коде здесь анализ paymentSnapshot
      // Для примера - 50% наличные, 50% безналичные
      cash += total * 0.5;
      cashless += total * 0.5;
    }

    return {
      revenue,
      cash,
      cashless,
    };
  }

  async reopenShift(
    shiftId: string,
    session: UserSession,
  ): Promise<Shift> {
    // Проверка прав
    if (!hasPermission(session, { group: "shifts", action: "manage" })) {
      throw new Error("Permission denied");
    }

    const shift = await this.shiftRepo.findById(shiftId);
    if (!shift) {
      throw new Error("Shift not found");
    }

    if (shift.status !== "closed") {
      throw new Error("Shift is not closed");
    }

    // Проверка доступа к филиалу
    if (!canOperateInBranch(session, shift.branchId)) {
      throw new Error("Access denied: cannot operate in this branch");
    }

    const updateInput: ShiftUpdateInput = {
      status: "open",
      closedAt: null,
    };

    return this.shiftRepo.update(shiftId, updateInput);
  }
}
