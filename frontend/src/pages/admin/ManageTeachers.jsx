import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Edit2, Trash2, UserX, GraduationCap, Users } from "lucide-react";
import { getAlluser, deleteTeacher } from "../../store/slices/adminSlice.js";
import AddTeacher from "../../components/modal/AddTeacher";
const ManageTeachers = () => {
  const dispatch = useDispatch();
  const { Alluser } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  useEffect(() => {
    dispatch(getAlluser());
  }, [dispatch]);
  const teachers = useMemo(() => {
    if (!Alluser || !Array.isArray(Alluser)) return [];
    return Alluser.filter((u) => u && u.role?.toLowerCase() === "teacher");
  }, [Alluser]);
  const departments = useMemo(() => {
    const depts = teachers.map(t => t.department).filter(Boolean);
    return Array.from(new Set(depts));
  }, [teachers]);
  const filteredTeachers = teachers.filter(teacher => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = 
      (teacher.name || "").toLowerCase().includes(searchLower) ||
      (teacher.email || "").toLowerCase().includes(searchLower);
    const matchFilter = filterDept === "all" || teacher.department === filterDept;
    return matchSearch && matchFilter;
  });
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Faculty</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of all registered teachers and their supervision capacity.
          </p>
        </div>
        <button
          onClick={() => { setEditingTeacher(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 font-medium"
        >
          <Plus size={20} /> Add New Teacher
        </button>
      </div>
      {}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 bg-white min-w-50"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
      </div>
      {}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expertise</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 u ,ppercase tracking-wider text-center">Quota</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <UserX size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No faculty members found</p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{teacher.name}</div>
                      <div className="text-sm text-gray-500">{teacher.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {teacher.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-62.5">
                        {teacher.experties?.length > 0 ? (
                          teacher.experties.map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <Users size={14} className="text-gray-400" />
                          {teacher.maxStudents || 0}
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Limit</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingTeacher(teacher); setShowModal(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => { setTeacherToDelete(teacher); setShowDeleteModal(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {}
      <AddTeacher 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        editingTeacher={editingTeacher} 
      />
      {showDeleteModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Teacher?</h2>
            <p className="text-gray-500 text-center mb-6">
              You are about to remove <span className="font-semibold text-gray-700">{teacherToDelete?.name}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { dispatch(deleteTeacher(teacherToDelete._id)); setShowDeleteModal(false); }} 
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageTeachers;