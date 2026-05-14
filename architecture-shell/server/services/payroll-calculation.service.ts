/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 *
 * Payroll calculation - high-level example without real customer rates and formulas.
 */

import type { Money } from "../../domain/types";
import type { UserSession } from "../../domain/permissions";
import { hasPermission } from "../../domain/permissions";

// Payroll calculation - расчёт зарплаты (sanitized high-level example)

export interface ServiceLine {
  serviceId: string;
  price: Money;
  discount: Money;
  executorIds: string[];
  payrollPercent: number; // Процент от услуги для исполнителя
}

export interface PayrollAccrual {
  serviceId: string;
  executorId: string;
  base: Money;
  amount: Money;
}

export class PayrollCalculationService {
  // Расчёт начислений по услугам
  calculatePayrollAccruals(
    services: ServiceLine[],
    paidAmount: Money,
  ): PayrollAccrual[] {
    const orderBase = services.reduce(
      (sum, service) => sum + Math.max(service.price - service.discount, 0),
      0,
    );

    if (orderBase <= 0 || paidAmount <= 0) {
      return [];
    }

    // Соотношение оплаченной суммы к базе
    const paidRatio = Math.min(paidAmount / orderBase, 1);

    return services.flatMap((service) => {
      if (service.executorIds.length === 0) {
        return [];
      }

      const serviceBase = Math.max(service.price - service.discount, 0);
      const payrollBase = serviceBase * paidRatio;
      const executorShare = payrollBase / service.executorIds.length;

      return service.executorIds.map((executorId) => ({
        serviceId: service.serviceId,
        executorId,
        base: this.roundMoney(executorShare),
        amount: this.roundMoney(executorShare * (service.payrollPercent / 100)),
      }));
    });
  }

  // Расчёт итоговой зарплаты сотрудника за период
  calculateEmployeePayroll(
    accruals: PayrollAccrual[],
    employeeId: string,
  ): Money {
    return accruals
      .filter((a) => a.executorId === employeeId)
      .reduce((sum, a) => sum + a.amount, 0);
  }

  // Округление денег
  private roundMoney(value: number): Money {
    return Math.round(value * 100) / 100;
  }

  // Валидация прав доступа
  checkPayrollAccess(session: UserSession): void {
    if (!hasPermission(session, { group: "payroll", action: "read" })) {
      throw new Error("Permission denied: payroll access required");
    }
  }

  // Валидация прав на изменение
  checkPayrollManageAccess(session: UserSession): void {
    if (!hasPermission(session, { group: "payroll", action: "manage" })) {
      throw new Error("Permission denied: payroll manage access required");
    }
  }
}

// Пример использования
export function exampleUsage() {
  const service = new PayrollCalculationService();

  const services: ServiceLine[] = [
    {
      serviceId: "demo-service-1",
      price: 2400,
      discount: 0,
      executorIds: ["employee-1"],
      payrollPercent: 30,
    },
    {
      serviceId: "demo-service-2",
      price: 1800,
      discount: 200,
      executorIds: ["employee-1", "employee-2"],
      payrollPercent: 25,
    },
  ];

  const accruals = service.calculatePayrollAccruals(services, 4000);
  // Результат:
  // - employee-1: service-1 (720) + service-2 (400) = 1120
  // - employee-2: service-2 (400) = 400

  return accruals;
}
