# 🏥 AI-Powered Hospital Command Centre

An intelligent hospital management web application designed to centralize hospital operations through a unified dashboard. The system helps manage patients, doctors, appointments, medical reports, prescriptions, and hospital monitoring activities.

## 📌 Project Overview

The AI-Powered Hospital Command Centre aims to improve hospital workflow visibility and simplify access to essential healthcare management functions through a centralized web interface.

The application uses a React-based frontend, a Node.js and Express backend, and MongoDB for data storage.

## ✨ Features

### 🩺 Patient Management
- Patient login and authentication
- Patient information management
- Patient monitoring dashboard
- Patient appointment access
- Medical reports and prescription viewing

### 👨‍⚕️ Doctor Management
- Doctor information management
- Doctor and department details
- Doctor examination workflow
- Patient examination management

### 📅 Appointment Management
- Appointment booking and management
- Patient appointment tracking
- Doctor-related appointment workflows

### 💊 Medical Management
- Medical report management
- Prescription creation and viewing
- Examination records
- Pharmacy management interface

### 📊 Hospital Dashboard
- Centralized dashboard
- Patient and hospital statistics
- Emergency management interface
- Bed and ICU management interface
- Disease prediction interface
- Laboratory and notification pages

### 🔐 Authentication
- Patient login
- Staff and doctor authentication
- Role-based access controls for protected backend routes

> Note: Features and AI-related functionality should be considered implemented only to the extent supported by the current application code. The disease prediction interface alone does not establish that a trained AI model is integrated.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic |
| HTML5 and CSS3 | Structure and styling |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Token (JWT) | Token-based authentication |
| Git and GitHub | Version control and source code hosting |

## 📂 Project Structure

```text
hospital-command-centre/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── package.json
│   └── server.js
├── src/
│   ├── components/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## ⚙️ Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git
- Visual Studio Code (recommended)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PRASANTHI123-STACK/hospital-command-centre.git
cd hospital-command-centre
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

Create a `backend/.env` file using the environment variable names expected by your backend configuration.

For example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Use your own secure credentials. Never commit `.env` files, passwords, database connection strings, or JWT secrets to GitHub.

### 4. Start the backend

From the `backend` directory, use the start script configured in `backend/package.json`. If it defines `start` as `node server.js`, run:

```bash
npm start
```

If the project uses Nodemon and defines a `dev` script, you can run:

```bash
npm run dev
```

### 5. Start the frontend

Open a second terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal, commonly:

```text
http://localhost:5173
```

Make sure MongoDB is accessible and the backend is running before testing features that use the API.

## 🔒 Security and Privacy

- Keep credentials and environment variables out of source control.
- Use protected backend routes for sensitive operations.
- Validate and authorize requests on the server.
- Do not commit real patient records or other confidential medical information.
- Use synthetic data for demonstrations and development.
- Do not use this project with real patient information until appropriate security, privacy, and clinical requirements have been reviewed.

## 🧪 Testing

Test the main workflows after starting the application:

- Patient login and logout
- Staff and doctor authentication
- Patient and doctor management
- Appointment management
- Medical reports and prescriptions
- Protected API access
- Database connectivity

## 🔮 Future Enhancements

- Integration of validated AI models for clinical decision support
- Real-time patient monitoring integrations
- Enhanced hospital analytics and reporting
- Automated notifications
- Expanded testing and deployment automation
- Improved security auditing and access logging

These are potential enhancements and are not claims that the functionality is already implemented.

## 👩‍💻 Author

**Prasanthi**

GitHub: [PRASANTHI123-STACK](https://github.com/PRASANTHI123-STACK)

## 📄 License

No license has been added yet. Usage and redistribution permissions should be defined before publishing this project for public reuse.