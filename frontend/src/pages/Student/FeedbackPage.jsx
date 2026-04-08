import React from "react";
import { useSelector } from "react-redux";
import { MessageSquare, Star, Info, User } from "lucide-react";

const FeedbackPage = () => {
  const { project } = useSelector((state) => state.student);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Supervisor Feedback</h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {project?.feedback?.length > 0 ? (
          project.feedback.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full h-fit">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-800">Feedback Reference: {f.supervisor?.slice(-6) || 'N/A'}</span>
                  <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded-full">{f.type || 'comment'}</span>
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{f.message}"</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Info size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No feedback received for your current project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;