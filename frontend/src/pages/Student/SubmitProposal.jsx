import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitProposal } from "../../store/slices/studentSlice";
import { Send, FileCheck, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SubmitProposal = () => {
  const dispatch = useDispatch();
  const { project, loading } = useSelector((state) => state.student);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitProposal(formData));
  };

  // Logic: Show "Already Submitted" ONLY if project exists AND is NOT rejected
  if (project && project.status !== "rejected") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
          <FileCheck size={48} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Proposal Already Submitted</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Your project "{project.title}" is currently <strong>{project.status}</strong>. 
          You can track its progress or upload files from your dashboard.
        </p>
        <Link 
          to="/student/dashboard" 
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Submit Project Proposal</h2>
          {project?.status === "rejected" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={18} />
              <span>Your previous proposal was rejected. You can now submit a new one.</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Project Title</label>
            <input
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g., E-commerce App using MERN"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Detailed Description</label>
            <textarea
              required
              rows="5"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
              placeholder="Explain the features, tech stack, and goals of your project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : <><Send size={18} /> Submit Proposal</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitProposal;