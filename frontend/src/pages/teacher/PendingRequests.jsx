import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getSupervisorRequests, 
  acceptStudentRequest, 
  rejectStudentRequest 
} from "../../store/slices/teacherSlice";
import { Check, X, User, BookOpen, Calendar } from "lucide-react";
const PendingRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.teacher);
  const { authUser } = useSelector((state) => state.auth); 
  useEffect(() => {
    if (authUser?._id) {
      console.log("Teacher ID found, fetching requests...");
      dispatch(getSupervisorRequests(authUser._id));
    } else {
      console.warn("AuthUser is still null. Ensure checkAuth is called in App.jsx");
    }
  }, [dispatch, authUser?._id]);
  const handleAccept = (id) => {
    if (window.confirm("Are you sure you want to accept this student?")) {
      dispatch(acceptStudentRequest(id));
    }
  };
  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      dispatch(rejectStudentRequest(id));
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Supervision Requests</h1>
        <p className="text-gray-500">Review and manage student applications for your supervision.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-bold">
              <th className="px-6 py-4">Student Info</th>
              <th className="px-6 py-4">Project Details</th>
              <th className="px-6 py-4">Request Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{req.student?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{req.student?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <BookOpen size={16} className="text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {req.latestProject?.title || "No Project Submitted Yet"}
                        </p>
                        <p className="text-xs text-gray-400 italic">
                          Status: {req.latestProject?.status || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {req.status === "pending" || !req.status ? (
                        <>
                          <button 
                            onClick={() => handleAccept(req._id)}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Accept"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleReject(req._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          req.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {req.status === "accepted" ? "Accepted" : "Rejected"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                  {loading ? "Loading requests..." : "No pending requests at the moment."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PendingRequests;