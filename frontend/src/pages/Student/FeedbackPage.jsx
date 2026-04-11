import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProjectFeedback } from "../../store/slices/studentSlice";
import { MessageSquare, User, Calendar, Loader2 } from "lucide-react";
const FeedbackPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { project, loading } = useSelector((state) => state.student);
  useEffect(() => {
    if (projectId) dispatch(getProjectFeedback(projectId));
  }, [dispatch, projectId]);
  const sortedFeedback = project?.feedback 
    ? [...project.feedback].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];
  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1e293b]">Supervisor Feedback</h1>
        <p className="text-sm text-gray-500 mb-8">Official reviews for: {project?.title || "Project"}</p>
        <div className="space-y-6">
          {sortedFeedback.length > 0 ? (
            sortedFeedback.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-5">
                <div className="hidden sm:flex p-3 bg-blue-50 text-blue-600 rounded-xl h-fit">
                  <MessageSquare size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{project?.supervisor?.name || "Supervisor"}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(f.createdAt).toDateString()}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-gray-700">
                    {f.comment}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
              No feedback found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FeedbackPage;