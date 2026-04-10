import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Plus, Calendar as CalendarIcon, User, X, Send } from "lucide-react";
import { fetchAllProjects } from "../../store/slices/projectSlice";
import { createDeadline } from "../../store/slices/deadlineSlice";
import { toggleDeadlineModel } from "../../store/slices/popupSlice";

const DeadlinesPage = () => {
  const dispatch = useDispatch();

  const { projects = [] } = useSelector((state) => state.project);
  const { isDeadlineModalOpen } = useSelector((state) => state.popup);
  const { loading: deadlineLoading } = useSelector((state) => state.deadline);

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    dueDate: ""
  });

  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.projectId) return;

    dispatch(createDeadline({
      projectId: formData.projectId,
      deadlineData: {
        name: formData.name,
        dueDate: formData.dueDate
      }
    })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setFormData({ projectId: "", name: "", dueDate: "" });
        dispatch(toggleDeadlineModel());
        dispatch(fetchAllProjects());
      }
    });
  };

  const filteredProjects = projects.filter(
    (proj) =>
      proj.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manage Deadlines</h1>
          <p className="text-sm text-gray-500">Create and monitor project deadlines</p>
        </div>
        <button
          onClick={() => dispatch(toggleDeadlineModel())}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <Plus size={18} /> Create/Update Deadline
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Search Deadlines</p>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by project or student..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-gray-700">Project Deadlines</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b">
                <th className="px-6 py-3 font-bold">Student</th>
                <th className="px-6 py-3 font-bold">Project Title</th>
                <th className="px-6 py-3 font-bold">Supervisor</th>
                <th className="px-6 py-3 font-bold">Deadline</th>
                <th className="px-6 py-3 font-bold">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((proj) => (
                <tr key={proj._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{proj.student?.name || "N/A"}</p>
                        <p className="text-xs text-gray-500">{proj.student?.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{proj.title}</td>
                  <td className="px-6 py-4">
                    {proj.supervisor ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                        {proj.supervisor.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded w-fit">
                      <CalendarIcon size={14} />
                      {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {proj.updatedAt ? new Date(proj.updatedAt).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDeadlineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Set Project Deadline</h2>
              <button
                onClick={() => dispatch(toggleDeadlineModel())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Select Project</label>
                <select
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  required
                >
                  <option value="">Select a project...</option>
                  {projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>{proj.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Deadline Label</label>
                <input
                  type="text"
                  placeholder="e.g. Phase 1 Submission"
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={deadlineLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg active:scale-95"
                >
                  {deadlineLoading ? "Processing..." : (
                    <>
                      <Send size={18} />
                      Update Project Deadline
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlinesPage;