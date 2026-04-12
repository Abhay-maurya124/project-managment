import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTeacher, UpdateTeacher } from "../../store/slices/adminSlice.js";
const AddTeacher = ({ isOpen, onClose, editingTeacher }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    experties: "",
    maxStudents: 5,
  });
  useEffect(() => {
    if (editingTeacher) {
      setTimeout(() => {
        setFormData({
          name: editingTeacher.name || "",
          email: editingTeacher.email || "",
          password: "",
          department: editingTeacher.department || "",
          experties: Array.isArray(editingTeacher.experties) 
            ? editingTeacher.experties.join(", ") 
            : editingTeacher.experties || "",
          maxStudents: editingTeacher.maxStudents || 5,
        });
      }, 0);
    } else {
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "", department: "", experties: "", maxStudents: 5 });
      }, 0);
    }
  }, [editingTeacher, isOpen]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTeacher) {
      dispatch(UpdateTeacher({ id: editingTeacher._id, data: formData }));
    } else {
      dispatch(createTeacher(formData));
    }
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            {editingTeacher ? "Edit Teacher Profile" : "Register New Teacher"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
              <input
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
              <input
                required
                type="email"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {!editingTeacher && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1"> Password</label>
                <input
                  required
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}
          </div>
          <hr className="border-gray-100" />
          {}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
              <input
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                value={formData.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expertise (e.g. Java, Python)</label>
              <input
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                placeholder="Separate with commas"
                value={formData.experties || ""}
                onChange={(e) => setFormData({ ...formData, experties: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Supervisions</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white font-semibold hover:bg-green-700 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95">
              {editingTeacher ? "Save Changes" : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddTeacher;