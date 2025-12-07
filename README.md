# 🚗 Vehicle Rental System – Backend API

A full-featured backend system for managing vehicle rentals, users, bookings, and authentication.
Built with Node.js, TypeScript, Express, and PostgreSQL (NeonDB) — following professional modular architecture.

## 🌐 Live API URL

```js
https://vehicle-rental-system-peach.vercel.app/
```

## 📌 Overview

#### This project provides a complete backend solution for a vehicle rental platform. It includes:

- 🔐 User authentication + role-based access (Admin / Customer)

- 🚗 Vehicle management with availability tracking

- 📅 Advanced booking system with automatic price calculation

- 🔄 Auto-return system (bookings auto-marked returned after end date)

- 🧩 Modular architecture (Controllers → Services → Database)

- 🔥 Dynamic SQL update builder (PATCH-style updates)

- 🧪 Strong validation and error handling

## ✨ Features

### 🔑 Authentication & Authorization

- Signup & Login with JWT

- Password hashing using bcrypt

- Role-based permissions:

  - Admin → Full access

  - Customer → Can manage only their own data

## 🚗 Vehicles Module

- Add, update, delete vehicles

- Supported types: car, bike, van, SUV

- Vehicle availability: available | booked

- Dynamic partial update (PATCH behavior)

- Validates vehicle type, availability status, and numeric fields

## 👥 Users Module

- Admin can manage all users

- Customers can update only their own profile

- Email automatically converted to lowercase

- Dynamic update with validation

## 📅 Bookings Module

- Create bookings with:

  - Start/end dates

  - Automatic price calculation

  - Vehicle availability update

- Customer can cancel only before start date

- Admin can mark booking as returned

- Auto-return system updates expired bookings

## 🤖 Auto-Return System

A scheduled background process:

- Finds bookings where rent_end_date < NOW()

- Marks them "returned"

- Sets corresponding vehicle availability back to "available"

Uses PostgreSQL CTE for optimized bulk update.

## 🛠️ Tech Stack

| Category  | Technology          |
| --------- | ------------------- |
| Language  | TypeScript          |
| Runtime   | Node.js             |
| Framework | Express.js          |
| Database  | PostgreSQL (NeonDB) |
| Security  | JWT, bcrypt         |
| Tools     | ts-node-dev, dotenv |

## 📁 Project Structure

```bash
src/
│── config/
│── helpers/
│── middlewares/
│── modules/
│ ├── auth/
│ ├── user/
│ ├── vehicle/
│ └── booking/
│── types/express
│── app.ts
│── server.ts
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git https://github.com/azalamin/vehicle-rental-system.git
cd vehicle-rental-system
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create .env file:

```js
PORT=5001
CONNECTION_STR=postgresql://neondb_owner:npg_Qf05AVeBXxCL@ep-wandering-term-a8ghmy6b-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

### 5️⃣ Build & Run Production

```bash
npm run build
npm start
```

## 📘 API Endpoints (Summary)

### 🔐 Auth

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| POST   | /api/v1/auth/signup | Register a new user   |
| POST   | /api/v1/auth/signin | Login and receive JWT |

### 🚗 Vehicles

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | /api/v1/vehicles     | Create vehicle (Admin) |
| GET    | /api/v1/vehicles     | Get all vehicles       |
| GET    | /api/v1/vehicles/:id | Get vehicle by ID      |
| PUT    | /api/v1/vehicles/:id | Update vehicle (Admin) |
| DELETE | /api/v1/vehicles/:id | Delete vehicle (Admin) |

### 👥 Users

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | /api/v1/users     | Get all users (Admin)    |
| PUT    | /api/v1/users/:id | Update user              |
| DELETE | /api/v1/users/:id | Delete user (Admin only) |

### 📅 Bookings

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | /api/v1/bookings     | Create booking            |
| GET    | /api/v1/bookings     | Get bookings (role-based) |
| PUT    | /api/v1/bookings/:id | Update booking status     |

## 🧪 Testing (Postman / Thunder Client)

### Import the API collection:

```bash
https://drive.google.com/file/d/15f3iAaqU8cZmwO8oTdbbIjELe8CLriJt/view?usp=sharing
```

## 🧹 Code Quality Highlights

- Clean separation of concerns

- Sanitized inputs and safe SQL (parameterized queries)

- Reusable helper functions

- Generic enum validator

- Reusable dynamic SQL update builder

## 🤝 Contributing

Pull requests are welcome!
Follow clean code guidelines and modular design.

## 📄 License

MIT License © 2025 Al Amin Sheikh
