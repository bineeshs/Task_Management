# Task Manager

## Overview
This is a **Task Manager** web application built with **Angular** for the frontend and **Django (Django REST Framework)** for the backend. It includes user authentication, task management, and filtering features.

## Features
- **User Authentication**: Login, Register, Logout
- **Task Management**: Create, Edit, Delete, View tasks
- **Filtering & Sorting**: Filter by status, Sort by creation date
- **Pagination**: Navigate through task lists
- **Token-Based Authentication**: Uses JWT for secure access

## Technologies Used
### **Frontend (Angular 15)**
- Angular Material (for UI components)
- Reactive Forms
- HttpClient (for API communication)

### **Backend (Django 4.2, DRF)**
- Django Rest Framework (DRF)
- SQLite (default database)
- JWT Authentication (Simple JWT)

## Setup Instructions
### **1. Clone the Repository**
```sh
git clone https://github.com/your-repo/task-manager.git
cd task-manager
```

### **2. Backend Setup (Django API)**
```sh
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate virtual environment
pip install -r requirements.txt  # Install dependencies
```
#### **Run Migrations and Start Server**
```sh
python manage.py migrate
python manage.py runserver
```
API will be available at: `http://127.0.0.1:8000/api/`

#### **Create a Superuser (Optional)**
```sh
python manage.py createsuperuser
```

### **3. Frontend Setup (Angular)**
```sh
cd frontend
npm install  # Install dependencies
ng serve  # Start Angular app
```
Angular app will be available at: `http://localhost:4200/`

## API Endpoints
| Endpoint          | Method | Description              |
|------------------|--------|--------------------------|
| `/api/register/` | POST   | Register a new user      |
| `/api/token/`    | POST   | Obtain JWT token        |
| `/api/tasks/`    | GET    | List all tasks          |
| `/api/tasks/`    | POST   | Create a new task       |
| `/api/tasks/{id}/` | PUT   | Update a task          |
| `/api/tasks/{id}/` | DELETE | Delete a task         |

## Authentication
- Uses **JWT authentication**
- Token is stored in **localStorage** after login
- Logout clears the token and redirects to the login page

## License
MIT License



