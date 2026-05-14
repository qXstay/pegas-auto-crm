# Технологический стек

## Frontend

- **Next.js 16** — React-фреймворк с App Router для SSR и API routes
- **React 19** — UI библиотека
- **TypeScript 5** — строгая типизация
- **TailwindCSS 4** — utility-first CSS фреймворк
- **Lucide React** — иконки

## Backend

- **Server Actions** — серверные действия в Next.js для API
- **Repository pattern** — слой абстракции над базой данных
- **Feature-based архитектура** — модульная организация кода по доменным областям

## Database

- **PostgreSQL** — реляционная СУБД
- **Prisma ORM** — type-safe database access с миграциями

## Testing

- **Playwright** — E2E тестирование критических пользовательских сценариев

## Deployment

- **Docker** — контейнеризация приложения
- (Детали деплоя не публикуются)

## Архитектурные паттерны

- **Repository pattern** — разделение бизнес-логики и доступа к данным
- **Feature-based structure** — код организован по доменным областям (orders, booking, shifts, payroll, analytics)
- **Snapshot pattern** — неизменяемые snapshot'ы финансовых данных в заказах
- **Branch-aware access** — фильтрация данных по филиалам на уровне репозиториев
- **Role-based access control** — разрешения на уровне ролей и маршрутов
