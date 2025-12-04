# 🛒 Store Rating System (Full Stack)

A full-stack web application that allows users to search for stores and submit ratings (1-5 stars). The system features a robust Role-Based Access Control (RBAC) system with three distinct user roles: **System Administrator**, **Store Owner**, and **Normal User**.

Built as a coding challenge solution using the **PERN Stack** (PostgreSQL, Express, React, Node.js).

---

## 🚀 Live Demo & Credentials

To test the application, you can use the **"Quick Access" buttons** on the Login page or use these credentials:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **System Admin** | `admin@test.com` | `Password@123` | Dashboard Stats, Add Users/Stores, View All Data |
| **Store Owner** | `owner@test.com` | `Password@123` | View My Store Stats, See who rated my store |
| **Normal User** | `user@test.com` | `Password@123` | Search Stores, Submit Ratings, Modify Ratings |

> **Note:** The password policy is strict. It requires 8-16 characters, 1 Uppercase letter, and 1 Special Character.

---

## 🛠 Tech Stack

### Frontend
* **React (Vite):** Fast, modern frontend framework.
* **Tailwind CSS:** For responsive, clean, and professional UI styling.
* **Axios:** For API communication with the backend.
* **React Router:** For client-side routing and protected routes.
* **Context API:** For global state management (Authentication).

### Backend
* **Node.js & Express.js:** RESTful API architecture.
* **PostgreSQL:** Relational database for structured data.
* **Sequelize ORM:** For database modeling, relationships, and queries.
* **JWT (JSON Web Tokens):** For secure authentication.
* **Bcrypt.js:** For password hashing.

---

## ✨ Features

### 🛡️ System Administrator
* **Dashboard:** View total users, stores, and ratings at a glance.
* **User Management:** Add users (Admin, Owner, Normal) with strict validations.
* **Store Management:** Create stores and link them to specific Store Owners.
* **Data View:** View lists of all Users and Stores with sorting (ASC/DESC) and filtering.
* **Insights:** See the average rating of a Store Owner's shop directly in the user list.

### 🏪 Store Owner
* **Dashboard:** View their specific store's average rating and total review count.
* **Transparency:** See a list of users who have rated their store and the score given.

### 👤 Normal User
* **Registration:** Sign up for a new account.
* **Search:** Search stores by Name or Address.
* **Rating System:** Submit a 1-5 star rating. (Updates previous rating if already submitted).
* **Visual Feedback:** See "Your Rating" vs "Overall Rating" on store cards.
* **Security:** Change Password functionality.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd store-rating-system

2. Backend Setup

Navigate to the server folder and install dependencies.

Bash
cd server
npm install
Create a .env file in the /server folder:

Code snippet
DB_NAME=rating_system  # Or your Cloud DB Name
DB_USER=postgres       # Or your Cloud DB User
DB_PASS=yourpassword   # Or your Cloud DB Password
DB_HOST=localhost      # Or your Cloud DB Host
DB_PORT=5432           # Use 10774 if using Aiven/Cloud
JWT_SECRET=mysecretkey123
PORT=5000
Seed the Database (Important): This script creates the tables and populates the database with the Admin, Owner, and dummy data so you can log in immediately.

Bash
node seed.js
Start the Server:

Bash
npm run dev
3. Frontend Setup

Open a new terminal, navigate to the client folder.

Bash
cd client
npm install
Start the React App:

Bash
npm run dev
Access the app at http://localhost:5173.

📂 Project Structure
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI (Navbar, Forms, StarRating)
│   │   ├── context/     # AuthContext (State Management)
│   │   ├── pages/       # Dashboards (Admin, User, Owner), Login
│   │   └── App.jsx      # Routing Logic
│   └── vite.config.js   # Proxy configuration
│
└── server/              # Node.js Backend
    ├── config/          # Database connection (Sequelize)
    ├── controllers/     # Logic for Auth, Admin, Stores, Ratings
    ├── middleware/      # JWT Auth & Role Verification
    ├── models/          # Database Schema (User, Store, Rating)
    ├── routes/          # API Endpoints
    └── seed.js          # Database population script
✅ Form Validations (Strict Requirements)
Name: Min 20 characters, Max 60 characters.

Address: Max 400 characters.

Password: 8-16 characters, must include 1 Uppercase & 1 Special Char.

Email: Standard email format.