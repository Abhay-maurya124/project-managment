import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Users, GraduationCap, FolderKanban, AlertCircle, Plus, FileText } from "lucide-react";
import { getAlluser } from "../../store/slices/adminSlice";
import { fetchAllProjects } from "../../store/slices/projectSlice";
import { axiosInstance } from "../../lib/axios";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Alluser = [] } = useSelector((state) => state.admin);
  const { projects: reduxProjects = [] } = useSelector((state) => state.project);
  const [stats, setStats] = useState(null);
  const fetchDashboardStats = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/fetch-dashboard-stats");
      setStats(data.data); 
    } catch (err) {
      console.error("Stats fetch error", err);
    }
  };
  useEffect(() => {
    dispatch(getAlluser());
    dispatch(fetchAllProjects());
    setTimeout(() => {
      fetchDashboardStats();
    }, 0);
  }, [dispatch]);
  const chartData = useMemo(() => {
    const projectList = stats?.stats?.pendingProjects || stats?.projects || [];
    if (projectList.length === 0) return [];
    const distribution = projectList.reduce((acc, proj) => {
      const supervisorName =
        proj.supervisor?.name ||
        proj.student?.superVisor?.name || 
        "Unassigned";
      acc[supervisorName] = (acc[supervisorName] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(distribution).map((name) => ({
      name,
      count: distribution[name],
    }));
  }, [stats]);
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 pb-24 pt-12 px-8">
        <div className="max-w-7xl mx-auto text-white">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="opacity-80">Managing {reduxProjects.length} active projects and {Alluser.length} system users.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 -mt-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <TopStat title="Total Students" value={stats?.stats?.totalStudents} icon={GraduationCap} border="border-l-blue-400" bgColor="bg-blue-50" />
          <TopStat title="Total Teachers" value={stats?.stats?.totalTeachers} icon={Users} border="border-l-green-400" bgColor="bg-green-50" />
          <TopStat title="Pending Requests" value={stats?.stats?.pendingRequests} icon={AlertCircle} border="border-l-orange-400" bgColor="bg-orange-50" />
          <TopStat title="Active Projects" value={reduxProjects.length} icon={FolderKanban} border="border-l-yellow-400" bgColor="bg-yellow-50" />
          <TopStat title="Completed" value={stats?.stats?.completeProjects} icon={AlertCircle} border="border-l-red-400" bgColor="bg-red-50" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6 border-b pb-2">Project Distribution by Supervisor</h3>
            <div style={{ width: "100%", height: 300 }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      allowDecimals={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" fill="#003580" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic">No data available</div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6 border-b pb-2">Recent Projects</h3>
            <div className="space-y-4">
              {reduxProjects.slice(0, 5).map((proj) => (
                <div key={proj._id} className="flex items-center gap-3 text-sm border-b pb-2 last:border-0">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText size={16} /></div>
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate">{proj.title}</p>
                    <p className="text-gray-500 text-xs">{proj.student?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("/admin/students")} className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition-all">
              <Plus size={18} /> Add Student
            </button>
            <button onClick={() => navigate("/admin/teachers")} className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-green-700 transition-all">
              <Plus size={18} /> Add Teacher
            </button>
            <button onClick={() => navigate("/admin/projects")} className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-50 transition-all">
              <FileText size={18} /> View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const TopStat = ({ title, value, icon, border, bgColor }) => (
  <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${border} flex items-center gap-4`}>
    <div className={`p-3 rounded-lg ${bgColor}`}>
      {React.createElement(icon, { size: 20, className: "text-gray-700" })}
    </div>
    <div>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value || 0}</p>
    </div>
  </div>
);
export default AdminDashboard;