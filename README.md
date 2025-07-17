# 🏗️ Multi-Tenant System

A scalable and modular **multi-tenant backend system** built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. Supports tenant-based data isolation, role-based access control, JWT authentication, Redis caching, and more.

---

## 🌐 Repository

**GitHub:** [https://github.com/Mayankgangwr/Multi-Tenant-System](https://github.com/Mayankgangwr/Multi-Tenant-System)

---

## 📦 Tech Stack

| Layer         | Technology         |
| ------------- | ------------------ |
| Runtime       | Node.js (v18+)     |
| Framework     | Express (v5)       |
| Language      | TypeScript         |
| Database      | MongoDB + Mongoose |
| Caching       | Redis              |
| Auth          | JWT (jsonwebtoken) |
| Validation    | Zod                |
| Password Hash | bcryptjs           |
| Env Mgmt      | dotenv             |
| Dev Tools     | ts-node, nodemon   |

---

## 📁 Project Structure

```
├── src/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, validation, etc.
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── validators/       # Zod validators
│   └── index.ts          # App entry point
├── dist/                 # Compiled output (tsc)
├── .env                  # Local environment variables
├── .env.example          # Example env file
├── package.json          # Project metadata
├── tsconfig.json         # TypeScript config
└── README.md             # Project documentation
```

---

## 🧪 Scripts

| Command       | Purpose                          |
| ------------- | -------------------------------- |
| `npm install` | Install dependencies             |
| `npm run dev` | Start server in development mode |
| `npm start`   | Start server from compiled JS    |
| `npm test`    | Placeholder for tests            |

---

## 📥 Cloning & Setup

```bash
git clone https://github.com/Mayankgangwr/Multi-Tenant-System.git
cd Multi-Tenant-System
npm install
```

---

## 🔐 Environment Configuration

Copy `.env.example` and fill in required variables:

```bash
cp .env.example .env
```

#### .env.example

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/multiTenantDB
JWT_SECRET=your_jwt_secret_key
REDIS_URL=redis://localhost:6379
```

---

## 🚀 Running the App

### Development:

```bash
npm run dev
```

### Production:

```bash
tsc
npm start
```

---

## 🔗 API Endpoints (Planned)

| Method | Route          | Description             |
| ------ | -------------- | ----------------------- |
| POST   | /auth/login    | User login with JWT     |
| POST   | /auth/register | Register tenant or user |
| GET    | /tenants       | Admin fetch all tenants |
| GET    | /profile       | Get profile (subadmin)  |

> ✅ Swagger setup planned

---

## 🌍 Postman Collection

> ✅ Will be added soon for quick testing of API endpoints.

---

## 📦 GitHub Repository in package.json

```json
{
  "name": "multi-tenant-system",
  "version": "1.0.0",
  "description": "A Node.js multi-tenant backend system",
  "repository": {
    "type": "git",
    "url": "https://github.com/Mayankgangwr/Multi-Tenant-System.git"
  },
  "main": "index.js",
  "scripts": { ... },
  "author": "Mayank Gangwar",
  "license": "ISC"
}
```

---

## 👨‍💻 Contribution

Contributions are welcome! Just follow these steps:

```bash
git checkout -b feature/your-feature
# Make your changes
git commit -m "Added new feature"
git push origin feature/your-feature
```

Then open a pull request on GitHub.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Mayank Gangwar**
GitHub: [@Mayankgangwr](https://github.com/Mayankgangwr)
