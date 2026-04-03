import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Filter, Edit2, Trash2, BookOpen } from "lucide-react";
import { 
  getAlluser, 
  createStudent, 
  UpdateStudent, 
  deleteStudent 
} from "../../store/slices/adminSlice.js";

const ManageStudents = () => {
  const dispatch = useDispatch();
  const { users, projects } = useSelector((state) => state.admin);
  
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: "", email: "", department: "" });

  useEffect(() => {
    dispatch(getAlluser());
  }, [dispatch]);

  const students = useMemo(() => {
    if (!users) return [];
    const studentUsers = users.filter((u) => u.role?.toLowerCase() === "student");
    
    return studentUsers.map(student => {
      const project = (projects || []).find(p => p.student?.id === student._id || p.student === student._id);
      return {
        ...student,
        projectTitle: project?.title || "No Project",
        supervisor: project?.supervisor?.name || "Unassigned",
        projectStatus: project?.status || "Pending"
      };
    });
  }, [users, projects]);

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

  const handleClose = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({ name: "", email: "", department: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      dispatch(UpdateStudent({ id: editingStudent._id, data: formData }));
    } else {
      dispatch(createStudent(formData));
    }
    handleClose();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-sm text-gray-500">Total Students: {filteredStudents.length}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          <Plus size={20} /> Add New Student
        </button>
      </div>

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

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredStudents.map((student) => (
          <div key={student._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{student.name}</h3>
                <p className="text-xs text-gray-500">{student.email}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded uppercase font-bold">
                {student.department}
              </span>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen size={14} /> {student.projectTitle}
              </div>
            </div>
            <div className="flex gap-2 border-t pt-3">
              <button 
                onClick={() => { setEditingStudent(student); setFormData(student); setShowModal(true); }}
                className="flex-1 flex justify-center items-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button 
                onClick={() => { setStudentToDelete(student); setShowDeleteModal(true); }}
                className="flex-1 flex justify-center items-center gap-1 py-2 bg-red-50 text-red-600 rounded-md text-xs font-medium"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student Info</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Department</th>
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
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {student.department}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-800 truncate max-w-[200px]">{student.projectTitle}</div>
                  <div className="text-[10px] text-gray-400">Status: {student.projectStatus}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3 text-gray-400">
                    <button onClick={() => { setEditingStudent(student); setFormData(student); setShowModal(true); }} className="hover:text-blue-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => { setStudentToDelete(student); setShowDeleteModal(true); }} className="hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingStudent ? "Edit Student" : "Add New Student"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={handleClose} className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-lg">
                  {editingStudent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-gray-500 text-sm mb-6">
              You are about to delete <span className="font-bold text-gray-800">{studentToDelete?.name}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button onClick={() => { dispatch(deleteStudent(studentToDelete._id)); setShowDeleteModal(false); }} className="flex-1 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg shadow-lg">
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