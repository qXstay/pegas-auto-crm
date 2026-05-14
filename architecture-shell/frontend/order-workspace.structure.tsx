/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import React, { useState, useEffect } from "react";

// Order Workspace - рабочее пространство заказа

interface OrderLine {
  id: string;
  serviceId: string | null;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderData {
  id: string;
  number: number;
  status: string;
  clientId: string | null;
  clientDisplayName: string;
  clientContact: string | null;
  vehicleId: string | null;
  vehicleLabel: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: Date;
  lines: OrderLine[];
  payments: Array<{
    id: string;
    method: string;
    amount: number;
    paidAt: Date;
  }>;
}

interface OrderWorkspaceState {
  order: OrderData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  selectedServiceId: string | null;
}

export function OrderWorkspaceStructure({ orderId }: { orderId: string }) {
  const [state, setState] = useState<OrderWorkspaceState>({
    order: null,
    isLoading: true,
    isSaving: false,
    error: null,
    selectedServiceId: null,
  });

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to load order");
      }
      const data = await response.json();
      setState((prev) => ({ ...prev, order: data, isLoading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to load order",
        isLoading: false,
      }));
    }
  };

  const addService = async (serviceId: string) => {
    if (!state.order) return;

    setState((prev) => ({ ...prev, isSaving: true, error: null }));
    try {
      const response = await fetch(`/api/orders/${orderId}/lines`, {
        method: "POST",
        body: JSON.stringify({ serviceId, quantity: 1 }),
      });
      if (!response.ok) {
        throw new Error("Failed to add service");
      }
      await loadOrder(); // Reload order
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to add service",
        isSaving: false,
      }));
    }
  };

  const removeLine = async (lineId: string) => {
    if (!state.order) return;

    setState((prev) => ({ ...prev, isSaving: true, error: null }));
    try {
      const response = await fetch(`/api/orders/${orderId}/lines/${lineId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove line");
      }
      await loadOrder();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to remove line",
        isSaving: false,
      }));
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!state.order) return;

    setState((prev) => ({ ...prev, isSaving: true, error: null }));
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      await loadOrder();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to update status",
        isSaving: false,
      }));
    }
  };

  const addPayment = async (method: string, amount: number) => {
    if (!state.order) return;

    setState((prev) => ({ ...prev, isSaving: true, error: null }));
    try {
      const response = await fetch(`/api/orders/${orderId}/payments`, {
        method: "POST",
        body: JSON.stringify({ method, amount }),
      });
      if (!response.ok) {
        throw new Error("Failed to add payment");
      }
      await loadOrder();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to add payment",
        isSaving: false,
      }));
    }
  };

  // В реальном коде здесь полноценный JSX с:
  // - Header с номером заказа и статусом
  // - Client info section
  // - Vehicle info section
  // - Services list with add/remove
  // - Payments section
  // - Action buttons (complete, cancel, print)
  return (
    <div>
      <h1>Order Workspace</h1>
      {/* Order header, client info, vehicle info, services, payments, actions */}
    </div>
  );
}
