import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupervisors, sendSupervisorRequest } from "../../store/slices/studentSlice";
import { UserCheck, Mail, BookOpen, Send, X, Loader2 } from "lucide-react";
const SupervisorPage = () => {
  const dispatch = useDispatch();
  const { supervisors, loading } = useSelector((state) => state.student);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [message, setMessage] = useState("I am interested in having you as my project supervisor.");
  useEffect(() => {
    dispatch(fetchSupervisors());
  }, [dispatch]);
  const handleSendRequest = () => {
    if (!selectedTeacher) return;
    dispatch(sendSupervisorRequest({ teacherId: selectedTeacher._id, message }));
    setSelectedTeacher(null);
  };
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Supervisors</h1>
      {supervisors?.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No supervisors available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supervisors.map((sup) => (
            <div key={sup._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <UserCheck size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 text-center mb-1">{sup.name}</h3>
              <p className="text-sm text-gray-500 text-center mb-4">{sup.department}</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" /> {sup.email}
                </div>
                {sup.expertise && (
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <BookOpen size={16} className="text-gray-400 mt-1" />
                    <div className="flex flex-wrap gap-1">
                      {sup.expertise.map((exp, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{exp}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setSelectedTeacher(sup)}
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Send size={16} /> Request Supervisor
              </button>
            </div>
          ))}
        </div>
      )}
      {}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Request {selectedTeacher.name}</h2>
              <button onClick={() => setSelectedTeacher(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Send a message to introduce your project idea.</p>
            <textarea 
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              onClick={handleSendRequest}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
            >
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default SupervisorPage;