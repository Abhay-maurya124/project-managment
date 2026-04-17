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

---

## 🎤 Interview Preparation Guide

### How to Explain This Project (The Pitch)
"I developed a **Full-Stack Project Management System** designed to automate the workflow of Final Year Projects in universities. I built it using the **MERN stack** (MongoDB, Express, React, Node).

The problem I solved was the manual, often messy process of student-teacher matching and file tracking. My system handles **Role-Based Access Control (RBAC)** for three distinct users: Admins, Teachers, and Students. 

**Key highlights of my implementation include:**
- **Secure Authentication:** Used JWT stored in HttpOnly cookies with `SameSite=None` configurations to support cross-site security.
* **Complex State Management:** Utilized Redux Toolkit to sync user roles and project statuses across the entire frontend.
* **Scalable File Systems:** Integrated Multer with a secure streaming download system to ensure only authorized supervisors can access student submissions.
* **Dynamic Analytics:** Built a custom Admin dashboard using Recharts to visualize project distribution and completion rates."

---

## ❓ Advanced Full-Stack Interview Questions (Fresher Focus)

### 🚀 Architecture & Optimization
1. **How do you handle "Prop Drilling" in complex React apps, and why choose Redux over Context API for this project?** (Context is for static data; Redux manages high-frequency state updates like Dashboard stats).
2. **Explain the "Vite Build" process.** How does it use Rollup/Rolldown under the hood for production bundling?
3. **How would you optimize the DashboardCharts for high-volume data?** (Using `useMemo` for data transformation and lazy-loading chart components).
4. **Explain the benefits of "Modular Routing" in Express.** Why separate `adminRouter` from `studentRouter`? (Maintainability, middleware scoping, and clean code).
5. **How does your `asyncHandler` middleware improve code quality?** (Eliminates try-catch boilerplate and centralizes error propagation).
6. **What is the significance of the `dist` folder in your deployment?** (It contains the minified, production-ready static assets generated by Vite).

### 🔐 Security Deep-Dive
7. **How do you defend against "Cross-Site Request Forgery (CSRF)" in your token system?** (Using `SameSite=Strict` or `SameSite=None` with `Secure`, and potentially anti-CSRF tokens).
8. **Explain the difference between `JWT` stored in a cookie vs. `JWT` in a bearer token (Authorization header).** (HttpOnly cookies prevent XSS theft; Header tokens required for mobile apps/multi-domain).
9. **How would you implement "Refresh Tokens" for long-lived sessions?** (Storing refresh tokens in DB and short-lived access tokens in memory/cookie).
10. **What is "Role-Based Access Control (RBAC)" and how do you enforce it on the backend?** (A middleware that checks `req.user.role` against an allowed array before calling `next()`).
11. **How do you prevent "Insecure Direct Object Reference (IDOR)" in file downloads?** (Check if the downloading user is the supervisor of the student who owns the file before sending).
12. **Why is `Password Hashing` (Bcrypt) not enough? Why do we use "Salt"?** (To prevent Rainbow Table attacks by making identical passwords have different hashes).

### ⚛️ Frontend Engineering (React & Redux)
13. **What is a "Higher-Order Component" or "Render Props" pattern, and did you use any in this project?** (Your `ProtectedRoute` acts as an HOC to gate routes).
14. **Explain Redux "Immutability". How does Redux Toolkit use Immer internally?** (Allows "mutating" logic syntax while creating a new state object under the hood).
15. **How do you handle "Race Conditions" in API requests using React?** (Using clean-up functions in `useEffect` or `AbortController` in Axios).
16. **What is the "Virtual DOM" and how does React optimize rendering?** (Diffing algorithm to minimize actual DOM updates).
17. **Why use `withCredentials: true` in your Axios configuration?** (Crucial for sending cookies across different origins like Netlify to Vercel).
18. **Explain the "Cleanup Function" in `useEffect`. When is it triggered?** (On component unmount or before the next effect run).

### 🖥️ Backend Performance (Node & MongoDB)
19. **Explain the "Node.js Event Loop". How does it handle file uploads without blocking?** (Delegates I/O to worker threads via Libuv).
20. **What are "Mongoose Middlewares" (Pre/Post hooks)?** Give an example. (Using `.pre('save')` to hash passwords).
21. **How do you handle "Large File Uploads" in a scalable way?** (Streaming to Cloudinary or S3 instead of keeping buffers in RAM).
22. **Explain "Aggregation Pipelines" in MongoDB.** How would you use them for the Admin Dashboard? (To count pending projects grouped by departments).
23. **What is "Database Indexing"? Which fields in your User schema should be indexed?** (The `email` field, to speed up login lookups).
24. **How do you handle "Concurrency" if two students try to update the same project simultaneously?** (Optimistic concurrency control using version keys in Mongoose).

### ☁️ Deployment & Cloud
25. **What is "CORS" and why is it a browser-only restriction?** (Security header that prevents unauthorized cross-origin requests).
26. **Why did your build fail on Vercel/Netlify due to "Case Sensitivity"?** (Windows/macOS are case-insensitive; Linux build servers are strictly case-sensitive).
27. **Explain "CI/CD" (Continuous Integration/Continuous Deployment) in the context of your project.** (Pushing to GitHub triggers automatic builds on Netlify).
28. **How do you manage "Sensitive API Keys" in production?** (Secret management in Netlify/Vercel settings, never commited to Git).
29. **What is the difference between "Monolithic" and "Microservices" architecture?** (Your project is a Monolith; easier to manage for small teams).
30. **How would you scale this backend to 1 million users?** (Load balancing, DB sharding, and adding a Redis cache layer for dashboard stats).

### 🧠 Problem Solving
31. **How did you debug the "Please login to access this resource" error?** (Inspecting cookie flags and browser network logs for `set-cookie` headers).
32. **What is "Lazy Loading" and why is it important for the frontend?** (Reduces initial load time by only loading code needed for the current route).
33. **Explain "Dependency Injection" in the context of React.** (Passing props or using Context to provide services/data to components).
34. **How do you handle "API Versioning"?** (Using `/api/v1/...` routes to prevent breaking changes).
35. **Explain the "Single Source of Truth" principle in Redux.** (All global state exists in one central store).
36. **What is "Server-Side Rendering (SSR)" vs "Client-Side Rendering (CSR)"?** (Your app is CSR; provides a faster, app-like experience).
37. **How do you handle "Session Persistence"?** (Using `redux-persist` to save the store in `localStorage` or `sessionStorage`).
38. **What is "Schema Validation" in Mongoose?** (Ensuring data types and required fields before saving to DB).
39. **Explain "Throttling" vs "Debouncing".** (Throttling limits frequency; Debouncing waits for a pause—useful for search bars).
40. **How do you perform "Database Migrations" in NoSQL?** (Scripting updates or adding default values to Mongoose schemas).
