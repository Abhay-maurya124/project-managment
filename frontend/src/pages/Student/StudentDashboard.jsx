import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentProject, fetchSupervisors, sendSupervisorRequest } from "../../store/slices/studentSlice";
import { 
  LayoutTemplate, 
  FileText, 
  Clock, 
  UserCheck, 
  Send, 
  X, 
  Loader2, 
  ExternalLink 
} from "lucide-react";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { project, supervisors, loading } = useSelector((state) => state.student);
  
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [message, setMessage] = useState("I am interested in having you as my project supervisor.");

  useEffect(() => {
    dispatch(getStudentProject());
    dispatch(fetchSupervisors());
  }, [dispatch]);

  const handleSendRequest = () => {
    if (!selectedTeacher) return;
    dispatch(sendSupervisorRequest({ teacherId: selectedTeacher._id, message }));
    setSelectedTeacher(null);
  };

  if (loading && !project) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen space-y-8">
      <h1 className="text-2xl font-bold text-[#1e293b]">Student Dashboard</h1>

      {/* Top Stats Cards (Matches Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutTemplate size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Status</p>
            <p className="text-lg font-bold text-[#1e293b]">{project ? project.status : "No Project"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Files Uploaded</p>
            <p className="text-lg font-bold text-[#1e293b]">{project?.files?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</p>
            <p className="text-lg font-bold text-[#1e293b]">{project?.deadline || "Not Set"}</p>
          </div>
        </div>
      </div>

      {/* Project Details Section (Matches Image 3) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-800">Project Details</h2>
        </div>
        <div className="p-6">
          {project ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Project Title</label>
                  <p className="font-semibold text-gray-800">{project.title}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                  <div className="mt-1">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full capitalize">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Deadline</label>
                  <p className="font-semibold text-gray-800 italic">No deadline set</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Created</label>
                  <p className="font-semibold text-gray-800">
                    {new Date(project.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{project.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No project submitted yet.</p>
          )}
        </div>
      </div>

      {/* Available Supervisors Section (Matches Image 3 Footer) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-800">Available Supervisors</h2>
          <p className="text-xs text-blue-600 mt-1">Browse and request supervision from available faculty members</p>
        </div>
        <div className="divide-y divide-gray-50">
          {supervisors?.length > 0 ? (
            supervisors.map((sup) => (
              <div key={sup._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{sup.name}</h4>
                    <p className="text-xs text-gray-500">{sup.department} • {sup.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTeacher(sup)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
                >
                  <Send size={14} /> Request
                </button>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm">No supervisors available.</div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Request {selectedTeacher.name}</h2>
              <button onClick={() => setSelectedTeacher(null)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>
            <textarea 
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4 bg-gray-50"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendRequest}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;