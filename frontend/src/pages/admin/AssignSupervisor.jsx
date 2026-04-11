import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAlluser, getAllProjects, assignSupervisorAction } from "../../store/slices/adminSlice";
import { UserCheck, GraduationCap, Users, Send } from "lucide-react";
const AssignSupervisor = () => {
  const dispatch = useDispatch();
  const { Alluser, allProjects, loading } = useSelector((state) => state.admin);
  const [formData, setFormData] = useState({ studentId: "", supervisorId: "" });
  useEffect(() => {
    dispatch(getAlluser());
    dispatch(getAllProjects());
  }, [dispatch]);
  const students = useMemo(() => {
    return Alluser.filter(u => {
      const userProject = allProjects.find(p => p.student?._id === u._id);
      return u.role === "Student" && userProject?.status === "approved";
    });
  }, [Alluser, allProjects]);
  const teachers = useMemo(() => 
    Alluser.filter(u => u.role === "Teacher"), 
  [Alluser]);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(assignSupervisorAction(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setFormData({ studentId: "", supervisorId: "" });
      }
    });
  };
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <UserCheck size={28} />
            <div>
              <h1 className="text-xl font-bold">Assign Supervisor</h1>
              <p className="text-blue-100 text-sm">Pair approved projects with teachers</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <GraduationCap size={16} /> Select Student
            </label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            >
              <option value="">-- Choose a Student --</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Users size={16} /> Select Teacher
            </label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={formData.supervisorId}
              onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
              required
            >
              <option value="">-- Choose a Teacher --</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.name} - Exp: {t.experties?.join(", ")}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-blue-300"
          >
            {loading ? "Processing..." : <><Send size={18} /> Confirm Assignment</>}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AssignSupervisor;