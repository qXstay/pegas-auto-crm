# Pegas Auto CRM — CRM/POS-система для сети шиномонтажей

Реальный коммерческий проект: полнофункциональная CRM/POS-система для сети шиномонтажей. Система объединяет заказы, клиентов, автомобили, смены, услуги, оплаты, зарплаты, аналитику и онлайн-запись в едином интерфейсе.

## О проекте

Система заменяет разрозненные таблицы и ручные процессы на централизованную платформу для управления сетью шиномонтажей: несколько филиалов, посты записи, касса, сотрудники, услуги, зарплаты и полная история обслуживания клиентов.

## Что реализовано

- Авторизация сотрудников с ролевой моделью доступа
- Branch-aware доступ к данным по филиалам и рабочим зонам
- Открытие и закрытие смен с кассовым учётом
- Создание и ведение заказов с клиентом, автомобилем, услугами и оплатой
- База клиентов и автомобилей с историей обращений
- Календарь записи по постам и публичная онлайн-запись
- Настройка услуг, категорий и прайсов
- Расчёт зарплаты исполнителей на основе выполненных услуг
- Базовая аналитика по заказам, выручке, услугам и выплатам
- Печать квитанции 57 мм без фискализации

## Ключевые технические решения

- **Snapshot pattern** — финансовые данные замораживаются в заказе для точного учёта и неизменяемости истории
- **Branch-aware access control** — сотрудники видят только данные своих филиалов и рабочих зон
- **Repository pattern** — разделение бизнес-логики и доступа к данным
- **Feature-based архитектура** — модульная структура для масштабируемости
- **TypeScript + Prisma** — строгая типизация на всех уровнях

## Скриншоты

| Раздел | Скриншот |
| --- | --- |
| Календарь записи | ![Календарь записи](screenshots/booking.png) |
| Оформление заказа | ![Оформление заказа](screenshots/order.png) |
| Текущая смена | ![Текущая смена](screenshots/shift.png) |
| Аналитика | ![Аналитика](screenshots/analytic.png) |
| Карточка клиента | ![Карточка клиента](screenshots/clients-card.png) |
| Онлайн-запись | ![Онлайн-запись](screenshots/online-book.png) |
| Настройка услуг | ![Настройка услуг](screenshots/settings-services.png) |
| Настройка записи | ![Настройка записи](screenshots/settings-booking.png) |

## Мой вклад

Проект выполнен как solo/full-stack разработка: архитектура, frontend, backend, база данных, бизнес-логика, ролевая модель, поддержка и дальнейшие доработки.

## Архитектура

- **Frontend:** TypeScript, Next.js 16, React 19 — веб-интерфейс для сотрудников и публичная онлайн-запись
- **Backend:** Server Actions, Repository pattern, бизнес-логика заказов, смен, записи, ролей, кассы и зарплат
- **Database:** PostgreSQL через Prisma ORM — хранение клиентов, автомобилей, заказов, услуг, смен, оплат и прав доступа
- **Access control:** Ролевая модель (owner, admin, manager, mechanic) + branch-aware фильтрация данных
- **Business flow:** клиент → автомобиль → заказ → услуги → исполнитель → оплата → смена → зарплата → аналитика

## Architecture shell

Папка [architecture-shell/](architecture-shell/) содержит **sanitized architecture shell** — упрощённую архитектурную структуру системы для демонстрации инженерного подхода. Это не production-код, а excerpt, который показывает:

- Feature-based структуру фронтенда (booking, order workspace, shift dashboard)
- Branch-aware access control и фильтрацию данных
- Role/permission систему
- Order lifecycle сервис
- Shift closing логику
- Payroll calculation (high-level пример без реальных формул заказчика)
- Snapshot pattern для immutable финансовой истории
- Repository contracts
- Prisma schema excerpt
- Пример E2E теста

Все данные в architecture-shell обезличены (demo-branch-1, demo-order-001, Demo Client). Production-код, приватные бизнес-правила, реальные данные и интеграции не опубликованы.

Подробнее: [architecture-shell/README.md](architecture-shell/README.md)

## Что опубликовано безопасно

Полный коммерческий код, настройки, ключи, данные клиентов и закрытые материалы заказчика не публикуются. В репозитории собраны:
- Публичное описание проекта и архитектуры
- Architecture shell для демонстрации структуры и паттернов
- Скриншоты интерфейса с обезличенными данными
- Безопасные TypeScript-примеры отдельных модулей (sanitized snippets)
- Обзор технических решений без деталей реализации

## Примеры кода

- [Расчёт зарплаты исполнителей](src-examples/payroll-calculator.example.ts)
- [Жизненный цикл заказа](src-examples/order-workflow.example.ts)
- [Права доступа и филиалы](src-examples/permissions.example.ts)
- [Поток онлайн-записи](src-examples/booking-flow.example.ts)
- [Модель данных (excerpt)](src-examples/data-model-excerpt.example.ts)
- [Branch-aware доступ](src-examples/branch-aware-access.example.ts)
- [Repository pattern](src-examples/repository-pattern.example.ts)
- [Operational utilities](src-examples/operational-utils.example.ts)

## Документация

- [Архитектура](docs/architecture.md)
- [Модули](docs/modules.md)
- [Модель данных](docs/data-model.md)
- [Технологический стек](docs/tech-stack.md)
- [Технические решения](docs/challenges-and-solutions.md)
- [Безопасность и приватность](docs/security-and-privacy.md)

## Статус

Реальный коммерческий проект в продакшене. Скриншоты показывают основные рабочие сценарии системы.
