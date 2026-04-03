import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Dashboard Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitProposal from "./pages/student/SubmitProposal";
import UploadFiles from "./pages/student/UploadFiles";
import SupervisorPage from "./pages/student/SupervisorPage";
import FeedbackPage from "./pages/student/FeedbackPage";
import NotificationsPage from "./pages/student/NotificationsPage";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import PendingRequests from "./pages/teacher/PendingRequests";
import AssignedStudents from "./pages/teacher/AssignedStudents";
import TeacherFiles from "./pages/teacher/TeacherFiles";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import AssignSupervisor from "./pages/admin/AssignSupervisor";
import DeadlinesPage from "./pages/admin/DeadlinesPage";
import ProjectsPage from "./pages/admin/ProjectsPage";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);

  if (isCheckingAuth) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    const redirectPath = 
      authUser.role === "Admin" ? "/admin" : 
      authUser.role === "Teacher" ? "/teacher" : "/student";
    return <Navigate to={redirectPath} replace />;
}
  return <Outlet />;
};

const App = () => {
  const dispatch = useDispatch();
  const { isCheckingAuth } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) return null;
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="assign-supervisor" element={<AssignSupervisor />} />
            <Route path="deadlines" element={<DeadlinesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
          </Route>
        </Route>

        {/* Teacher Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
          <Route path="/teacher" element={<DashboardLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="pending-requests" element={<PendingRequests />} />
            <Route path="assigned-students" element={<AssignedStudents />} />
            <Route path="files" element={<TeacherFiles />} />
          </Route>
        </Route>

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route path="/student" element={<DashboardLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="submit-proposal" element={<SubmitProposal />} />
            <Route path="upload-files" element={<UploadFiles />} />
            <Route path="supervisor" element={<SupervisorPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;