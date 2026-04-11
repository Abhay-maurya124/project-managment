import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Filter, Edit2, Trash2, BookOpen, UserX } from "lucide-react";
import { getAlluser, deleteStudent, getAllProjects } from "../../store/slices/adminSlice.js";
import AddStudent from "../../components/modal/AddStudent.jsx";
const ManageStudents = () => {
  const dispatch = useDispatch();
  const { Alluser, allProjects } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  useEffect(() => {
    dispatch(getAlluser());
    dispatch(getAllProjects());
  }, [dispatch]);
  const students = useMemo(() => {
    if (!Alluser || !Array.isArray(Alluser)) return [];
    return Alluser.filter(u => u.role?.toLowerCase() === "student").map((student) => {
      const project = (allProjects || []).find(p => p.student?._id === student._id || p.student === student._id);
      const supervisorDisplayName =
        project?.supervisor?.name ||
        student.superVisor?.name ||
        "Unassigned";
      return {
        ...student,
        projectTitle: project?.title || "No Project",
        supervisorName: supervisorDisplayName,
        projectStatus: project?.status || "Not Submitted",
      };
    });
  }, [Alluser, allProjects]);
  const departments = useMemo(() => {
    const depts = students.map(s => s.department).filter(Boolean);
    return Array.from(new Set(depts));
  }, [students]);
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      (student.name || "").toLowerCase().includes(searchLower) ||
      (student.email || "").toLowerCase().includes(searchLower);
    const matchFilter = filterDept === "all" || student.department === filterDept;
    return matchSearch && matchFilter;
  });
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "bg-green-100 text-green-700";
      case "approved": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "not submitted": return "bg-gray-100 text-gray-500 font-normal italic";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  const getSupervisorColor = (name) => {
    if (!name || name === "Unassigned") return "bg-gray-100 text-gray-500";
    return "bg-indigo-50 text-indigo-700 border border-indigo-100";
  };
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-sm text-gray-500">Total Students: {filteredStudents.length}</p>
        </div>
        <button
          onClick={() => { setEditingStudent(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          <Plus size={20} /> Add New Student
        </button>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      {}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <UserX size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No students found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Dept</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Supervisor</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Project</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-semibold">
                      {student.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSupervisorColor(student.supervisor)}`}>
                      {student.supervisorName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800 truncate max-w-50">{student.projectTitle}</div>
                    <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${getStatusColor(student.projectStatus)}`}>
                      {student.projectStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3 text-gray-400">
                      <button
                        onClick={() => { setEditingStudent(student); setShowModal(true); }}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => { setStudentToDelete(student); setShowDeleteModal(true); }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {}
      <AddStudent
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingStudent={editingStudent}
      />
      {}
      {showDeleteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl">
            <Trash2 size={32} className="text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Are you sure?</h2>
            <p className="text-gray-500 text-sm mb-6">Deleting {studentToDelete?.name} cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button
                onClick={() => { dispatch(deleteStudent(studentToDelete._id)); setShowDeleteModal(false); }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageStudents;