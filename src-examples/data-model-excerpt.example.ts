/**
 * SANITIZED PORTFOLIO EXAMPLE
 *
 * Это упрощённый excerpt модели данных Pegas Auto CRM для демонстрации архитектурного подхода.
 * Полная схема содержит дополнительные поля, индексы и constraint'ы, которые не публикуются.
 * Реальные персональные данные, секреты и детали реализации удалены.
 */

// Core entities - базовые сущности системы
type Branch = {
  id: string;
  code: string;
  name: string;
  displayName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Client = {
  id: string;
  displayName: string;
  contactLabel: string | null;
  contactChannel: string | null;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Vehicle = {
  id: string;
  clientId: string;
  label: string;
  brand: string;
  model: string;
  plateNumber: string;
  radius: string;
  createdAt: Date;
  updatedAt: Date;
};

type Service = {
  id: string;
  categoryKey: string;
  categoryLabelSnapshot: string;
  name: string;
  serviceType: string;
  pricingMode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

// Order с snapshot pattern - заказ с заморозкой данных
type Order = {
  id: string;
  branchId: string;
  number: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  status: string;
  clientId: string | null;
  vehicleId: string | null;
  totalAmount: number;

  // Snapshot fields - замороженные данные для неизменяемости истории
  clientSnapshotJson: Record<string, unknown>;
  vehicleSnapshotJson: Record<string, unknown> | null;
  executorSnapshotJson: Record<string, unknown> | null;
  paymentSnapshotJson: Record<string, unknown> | null;
  totalsSnapshotJson: Record<string, unknown> | null;
};

type OrderLine = {
  id: string;
  orderId: string;
  serviceId: string | null;
  sortOrder: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;

  // Snapshot fields - замороженные данные услуги
  serviceNameSnapshot: string;
  serviceCategorySnapshot: string | null;
  pricingSnapshotJson: Record<string, unknown>;
  salaryRuleSnapshotJson: Record<string, unknown> | null;
};

type Payment = {
  id: string;
  orderId: string;
  accountId: string | null;
  paymentMethod: string;
  amount: number;
  paidAt: Date;
  paymentSnapshotJson: Record<string, unknown>;
};

// Shift - смена филиала
type Shift = {
  id: string;
  branchId: string;
  number: number;
  status: string;
  openedAt: Date;
  closedAt: Date | null;

  // Snapshot fields - замороженные итоги смены
  revenueTotalSnapshot: number | null;
  cashTotalSnapshot: number | null;
  cashlessTotalSnapshot: number | null;
  salaryFundTotalSnapshot: number | null;
};

// Booking - запись на сервис
type Booking = {
  id: string;
  groupId: string;
  branchId: string;
  clientId: string | null;
  anonymous: boolean;
  dateKey: string;
  startTime: string;
  endTime: string;
  postId: string;
  serviceLabel: string;
  createdAt: Date;
  updatedAt: Date;

  // Snapshot fields - замороженные данные записи
  clientNameSnapshot: string;
  contactSnapshot: string;
  carSnapshot: string;
};

// Employee и role-based access
type Employee = {
  id: string;
  contactLabel: string;
  displayName: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Role = {
  id: string;
  name: string;
  systemKey: string | null;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Permission = {
  id: string;
  groupKey: string;
  actionKey: string;
  label: string;
  createdAt: Date;
};

// Branch-aware access связь
type EmployeeBranchAccess = {
  employeeId: string;
  branchId: string;
  isDefault: boolean;
  canOperate: boolean;
  canSwitchInto: boolean;
};

// Пример snapshot pattern - демонстрация заморозки данных
const createOrderSnapshot = (client: Client, vehicle: Vehicle | null) => {
  return {
    clientSnapshotJson: {
      id: client.id,
      displayName: client.displayName,
      contactLabel: client.contactLabel,
    },
    vehicleSnapshotJson: vehicle ? {
      id: vehicle.id,
      label: vehicle.label,
      plateNumber: vehicle.plateNumber,
    } : null,
  };
};

export const exampleOrder: Order = {
  id: "order-demo-001",
  branchId: "branch-demo-1",
  number: 123,
  createdAt: new Date("2026-05-14T10:00:00Z"),
  updatedAt: new Date("2026-05-14T10:30:00Z"),
  completedAt: null,
  status: "in_work",
  clientId: "client-demo-1",
  vehicleId: "vehicle-demo-1",
  totalAmount: 2400,
  clientSnapshotJson: {
    id: "client-demo-1",
    displayName: "Demo Client",
    contactLabel: "demo-contact",
  },
  vehicleSnapshotJson: {
    id: "vehicle-demo-1",
    label: "Demo Car",
    plateNumber: "DEMO-001",
  },
  executorSnapshotJson: null,
  paymentSnapshotJson: null,
  totalsSnapshotJson: null,
};
