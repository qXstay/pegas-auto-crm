type Money = number;

type ServiceLine = {
  id: string;
  title: string;
  price: Money;
  discount: Money;
  executorIds: string[];
  payrollPercent: number;
};

type PayrollAccrual = {
  serviceId: string;
  executorId: string;
  base: Money;
  amount: Money;
};

const roundMoney = (value: number): Money => Math.round(value * 100) / 100;

export function calculatePayrollAccruals(
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

  const paidRatio = Math.min(paidAmount / orderBase, 1);

  return services.flatMap((service) => {
    if (service.executorIds.length === 0) {
      return [];
    }

    const serviceBase = Math.max(service.price - service.discount, 0);
    const payrollBase = serviceBase * paidRatio;
    const executorShare = payrollBase / service.executorIds.length;

    return service.executorIds.map((executorId) => ({
      serviceId: service.id,
      executorId,
      base: roundMoney(executorShare),
      amount: roundMoney(executorShare * (service.payrollPercent / 100)),
    }));
  });
}

export const examplePayroll = calculatePayrollAccruals(
  [
    {
      id: "service-tire-change-r16",
      title: "Комплекс шиномонтажа R16",
      price: 2400,
      discount: 200,
      executorIds: ["employee-1", "employee-2"],
      payrollPercent: 35,
    },
    {
      id: "service-balancing",
      title: "Балансировка колеса",
      price: 800,
      discount: 0,
      executorIds: ["employee-1"],
      payrollPercent: 30,
    },
  ],
  2500,
);
