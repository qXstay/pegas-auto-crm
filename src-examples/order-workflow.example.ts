type OrderStatus = "draft" | "in_work" | "ready" | "paid" | "cancelled";

type PaymentMethod = "cash" | "card" | "transfer";

type Order = {
  id: string;
  branchId: string;
  clientId: string;
  carId: string;
  status: OrderStatus;
  serviceIds: string[];
  total: number;
  paidAmount: number;
};

type Payment = {
  amount: number;
  method: PaymentMethod;
};

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  draft: ["in_work", "cancelled"],
  in_work: ["ready", "cancelled"],
  ready: ["paid", "in_work"],
  paid: [],
  cancelled: [],
};

export function addService(order: Order, serviceId: string, price: number): Order {
  if (order.status === "paid" || order.status === "cancelled") {
    throw new Error("Closed order cannot be changed");
  }

  return {
    ...order,
    serviceIds: [...order.serviceIds, serviceId],
    total: order.total + price,
  };
}

export function applyPayment(order: Order, payment: Payment): Order {
  if (order.status === "cancelled") {
    throw new Error("Cancelled order cannot be paid");
  }

  const paidAmount = Math.min(order.paidAmount + payment.amount, order.total);

  return {
    ...order,
    paidAmount,
    status: paidAmount >= order.total ? "paid" : order.status,
  };
}

export function moveOrder(order: Order, nextStatus: OrderStatus): Order {
  if (!allowedTransitions[order.status].includes(nextStatus)) {
    throw new Error(`Invalid transition: ${order.status} -> ${nextStatus}`);
  }

  return { ...order, status: nextStatus };
}

export const exampleOrder: Order = {
  id: "order-139",
  branchId: "branch-1",
  clientId: "client-1",
  carId: "car-1",
  status: "draft",
  serviceIds: [],
  total: 0,
  paidAmount: 0,
};
