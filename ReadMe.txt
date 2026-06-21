# 🍽️ MealMind
# 📖 Project Overview

MealMind is a cloud-based Meal Planning and Nutrition Management System developed using the MERN Stack (MongoDB Atlas, Express.js, React.js, and Node.js).

The system helps users manage meal plans, monitor nutritional intake, maintain their personal profiles, and visualize health-related insights through an interactive dashboard.

Unlike traditional desktop applications, MealMind stores all user information securely in MongoDB Atlas, allowing users to access their data from anywhere.

---

# 🎯 Objectives

- Help users organize their meals.
- Track nutritional information.
- Provide a user-friendly dashboard.
- Store user data securely in the cloud.
- Build a scalable MERN application.

---

# ✨ Features

✔ User Registration

✔ Secure Login Authentication

✔ Dashboard

✔ Meal Planner

✔ Nutrition Tracking

✔ Profile Management

✔ User Settings

✔ Responsive Interface

✔ Cloud Database

---

# 🛠 Technology Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcrypt.js
- dotenv
- CORS

## Database

- MongoDB Atlas
- Mongoose

---

# 🏗 System Architecture

```
                User

                  │

            React Frontend

                  │

             Axios Requests

                  │

          Express REST API

                  │

            Mongoose ODM

                  │

           MongoDB Atlas
```

---

# 📂 Project Structure

```
MealMind

│

├── client
│   ├── public
│   ├── src
│   │    ├── assets
│   │    ├── components
│   │    ├── pages
│   │    ├── services
│   │    ├── App.jsx
│   │    └── main.jsx
│   └── package.json

│

├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json

│

├── README.md

└── package.json
```

---

# 💻 Software Requirements

Before running the project install:

- Node.js (18 or later)
- npm
- MongoDB Atlas Account
- Git
- VS Code

---

# ⚙ Installation

## Step 1
Move into project

```bash
cd MealMind
```

---

## Step 2

Install frontend dependencies

```bash
cd client

npm install
```

---

## Step 3

Install backend dependencies

```bash
cd ../server

npm install
```

---

# ☁ MongoDB Atlas Configuration

Create a file named

```
.env
```

inside

```
server/
```

Add

```env
PORT=5000

MONGO_URI=mongodb://mealmind_db_user:Doaremon@ac-8l7roh3-shard-00-00.7xffdhz.mongodb.net:27017,ac-8l7roh3-shard-00-01.7xffdhz.mongodb.net:27017,ac-8l7roh3-shard-00-02.7xffdhz.mongodb.net:27017/?ssl=true&replicaSet=atlas-84wjaw-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=YourSecretKey
```

---

# ▶ Running the Application

## Backend

```bash
cd server

npm run dev
```

or

```bash
npm start
```

---

## Frontend

Open another terminal

```bash
cd client

npm run dev
```

---

Open browser

```
http://localhost:5173
```

---

# 🔄 Application Workflow

```
User

↓

Login/Register

↓

Authentication (JWT)

↓

Dashboard

↓

Meal Planning

↓

Nutrition Tracking

↓

MongoDB Atlas

↓

Updated Dashboard
```

---

# 📊 Database

The project uses MongoDB Atlas.

Collections include:

- Users
- Meals
- Nutrition
- Profiles
- Settings

---

# 🔐 Authentication

Authentication is implemented using

- JWT Tokens

Passwords are encrypted using

- bcrypt.js

---

# 📡 API Overview

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /register | Register User |
| POST | /login | Login User |
| GET | /profile | Get Profile |
| PUT | /profile | Update Profile |
| GET | /meals | Get Meals |
| POST | /meals | Add Meal |
| PUT | /meals/:id | Update Meal |
| DELETE | /meals/:id | Delete Meal |

*(Update these endpoints to match your actual backend.)*


---

# ❗ Troubleshooting

### MongoDB Connection Error

- Verify the MongoDB Atlas connection string.
- Ensure your IP address is added to Atlas Network Access.
- Check that the database user credentials are correct.

### npm install Fails

Delete:

```
node_modules
package-lock.json
```

Then run:

```bash
npm install
```

### Port Already in Use

Change the port in the `.env` file or stop the process using the current port.

---

# 🚀 Future Enhancements

- AI Meal Recommendation
- Calorie Prediction
- BMI Calculator
- Barcode Scanner
- Food Image Recognition
- Email Notifications
- Mobile Application
- Admin Dashboard

---
