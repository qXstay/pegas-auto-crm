# Модель данных

## Core entities

**Branch** — филиал сети шиномонтажей. Хранит профиль, настройки печати, настройки записи, платежные счета. Все операционные данные привязаны к филиалу.

**User** — учётная запись сотрудника. Содержит логин и credential/security fields. Связан с Employee.

**Employee** — сотрудник с ролью, привязками к филиалам, процентом ставки и квалификацией. Может быть назначен исполнителем в заказах.

**Role** — роль сотрудника (owner, admin, manager, mechanic). Определяет набор разрешений.

**Permission** — конкретное разрешение (orders:read, shifts:manage, settings:write и т.д.). Роли связаны с разрешениями через маппинг.

**Client** — клиент. Хранит контактный профиль и источник обращения. Связан с автомобилями.

**Vehicle** — автомобиль клиента. Хранит бренд, модель, госномер, радиус. Используется в заказах и записях.

**Service** — услуга. Хранит категорию, название, тип цены, pricing metadata и правила зарплаты.

**Order** — заказ. Центральная сущность операционного процесса. Содержит клиента, автомобиль, услуги, исполнителей, статусы, оплаты и snapshot-поля для неизменяемости истории.

**OrderLine** — позиция в заказе. Связывает услугу с заказом, хранит количество, цену, сумму и snapshot данных услуги.

**Payment** — оплата по заказу. Хранит метод, сумму, счёт и snapshot данных.

**Shift** — смена филиала. Агрегирует заказы, оплаты, кассовые итоги и показатели рабочего дня.

**Booking** — запись на сервис. Публичная или внутренняя, связана с клиентом, автомобилем, постом и временем.

## Snapshot pattern

Финансовые данные в системе замораживаются через snapshot-поля:

- **Order** — содержит JSON-поля `clientSnapshotJson`, `vehicleSnapshotJson`, `executorSnapshotJson`, `paymentSnapshotJson`, `totalsSnapshotJson`, `payoutBreakdownSnapshotJson`, `printSnapshotJson`
- **OrderLine** — содержит `serviceNameSnapshot`, `serviceCategorySnapshot`, `pricingSnapshotJson`, `salaryRuleSnapshotJson`, `salaryAccrualSnapshotJson`

Это гарантирует, что изменения в справочниках (клиенты, услуги, цены) не влияют на исторические данные заказов.

## Branch-aware access

Доступ к данным фильтруется по филиалу:

- **EmployeeBranchAccess** — таблица связей сотрудник-филиал с флагами `canOperate` и `canSwitchInto`
- Сессия сотрудника содержит `currentBranchId`
- Все read/write операции учитывают текущий филиал сотрудника

## Отношения

```
Branch (1) ── (N) Order
Branch (1) ── (N) Shift
Branch (1) ── (N) Booking
Branch (1) ── (N) EmployeeBranchAccess
Branch (1) ── (N) PaymentAccount

Client (1) ── (N) Vehicle
Client (1) ── (N) Order
Client (1) ── (N) Booking

Vehicle (1) ── (N) Order
Vehicle (1) ── (N) Booking

Order (1) ── (N) OrderLine
Order (1) ── (N) Payment
Order (1) ── (N) OrderExecutor
Order (N) ── (1) Shift

Service (1) ── (N) OrderLine

User (1) ── (1) Employee
Employee (N) ── (M) Role
Role (N) ── (M) Permission
```

## Примечание

Это обзорный excerpt модели данных без деталей реализации. Полная схема содержит дополнительные поля, индексы и constraint'ы, которые не публикуются для защиты коммерческой информации.
