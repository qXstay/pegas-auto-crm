/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import type { Client, Vehicle, Employee, Money } from "./types";

// Snapshot pattern - заморозка данных для неизменяемости истории
// Вся финансовая история хранится в immutable snapshot-полях

export interface OrderSnapshot {
  clientSnapshot: ClientSnapshot;
  vehicleSnapshot: VehicleSnapshot | null;
  executorSnapshot: EmployeeSnapshot | null;
  paymentSnapshot: PaymentSnapshot | null;
  totalsSnapshot: TotalsSnapshot;
}

export interface ClientSnapshot {
  id: string;
  displayName: string;
  contactLabel: string | null;
}

export interface VehicleSnapshot {
  id: string;
  label: string;
  brand: string;
  model: string;
  plateNumber: string;
  radius: string;
}

export interface EmployeeSnapshot {
  id: string;
  displayName: string;
  roleId: string;
}

export interface PaymentSnapshot {
  method: string;
  amount: Money;
  paidAt: Date;
}

export interface TotalsSnapshot {
  subtotal: Money;
  discount: Money;
  total: Money;
  paidAmount: Money;
  status: string;
}

// Функция создания snapshot для заказа
export function createOrderSnapshot(
  client: Client,
  vehicle: Vehicle | null,
  executor: Employee | null,
  paymentMethod: string | null,
  paymentAmount: Money,
  subtotal: Money,
  discount: Money,
  total: Money,
  status: string,
): OrderSnapshot {
  return {
    clientSnapshot: {
      id: client.id,
      displayName: client.displayName,
      contactLabel: client.contactLabel,
    },
    vehicleSnapshot: vehicle ? {
      id: vehicle.id,
      label: vehicle.label,
      brand: vehicle.brand,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
      radius: vehicle.radius,
    } : null,
    executorSnapshot: executor ? {
      id: executor.id,
      displayName: executor.displayName,
      roleId: executor.roleId,
    } : null,
    paymentSnapshot: paymentMethod ? {
      method: paymentMethod,
      amount: paymentAmount,
      paidAt: new Date(),
    } : null,
    totalsSnapshot: {
      subtotal,
      discount,
      total,
      paidAmount: paymentAmount,
      status,
    },
  };
}
