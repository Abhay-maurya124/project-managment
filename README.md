# Project Management System (FYP Management)

A comprehensive, role-based Web Application designed to streamline the management of Final Year Projects (FYP) for university or college environments. This platform facilitates seamless communication and workflow between Students, Teachers (Supervisors), and Admins.

## 🚀 Features by Role

### 👨‍🎓 Student
- **Profile & Dashboard:** Track upcoming deadlines and project approval status.
- **Supervision Requests:** Browse available teachers and send supervision requests.
- **Project Proposals:** Submit project titles and descriptions for approval.
- **File Submissions:** Upload assignment documents and project files directly to the platform.
- **Notifications:** Receive email and in-app alerts regarding project status changes.

### 👨‍🏫 Teacher (Supervisor)
- **Dashboard:** Monitor all assigned students and active projects.
- **Request Management:** Accept or reject incoming supervision requests from students.
- **File Repository:** Centralized hub to view and securely download all files uploaded by assigned students.
- **Tracking:** Keep tabs on student progress against administrative deadlines.

### 👨‍💻 Administrator
- **User Management:** Complete CRUD operations to register and manage Students and Teachers.
- **Project Oversight:** Approve or reject student project proposals globally.
- **Deadline Management:** Create custom project deadlines, alerting specific students about incoming due dates.
- **Analytics:** High-level dashboard summarizing pending requests and completed projects.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (via Vite): Fast, modern UI components.
- **Tailwind CSS:** Fully responsive, utility-first styling for a sleek light-mode aesthetic.
- **Redux Toolkit:** Centralized state management for complex role-based data.
- **React Router:** For secure and rapid client-side routing.
- **Axios:** For robust HTTP API fetching.
- **Lucide React:** Beautiful, consistent iconography.

### Backend
- **Node.js & Express.js:** Scalable and robust RESTful API framework.
- **MongoDB & Mongoose:** NoSQL Database for handling flexible user arrays and relational sub-documents.
- **JWT (JSON Web Tokens):** Secure, cookie-based authentication & authorization protecting role-based API routes.
- **Multer:** Handles multipart/form-data for robust file uploads (PDFs, Images, etc.) saved locally.
- **Nodemailer:** Handles automated outbound SMTP emails (e.g., Request Approvals).
- **Bcrypt:** Secure password hashing.

---

## ⚙️ How It Works (Architecture)

1. **Authentication:** When a user logs in, the backend verifies their credentials, assigns a JWT HttpOnly cookie, and attaches their role (`Admin`, `Teacher`, `Student`).
2. **Role-Based UIs:** The React frontend automatically redirects the user to their designated dashboard, rendering only the Sidebar and Pages associated with their specific permissions.
3. **Relationships:** 
   - A `Student` requests a `Teacher`. 
   - Upon acceptance, the teacher's `_id` is populated across the student's `Project` documents.
   - Files are securely managed locally inside the `/backend/uploads` directory and are natively stream-downloaded via authorized backend API wrappers, preventing unauthorized URL access.

---

## 💻 How to Clone and Run Locally

Follow these steps to get a local development environment up and running.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd "Project management"
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` folder and populate it with your configuration:
```env
PORT=4000
FRONT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster...
JWT_SECRET_KEY=your_secret_key_here
JWT_EXPIRES=7d
COOKIE_EXPIRE=7

# Email Settings (for notifications)
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

Start the backend server:
```bash
npm start
```
*(The backend will run on http://localhost:4000)*

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

*(Ensure the frontend Axios configuration points to `http://localhost:4000` via its setup `src/lib/axios.js` or via a frontend `.env`)*

Start the frontend development server:
```bash
npm run dev
```
*(The frontend will run on http://localhost:5173)*

### 4. You're Good to Go!
Open your browser and navigate to `http://localhost:5173`. You can log in using predefined admin credentials, or create new students/teachers through the Admin portal!
