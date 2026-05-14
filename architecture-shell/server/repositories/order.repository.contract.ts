/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import type {
  OrderId,
  BranchId,
  OrderStatus,
  Money,
} from "../../domain/types";
import type { OrderSnapshot } from "../../domain/order-snapshot";

// Domain types
export interface Order {
  id: OrderId;
  branchId: BranchId;
  number: number;
  status: OrderStatus;
  clientId: string | null;
  vehicleId: string | null;
  totalAmount: Money;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  clientSnapshotJson: Record<string, unknown>;
  vehicleSnapshotJson: Record<string, unknown> | null;
  executorSnapshotJson: Record<string, unknown> | null;
  paymentSnapshotJson: Record<string, unknown> | null;
  totalsSnapshotJson: Record<string, unknown>;
}

export interface OrderCreateInput {
  branchId: BranchId;
  number: number;
  status: OrderStatus;
  clientId: string | null;
  vehicleId: string | null;
  totalAmount: Money;
  clientSnapshotJson: Record<string, unknown>;
  vehicleSnapshotJson: Record<string, unknown> | null;
  executorSnapshotJson: Record<string, unknown> | null;
  paymentSnapshotJson: Record<string, unknown> | null;
  totalsSnapshotJson: Record<string, unknown>;
}

export interface OrderUpdateInput {
  status?: OrderStatus;
  totalAmount?: Money;
  clientSnapshotJson?: Record<string, unknown>;
  vehicleSnapshotJson?: Record<string, unknown> | null;
  executorSnapshotJson?: Record<string, unknown> | null;
  paymentSnapshotJson?: Record<string, unknown> | null;
  totalsSnapshotJson?: Record<string, unknown>;
  completedAt?: Date | null;
}

// Repository contract - контракт репозитория
export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  findByBranch(branchId: BranchId): Promise<Order[]>;
  findByBranchAndStatus(
    branchId: BranchId,
    status: OrderStatus,
  ): Promise<Order[]>;
  getNextNumber(branchId: BranchId): Promise<number>;
  create(input: OrderCreateInput): Promise<Order>;
  update(id: OrderId, input: OrderUpdateInput): Promise<Order>;
  delete(id: OrderId): Promise<void>;
}
