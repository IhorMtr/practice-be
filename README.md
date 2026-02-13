# Backend (Express + TypeScript + MongoDB)

## Опис

Backend-частина веб-застосунку для сервісної компанії з ремонту та обслуговування техніки.
Реалізовано REST API, автентифікацію/авторизацію на JWT (access + refresh), рольову модель доступу (RBAC) та CRUD для основних сутностей: користувачі системи, клієнти, заявки на ремонт.

---

## Технології

- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT (access/refresh)
- Joi (валідація)
- bcrypt (хешування паролів)
- pino / pino-http (логування)

---

## Вимоги

- Встановлений Node.js (рекомендовано LTS)
- Доступ до MongoDB (Atlas або локальна MongoDB)

---

## Налаштування змінних середовища

Створіть файл `.env` у корені backend та заповніть змінні:

```env
APP_DOMAIN=
PORT=

MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_URL=
MONGODB_DB=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_MIN=
JWT_REFRESH_EXPIRES_DAYS=

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

> **Примітка:** seed адміністратора запускається разом із сервером.
> Якщо адмін з `ADMIN_EMAIL` уже існує — нічого не змінюється.

---

## Встановлення та запуск

### 1) Встановіть залежності

```bash
npm install
```

### 2) Запустіть у режимі розробки

```bash
npm run dev
```

### 3) Зберіть та запустіть (production-like)

```bash
npm run build
npm start
```

---

## Ролі користувачів (RBAC)

У системі є ролі:

- `admin` — повний доступ, включно з управлінням користувачами
- `manager` — робота з клієнтами та заявками
- `technician` — доступ лише до заявок, призначених йому

**Важливо:** під час реєстрації користувач створюється з `role = null`.
Поки адміністратор не призначить роль — користувач не може отримати токени (login/refresh заборонені).

---

## Автентифікація (JWT)

- **Access token** повертається у відповіді на `POST /api/auth/login` та `POST /api/auth/refresh`
- **Refresh token** зберігається в httpOnly cookie `refreshToken`
- **sessionId** зберігається в httpOnly cookie `sessionId`
- Для приватних ендпоінтів потрібен заголовок:

```
Authorization: Bearer <accessToken>
```

---

## Основні ендпоінти

### Auth

- `POST /api/auth/register` — реєстрація (створює користувача з `role=null`)
- `POST /api/auth/login` — логін (потрібна роль та активність)
- `POST /api/auth/refresh` — оновлення сесії (cookies)
- `POST /api/auth/logout` — вихід (тільки при валідній refresh-сесії)

---

### Users (тільки admin)

- `GET /api/users` — список користувачів
- `GET /api/users/:id` — отримати користувача
- `PATCH /api/users/:id` — змінити роль/активність користувача

Приклад body:

```json
{
  "role": "manager",
  "isActive": true
}
```

---

### Clients (admin, manager)

- `GET /api/clients?search=` — список клієнтів + пошук
- `GET /api/clients/:id` — отримати клієнта
- `POST /api/clients` — створити клієнта
- `PATCH /api/clients/:id` — оновити клієнта
- `DELETE /api/clients/:id` — видалити клієнта

Модель клієнта:

- `fullName` (required)
- `email` (required, unique)
- `notes` (optional)
- `createdAt / updatedAt` — автоматично

---

### Tickets (заявки)

**Доступ:**

- `admin / manager` — повний доступ
- `technician` — бачить тільки призначені йому заявки, може змінювати статус / коментувати

**Ендпоінти:**

- `GET /api/tickets?status=&priority=&search=` — список заявок + фільтри/пошук
  (для `technician` повертаються тільки його заявки)
- `GET /api/tickets/:id` — отримати заявку
  (для `technician` тільки якщо вона призначена йому)
- `POST /api/tickets` — створити заявку (`admin/manager`)
- `PATCH /api/tickets/:id` — редагування заявки (`admin/manager`)
- `PATCH /api/tickets/:id/status` — зміна статусу (+ коментар)
  (`admin/manager/technician` у межах прав)

---

## Тестові сценарії (ручна перевірка)

### 1) Перевірка seed адміністратора

1. Запустіть сервер
2. Переконайтеся, що в MongoDB з’явився користувач `ADMIN_EMAIL` з роллю `admin`
   (лише якщо його не було)

---

### 2) Реєстрація користувача (`role=null`)

Виконайте:

```json
POST /api/auth/register
{
  "name": "User",
  "email": "user@test.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Перевірте, що користувач створився з `role: null`.

---

### 3) Login без ролі (повинен бути 403)

1. Виконайте `POST /api/auth/login` для нового користувача
2. Очікувано: **403** (роль не призначена)

---

### 4) Призначення ролі адміном

1. Виконайте `POST /api/auth/login` адміном → отримайте `accessToken`
2. Виконайте `GET /api/users` (Bearer admin token) → знайдіть `id` користувача
3. Виконайте:

```json
PATCH /api/users/:id
{
  "role": "manager",
  "isActive": true
}
```

---

### 5) Login користувача після призначення ролі

1. Виконайте `POST /api/auth/login` як user → отримайте `accessToken`
2. Перевірте доступ до приватних ендпоінтів
   (наприклад, `GET /api/clients`)

---

### 6) CRUD клієнтів (`admin/manager`)

1. `POST /api/clients` (Bearer manager/admin)
2. `GET /api/clients?search=...`
3. `PATCH /api/clients/:id`
4. `DELETE /api/clients/:id`

---

### 7) CRUD заявок + обмеження `technician`

1. Створіть клієнта
2. `POST /api/tickets` (`admin/manager`)
3. Створіть користувача / призначте роль `technician`
4. `PATCH /api/tickets/:id` (`admin/manager`) → `assignedTechnicianId`
5. `GET /api/tickets` під `technician` → бачить тільки свої
6. `PATCH /api/tickets/:id/status` під `technician` → змінює статус / додає коментар
7. Перевірте `history` у відповіді заявки

---

## Примітки

- Усі приватні ендпоінти захищені `authenticate` (JWT + активна сесія).
- RBAC-обмеження реалізовані через middleware `authorize(...)`.
- Паролі зберігаються тільки у вигляді хешу (bcrypt), поле `password` не повертається у відповідях.
