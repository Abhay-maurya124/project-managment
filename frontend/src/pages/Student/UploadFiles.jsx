import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProjectFiles } from "../../store/slices/studentSlice";
import { Upload, File, X, Check, Download, Loader2 } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
const UploadFiles = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const { project, loading } = useSelector((state) => state.student);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };
  const handleUpload = () => {
    if (!project?._id) {
      toast.error("No active project found to upload files.");
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file); 
    });
    dispatch(uploadProjectFiles({ projectId: project._id, formData }));
    setSelectedFiles([]);
  };
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axiosInstance.get(
        `/student/download/${project._id}/${fileId}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "project-file");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download file");
    }
  };
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto min-h-screen">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Materials</h2>
        {}
        <div 
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all mb-6"
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={40} />
          <p className="text-gray-600 font-medium">Click to browse or drag and drop files</p>
          <p className="text-xs text-gray-400 mt-2">Max 10 files per upload</p>
          <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} />
        </div>
        {}
        {selectedFiles.length > 0 && (
          <div className="space-y-3 mb-8">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Ready to upload:</p>
            {selectedFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <File size={18} className="text-blue-500" />
                  <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                </div>
                <button onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))}>
                  <X size={18} className="text-red-400 hover:text-red-600" />
                </button>
              </div>
            ))}
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Check size={18} />} 
              {loading ? "Uploading..." : "Confirm Upload"}
            </button>
          </div>
        )}
        {}
        <h3 className="text-lg font-bold text-gray-800 mb-4">Project Archive</h3>
        <div className="grid grid-cols-1 gap-3">
          {project?.files?.length > 0 ? (
            project.files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg"><File size={16} className="text-gray-400" /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{file.originalName}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownload(file._id, file.originalName)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Download File"
                >
                  <Download size={20} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-50 rounded-2xl">
              No files uploaded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default UploadFiles;