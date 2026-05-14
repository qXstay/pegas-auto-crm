# Architecture Shell

Эта папка содержит **sanitized architecture shell** — упрощённую архитектурную структуру Pegas Auto CRM для демонстрации инженерного подхода.

## Назначение

Файлы в этой папке **не являются production source code**. Они демонстрируют:

- Feature-based структуру фронтенда
- Branch-aware access control
- Role/permission систему
- Order lifecycle
- Shift closing logic
- Payroll calculation (high-level)
- Snapshot pattern для immutable истории
- Repository contracts
- Prisma schema excerpt

## Что НЕ опубликовано

Production-код, приватные бизнес-правила, реальные данные, интеграции, деплой-конфигурации, auth/session/security реализация, API routes, migrations, seed — не опубликованы.

## Структура

```
architecture-shell/
├── README.md                      # Этот файл
├── frontend/                      # Feature-based фронтенд структура
│   ├── booking-page.structure.tsx # Страница онлайн-записи
│   ├── order-workspace.structure.tsx # Рабочее пространство заказа
│   └── shift-dashboard.structure.tsx # Дашборд смены
├── server/                        # Бэкенд сервисы
│   ├── access-control/            # Access control
│   │   └── branch-scope.ts        # Branch-aware фильтрация
│   ├── services/                  # Бизнес-логика
│   │   ├── order-lifecycle.service.ts # Жизненный цикл заказа
│   │   ├── shift-closing.service.ts   # Закрытие смены
│   │   └── payroll-calculation.service.ts # Расчёт зарплаты
│   └── repositories/              # Repository contracts
│       ├── order.repository.contract.ts
│       └── shift.repository.contract.ts
├── domain/                        # Domain types
│   ├── order-snapshot.ts          # Snapshot pattern
│   ├── permissions.ts             # Role/permission types
│   └── types.ts                   # Shared domain types
├── prisma/                        # Database schema excerpt
│   └── schema-excerpt.prisma
└── tests/                         # Пример теста
    └── order-lifecycle.example.spec.ts
```

## Санитизация

Все данные в примерах обезличены:
- demo-branch-1, demo-order-001
- Demo Client, Demo Vehicle
- demo-service
- Без реальных ФИО, телефонов, адресов, реквизитов

## Лицензия

Этот architecture shell является частью публичного case-study проекта Pegas Auto CRM.
