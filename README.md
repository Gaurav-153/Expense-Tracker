# 💸 Expense Tracker App

A full-stack Expense Tracker application built with **Django** (backend) and **React** (frontend). It allows users to register, log in, and manage their daily expenses by adding, editing, and deleting expense entries.

---

## 🚀 Features

- 🔐 User authentication (Signup/Login/Logout)
- ➕ Add, ✏️ Edit, and 🗑️ Delete expenses
- 🗂️ Categorize expenses
- 📅 Filter expenses by date or category
- 💰 Calculate total balance
- 📱 Responsive UI (React + Bootstrap/Tailwind)

---

## 🛠️ Tech Stack

### 🌐 Frontend

- ⚛️ React (with Hooks)
- 🔁 Axios (API requests)
- 🌍 React Router
- 🎨 Bootstrap / TailwindCSS

### 🔙 Backend

- 🐍 Django
- 🔗 Django REST Framework
- 🗃️ PostgreSQL / SQLite
- 🔐 JWT Authentication (`djangorestframework-simplejwt`)

---

## 📦 Installation

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) & npm
- [Python 3.8+](https://www.python.org/)
- pip / pipenv 
- PostgreSQL (optional, SQLite is default)

---

### ⚙️ Backend Setup (Django)

```bash
# Clone the repo
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker/backend

# Create a virtual environment
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver

```

### ⚙️ Frontend Setup (React)

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the React development server
npm start

