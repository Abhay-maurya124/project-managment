import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createStudent, UpdateStudent } from "../../store/slices/adminSlice.js";
const AddStudent = ({ isOpen, onClose, editingStudent }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", email: "", department: "" ,password:""});
  useEffect(() => {
    if (editingStudent) {
      setTimeout(() => {
        setFormData({
          name: editingStudent.name || "",
          email: editingStudent.email || "",
          password: editingStudent.password || "",
          department: editingStudent.department || "",
        });
      }, 0);
    } else {
      setTimeout(() => {
        setFormData({ name: "", email: "", department: "" });
      }, 0);
    }
  }, [editingStudent]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      dispatch(UpdateStudent({ id: editingStudent._id, data: formData }));
    } else {
      dispatch(createStudent(formData));
    }
    onClose();
  };
  if (!isOpen) return null;
  return (
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
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              required
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password || ""}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.department || ""}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-lg"
            >
              {editingStudent ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddStudent;