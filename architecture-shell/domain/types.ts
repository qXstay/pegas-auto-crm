/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

// Shared domain types - общие доменные типы

export type Money = number;

export type BranchId = string;
export type OrderId = string;
export type ShiftId = string;
export type EmployeeId = string;
export type ClientId = string;
export type VehicleId = string;

export type OrderStatus = "draft" | "new" | "in_work" | "ready" | "paid" | "cancelled";
export type ShiftStatus = "open" | "closed";
export type PaymentMethod = "cash" | "card" | "transfer";

export interface Branch {
  id: BranchId;
  code: string;
  name: string;
  displayName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: ClientId;
  displayName: string;
  contactLabel: string | null;
  contactChannel: string | null;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: VehicleId;
  clientId: ClientId;
  label: string;
  brand: string;
  model: string;
  plateNumber: string;
  radius: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  categoryKey: string;
  name: string;
  serviceType: string;
  pricingMode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: EmployeeId;
  contactLabel: string;
  displayName: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  systemKey: string | null;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  groupKey: string;
  actionKey: string;
  label: string;
}
