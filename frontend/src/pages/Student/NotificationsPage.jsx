import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentProject } from "../../store/slices/studentSlice";
import { Bell, Info, CheckCircle, Calendar } from "lucide-react";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { project, loading } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(getStudentProject());
  }, [dispatch]);

  const notifications = [];
  if (project) {
    if (project.status === "pending") {
      notifications.push({
        id: "status",
        title: "Proposal Status",
        message: "Your proposal is currently pending approval.",
        type: "info",
        icon: <Info size={20} />,
      });
    }
    if (project.feedback?.length > 0) {
      notifications.push({
        id: "feedback",
        title: "New Feedback",
        message: `You have ${project.feedback.length} new comment(s) on your project.`,
        type: "success",
        icon: <CheckCircle size={20} />,
      });
    }
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Syncing...</p>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((note) => (
              <div key={note.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit">{note.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800">{note.title}</h3>
                  <p className="text-sm text-gray-600">{note.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Bell size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;