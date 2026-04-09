import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats, fetchSupervisors, sendSupervisorRequest } from "../../store/slices/studentSlice";
import {
  LayoutTemplate, FileText, Clock, Send, Loader2, MessageSquare, AlertCircle, Bell
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { project, supervisors, stats, loading } = useSelector((state) => state.student);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [message, setMessage] = useState("I am interested in having you as my project supervisor.");

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(fetchSupervisors());
  }, [dispatch]);

  const handleSendRequest = () => {
    if (!selectedTeacher) return;
    dispatch(sendSupervisorRequest({ teacherId: selectedTeacher._id, message }));
    setSelectedTeacher(null);
  };

  const chartData = [
    { name: "Files", value: project?.files?.length || 0 },
    { name: "Feedback", value: project?.feedback?.length || 0 },
    { name: "Deadlines", value: stats?.upcomingDeadlines?.length || 0 },
  ];
  
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  if (loading && !project) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e293b]">Dashboard</h1>
        <div className="px-4 py-2 bg-white rounded-lg border border-gray-100 text-sm font-medium text-gray-600 shadow-sm">
          Welcome back, {project?.student?.name || "Student"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<LayoutTemplate size={20} />} color="blue" label="Status" value={project?.status || "N/A"} />
        <StatCard icon={<FileText size={20} />} color="green" label="Files" value={project?.files?.length || 0} />
        <StatCard icon={<MessageSquare size={20} />} color="orange" label="Feedback" value={project?.feedback?.length || 0} />
        <StatCard icon={<Clock size={20} />} color="purple" label="Supervisor" value={project?.supervisor?.name || "Pending"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <LayoutTemplate className="text-blue-600" size={18} /> Activity Distribution
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Bell className="text-blue-500" size={18} /> Recent Notifications
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {stats?.notifications?.length > 0 ? (
                stats.notifications.map((note, i) => (
                  <div key={i} className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <Info size={16} className="text-blue-500" />
                    <p className="text-sm text-gray-700">{note.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-400 py-4">All caught up!</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">Quick Request</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {supervisors?.slice(0, 5).map((sup) => (
              <div key={sup._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {sup.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{sup.name}</h4>
                    <p className="text-[9px] text-gray-400 uppercase">{sup.department}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTeacher(sup)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Send size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Request {selectedTeacher.name}</h2>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4 bg-gray-50"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setSelectedTeacher(null)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase">Cancel</button>
              <button onClick={handleSendRequest} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs uppercase">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, color, label, value }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
    <div className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl`}>{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

export default StudentDashboard;