# Scope - Real-Time Collaborative Project Management

Scope is a full-stack, real-time project management application designed to streamline team collaboration. It features a live Kanban board, role-based access control, and instant updates using WebSockets, allowing teams to stay synchronized without refreshing the page.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socketdotio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## Key Features

* **Real-Time Collaboration:** Changes to the Kanban board (moving tasks, creating tasks) update instantly for all connected team members via **Socket.io**.
* **Interactive Kanban Board:** Drag-and-drop task management with status columns (Todo, In Progress, Done).
* **Team Management:**
    * **Invite Members:** Project owners can invite users by email to join their workspace.
    * **Task Assignment:** Assign specific tasks to team members with visual avatars.
* **Secure Authentication:** JWT-based HttpOnly cookie authentication with secure login and registration.
* **Role-Based Access:** Granular permissions ensuring only project members can view or edit tasks.
* **Dark Mode UI:** Fully responsive interface built with Tailwind CSS, featuring automatic light/dark mode support.
* **Instant Feedback:** Modern toast notifications for actions and updates.

---

## 🛠️ Tech Stack

### **Backend**
* **Node.js & Express:** RESTful API architecture.
* **MongoDB & Mongoose:** Data modeling with complex relationships (Aggregations, Population).
* **Socket.io:** Event-driven architecture for bi-directional communication.
* **JWT & Bcrypt:** Stateless authentication and security.

### **Frontend**
* **React (Vite):** Fast, component-based UI.
* **Context API:** Global state management for Authentication and Socket connections.
* **Tailwind CSS:** Modern, utility-first styling.
* **Lucide React:** Beautiful, consistent iconography.

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* Node.js (v14 or higher)
* MongoDB (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/scope.git](https://github.com/your-username/scope.git)
cd scope
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a .env file in the backend directory with the following variables:

```bash
PORT=8000
MONGODB_URI=mongodb+srv://<your_connection_string>
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_super_secret_key_123
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_refresh_secret_456
REFRESH_TOKEN_EXPIRY=10d
```

### Start the backend server
```bash
npm run dev
```

ou should see: "Server is running on port : 8000" and "MongoDB connected!"

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm run dev
```

### 4.Usage
Open http://localhost:5173 in your browser.

* Register a new account.
* Create a Project from the dashboard.
* Invite Members (optional) or open the project board.
* Create Tasks and drag them between columns to see real-time updates!

### Security Best Practices implemented
* **HttpOnly Cookies:** Prevents XSS attacks by making cookies inaccessible to JavaScript
* **Password Hashing:**  All passwords are hashed using bcrypt before storage.
* **CORS Configuration:** Strictly limited to the frontend domain.
* **Input Validation:** Backend validation for all incoming requests.