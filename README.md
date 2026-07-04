# AeroNet - Enterprise Telecom Management Platform

AeroNet is an enterprise-grade telecom management platform featuring a modern **React + Vite** frontend and a **Spring Boot** backend. The system integrates secure **JWT token authentication** and role-based access control (RBAC).

---

## Project Structure

```
telecom-management-platform/
├── backend/                  # Spring Boot Service
│   ├── pom.xml               # Maven configuration
│   └── src/                  # Java source files (controller, security, model, repository, etc.)
└── frontend/                 # Vite + React Client
    ├── package.json          # Node dependencies
    ├── index.html            # Core HTML template
    └── src/                  # React source files (pages, styling index.css, App.jsx, main.jsx)
```

---

## 🚀 Getting Started

### 1. Prerequisite Checklist

- **Java SDK 17** or higher
- **Node.js** (v18+) & **npm**
- **Maven** (optional, you can compile from your preferred IDE like IntelliJ IDEA)

---

### 2. Running the Backend

The Spring Boot application contains two profiles:
1. `dev-h2`: Runs with an embedded in-memory H2 database (No local database server installation required).
2. `mysql`: Connects to a standard local MySQL database instance.

#### Run with H2 (Default out-of-the-box):
Open your terminal in `./backend` and execute:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev-h2
```
*Alternatively, load the project in your IDE (IntelliJ, Eclipse, VS Code) and run the `TelecomApplication` class with active profile `-Dspring.profiles.active=dev-h2`.*

- **H2 Console URL**: `http://localhost:8080/h2-console`
- **H2 JDBC URL**: `jdbc:h2:mem:telecomdb`
- **H2 Credentials**: Username `sa` / Password `password`

#### Run with MySQL:
1. Ensure a MySQL database server is running on port 3306 and database `telecomdb` exists.
2. Open `./backend/src/main/resources/application.yml` and adjust connection credentials if necessary.
3. Start the application:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

---

### 3. Running the Frontend

Navigate to the `./frontend` folder and start the local development server:

```bash
# Install npm dependencies (completed during initial set up)
npm install

# Spin up Vite local dev environment
npm run dev
```

- **Frontend URL**: `http://localhost:5173`

---

## 🔒 Security & Roles

AeroNet uses **JWT stateless authentication**. Authentication headers are passed with every backend request as:
`Authorization: Bearer <JWT_TOKEN>`

Available Roles:
- `ROLE_CUSTOMER`: Custom subscriber portal access.
- `ROLE_ADMIN`: Platform control desk panel access.
- `ROLE_SUPPORT`: Customer service agent access.

### Creating an Account
Navigate to `http://localhost:5173` and click the **Register here** link to create your credentials and assign roles. Once registered, log in to access the secure control desk dashboard.
