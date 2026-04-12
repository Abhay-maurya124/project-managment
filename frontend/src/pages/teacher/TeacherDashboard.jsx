import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherStats } from "../../store/slices/teacherSlice";
import { Clock, CheckCircle, Bell } from "lucide-react";
const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats } = useSelector((state) => state.teacher);
  useEffect(() => {
    dispatch(getTeacherStats());
  }, [dispatch]);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>
      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Pending Requests</p>
              <h2 className="text-3xl font-black">{dashboardStats?.totalPendingRequests || 0}</h2>
            </div>
            <Clock className="text-orange-500" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Completed Projects</p>
              <h2 className="text-3xl font-black">{dashboardStats?.completedProjects || 0}</h2>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Recent Alerts</p>
              <h2 className="text-3xl font-black">{dashboardStats?.recentNotification?.length || 0}</h2>
            </div>
            <Bell className="text-blue-500" size={40} />
          </div>
        </div>
      </div>
      {}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">Recent Notifications</div>
        <div className="divide-y">
          {dashboardStats?.recentNotification?.length > 0 ? (
            dashboardStats.recentNotification.map((n) => (
              <div key={n._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <span className="text-sm text-gray-600">{n.message}</span>
                <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">No recent notifications found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TeacherDashboard;