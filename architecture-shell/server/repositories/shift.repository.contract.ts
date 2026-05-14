/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import type { BranchId, ShiftId, Money } from "../../domain/types";

// Domain types
export interface Shift {
  id: ShiftId;
  branchId: BranchId;
  number: number;
  status: "open" | "closed";
  openedAt: Date;
  closedAt: Date | null;
  revenueTotalSnapshot: Money | null;
  cashTotalSnapshot: Money | null;
  cashlessTotalSnapshot: Money | null;
}

export interface ShiftCreateInput {
  branchId: BranchId;
  number: number;
  status: "open" | "closed";
  openedAt: Date;
}

export interface ShiftUpdateInput {
  status?: "open" | "closed";
  closedAt?: Date | null;
  revenueTotalSnapshot?: Money | null;
  cashTotalSnapshot?: Money | null;
  cashlessTotalSnapshot?: Money | null;
}

// Repository contract - контракт репозитория
export interface IShiftRepository {
  findById(id: ShiftId): Promise<Shift | null>;
  findByBranch(branchId: BranchId): Promise<Shift[]>;
  findOpenByBranch(branchId: BranchId): Promise<Shift | null>;
  getNextNumber(branchId: BranchId): Promise<number>;
  create(input: ShiftCreateInput): Promise<Shift>;
  update(id: ShiftId, input: ShiftUpdateInput): Promise<Shift>;
  delete(id: ShiftId): Promise<void>;
}
