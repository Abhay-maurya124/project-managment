import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Mail, BookOpen, Clock } from "lucide-react";
import { getAssignedStudentsData } from "../../store/slices/teacherSlice";
const AssignedStudents = () => {
  const dispatch = useDispatch();
  const { assignedStudents, loading } = useSelector((state) => state.teacher);
  useEffect(() => {
    dispatch(getAssignedStudentsData());
  }, [dispatch]);
  if (loading && assignedStudents.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center bg-white text-gray-900 border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Assigned Students
          </h1>
          <p className="text-gray-500 mt-2">
            Manage and view the students you are currently supervising.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3 shadow-sm">
          <div className="bg-indigo-50 p-2 rounded-md">
            <Users size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Assigned</p>
            <p className="font-semibold text-lg text-gray-900">{assignedStudents.length}</p>
          </div>
        </div>
      </div>
      {assignedStudents.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center">
          <div className="bg-white px-4 py-4 rounded-full mb-4 shadow-sm border border-gray-100">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Students Assigned</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You currently do not have any students assigned to your supervision. Pending requests can be accepted from the Pending Requests tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedStudents.map((student) => (
            <div 
              key={student._id} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-indigo-400 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl shadow-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{student.name}</h3>
                      <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium px-2 py-0.5 rounded-full bg-indigo-50 mt-1 border border-indigo-100">
                        Student
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-5">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-indigo-500" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  {student.department && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <BookOpen size={16} className="text-purple-500" />
                      <span>{student.department}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Latest Project</p>
                  {student.latestProject ? (
                    <div>
                      <h4 className="text-md font-medium text-gray-800 line-clamp-1">{student.latestProject.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`px-2 py-1 text-xs rounded-md font-medium border ${
                          student.latestProject.status === 'completed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : student.latestProject.status === 'approved' 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : student.latestProject.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {student.latestProject.status.charAt(0).toUpperCase() + student.latestProject.status.slice(1)}
                        </div>
                        {student.latestProject.deadline && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                            <Clock size={12} className="text-gray-400" />
                            {new Date(student.latestProject.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No project submitted yet</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AssignedStudents;
