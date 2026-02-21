# CRM-System

A full-stack **Customer Relationship Management (CRM)** web application built with **React.js** (frontend) and **Spring Boot** (backend), using **MySQL** for data persistence and **JWT** for authentication.

---

## Features

### Authentication
- User registration and login
- JWT-based token authentication
- Role-based access: **Admin** and **Sales Rep**
- Protected routes on the frontend

### Customer Management
- Add, edit, and delete customers
- Fields: Name, Email, Phone, Company, Address, Notes, Assigned Sales Rep

###  Leads Pipeline
- Track leads through stages: **New → Contacted → Converted → Lost**
- Filter leads by status
- Assign leads to sales reps

### Task Management
- Create and assign tasks with priority levels (High / Medium / Low)
- Mark tasks as **Completed** with one click
- Set due dates and track assignments

### Sales Pipeline
- Track deals across stages: **Proposal → Negotiation → Closed-Won / Closed-Lost**
- Record deal amount, date, and assigned rep
- Clean table view with stage badges

### Dashboard
- Revenue analytics bar chart
- Leads growth line chart
- Overview cards: Total Revenue, Active Leads, Pending Tasks

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, Recharts, Axios |
| Backend | Java 17, Spring Boot 4.x, Spring Security |
| Database | MySQL |
| Auth | JWT (JSON Web Tokens) |
| Build | Maven, npm |

---

## Project Structure

```
CRM-System/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── api.js             # Axios instance with JWT interceptor
│   │   ├── App.jsx            # Routes
│   │   ├── components/
│   │   │   ├── Layout.jsx     # Sidebar + Top Navbar
│   │   │   └── ProtectedRoute.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Customers.jsx
│   │       ├── Leads.jsx
│   │       ├── Tasks.jsx
│   │       └── Sales.jsx
│
└── Backend/demo/              # Spring Boot app
    └── src/main/java/com/example/demo/
        ├── controller/        # REST API controllers
        ├── model/             # JPA entities
        ├── repository/        # Spring Data JPA repos
        ├── service/           # Business logic
        ├── security/          # JWT filter + util
        └── config/            # Security config
```

---

##  Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

---

### 1. Database Setup

```sql
CREATE DATABASE crpsystem;
```

---

### 2. Backend Setup

```bash
cd Backend/demo
```

Configure your MySQL credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crpsystem
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

Start the backend:

```bash
./mvnw clean spring-boot:run
```

The API will be available at **http://localhost:8080**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and receive JWT token |
| GET | `/api/users/me` | Get current user info |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/{id}` | Get customer by ID |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/{id}` | Update customer |
| DELETE | `/api/customers/{id}` | Delete customer |

### Leads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | List all leads |
| GET | `/api/leads/{id}` | Get lead by ID |
| POST | `/api/leads` | Create lead |
| PUT | `/api/leads/{id}` | Update lead |
| DELETE | `/api/leads/{id}` | Delete lead |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

### Sales
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sales` | List all deals |
| GET | `/api/sales/{id}` | Get deal by ID |
| POST | `/api/sales` | Create deal |
| PUT | `/api/sales/{id}` | Update deal |

> All endpoints except `/api/login` and `/api/register` require an `Authorization: Bearer <token>` header.

---



##  User Roles

| Role | Access |
|---|---|
| `ADMIN` | Full access to all modules |
| `SALES` | Access to assigned leads, tasks, and customers |

---
## View
<img width="1470" height="956" alt="Screenshot 2026-02-21 at 1 03 50 PM" src="https://github.com/user-attachments/assets/3e552de7-7936-415c-81d2-e4f7f9b5f39c" />

<img width="1470" height="956" alt="Screenshot 2026-02-21 at 1 05 01 PM" src="https://github.com/user-attachments/assets/0527c3aa-46e2-48e6-b978-7cf14376a169" />


<img width="1470" height="956" alt="Screenshot 2026-02-21 at 1 05 08 PM" src="https://github.com/user-attachments/assets/ea5994b0-803b-4635-8b7d-590ce58d58d4" />


<img width="1470" height="956" alt="Screenshot 2026-02-21 at 1 05 42 PM" src="https://github.com/user-attachments/assets/39970283-241c-4a6c-9423-8a88737eed12" />

<img width="1470" height="956" alt="Screenshot 2026-02-21 at 1 06 01 PM" src="https://github.com/user-attachments/assets/6678f4d7-7d88-417f-bc33-3134fc72ad98" />


<img width="1470" height="956" alt="Screenshot 2026-02-21 at 1 06 20 PM" src="https://github.com/user-attachments/assets/5fd3d883-ce45-45da-aa18-7ab638faf691" />



