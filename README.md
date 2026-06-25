# Student Internship & Project Board

A modern full-stack web application that connects students with organizations offering internships and academic projects. The platform enables students to create profiles, organizations to post opportunities, and both parties to manage internship applications through an intuitive dashboard.

---

# Features

## Student Management

* Register new students
* Store student information in the database
* View student profiles
* Manage skills and contact details

## Internship Listings

* Create internship and project opportunities
* Add organization details, role, stipend, duration, and required skills
* View all available listings

## Application System

* Students can apply for internships
* Store applications in the database
* Track application status:

  * Pending
  * Shortlisted
  * Rejected

## Dashboard

* Total Students
* Total Listings
* Total Applications
* Total Shortlisted Candidates
* Live database statistics

## Bonus Features

* Skill matching between students and listings
* Highlight matching opportunities
* Most Applied Internship analytics

---

# Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Tailwind CSS (Optional)

## Backend

* Node.js
* Express.js

## Database

* SQLite (or MongoDB depending on implementation)

---

# Project Structure

```text
Student-Internship-Project-Board/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── database/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── pages/
│   ├── assets/
│   └── index.html
│
├── README.md
└── .gitignore
```

---

# Database Schema

## Students

| Field   | Type        |
| ------- | ----------- |
| id      | Primary Key |
| name    | Text        |
| college | Text        |
| year    | Integer     |
| skills  | Text        |
| bio     | Text        |
| contact | Text        |

## Listings

| Field           | Type        |
| --------------- | ----------- |
| id              | Primary Key |
| org_name        | Text        |
| role            | Text        |
| duration        | Text        |
| stipend         | Text        |
| skills_required | Text        |
| contact         | Text        |
| posted_at       | DateTime    |

## Applications

| Field      | Type                             |
| ---------- | -------------------------------- |
| id         | Primary Key                      |
| listing_id | Foreign Key                      |
| student_id | Foreign Key                      |
| status     | Pending / Shortlisted / Rejected |
| note       | Text                             |
| applied_at | DateTime                         |

---

# REST API

## Student APIs

| Method | Endpoint    | Description        |
| ------ | ----------- | ------------------ |
| POST   | `/students` | Register a student |
| GET    | `/students` | Get all students   |

## Listing APIs

| Method | Endpoint    | Description               |
| ------ | ----------- | ------------------------- |
| POST   | `/listings` | Create internship listing |
| GET    | `/listings` | Get all listings          |

## Application APIs

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| POST   | `/apply`            | Apply for internship      |
| GET    | `/applications`     | View all applications     |
| PUT    | `/applications/:id` | Update application status |

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/student-internship-project-board.git
```

```bash
cd student-internship-project-board
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start the Backend

```bash
npm start
```

or

```bash
node server.js
```

## 4. Open the Application

```
http://localhost:3000
```

---

# Sample Data

### Student

```json
{
  "name": "John Doe",
  "college": "ABC University",
  "year": 3,
  "skills": "JavaScript, Node.js, SQL",
  "bio": "Passionate Full Stack Developer",
  "contact": "john@example.com"
}
```

### Internship Listing

```json
{
  "org_name": "Tech Solutions",
  "role": "Full Stack Intern",
  "duration": "3 Months",
  "stipend": "₹10000/month",
  "skills_required": "JavaScript, Express, SQL",
  "contact": "hr@techsolutions.com"
}
```

---

# Project Workflow

```text
Student Registration
        │
        ▼
Saved to Database
        │
        ▼
Student Applies
        │
        ▼
Application Stored
        │
        ▼
Organization Reviews
        │
        ▼
Status Updated
        │
        ▼
Dashboard Updated Instantly
```

---

# Project Demonstration

This project demonstrates:

* Student Registration
* Internship Listing Creation
* Database Read and Write Operations
* CRUD Functionality
* RESTful API Development
* Application Tracking
* Status Management
* Dashboard Analytics
* Responsive User Interface

---

# Learning Objectives

* Full-Stack Development
* Backend API Development
* Database Design
* CRUD Operations
* Express.js
* Node.js
* SQLite or MongoDB
* Responsive UI Design
* REST API Integration

---

# Author

**Anu Gaur**

MCA Student | Full Stack Developer

---

# License

This project is created for educational and learning purposes. Feel free to use and modify it for personal or academic projects.
