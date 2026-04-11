import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects, approveProjectAction, updateProjectStatusAction } from "../../store/slices/adminSlice";
import { CheckCircle, XCircle, FileText, ExternalLink, Loader2 } from "lucide-react";
const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { allProjects, loading } = useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);
  const pendingProjects = allProjects?.filter((p) => p.status === "pending") || [];
  const handleAction = (id, status) => {
    const message = status === "approved" ? "Approve this project?" : "Reject this project?";
    if (window.confirm(message)) {
      if (status === "approved") {
        dispatch(approveProjectAction(id));
      } else {
        dispatch(updateProjectStatusAction({ id, status: "rejected" }));
      }
    }
  };
  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Project Proposals</h1>
        <p className="text-gray-500 mb-8">Review and approve student project ideas to proceed with supervisor assignment.</p>
        {pendingProjects.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center shadow-sm border">
            <p className="text-gray-400 font-medium">No pending proposals found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingProjects.map((project) => (
              <div key={project._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Proposal</span>
                    <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Submitted by: <span className="font-medium text-gray-800">{project.student?.name}</span></p>
                  {}
                  {project.projectFile && (
                    <a 
                      href={project.projectFile} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 text-sm hover:underline font-medium"
                    >
                      <FileText size={16} /> View Project Idea File <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleAction(project._id, "rejected")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-semibold"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(project._id, "approved")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-md shadow-green-100 font-semibold"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectsPage;