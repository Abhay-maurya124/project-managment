import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Download, File, Image, Search, Calendar, Folder } from "lucide-react";
import { getTeacherFilesData } from "../../store/slices/teacherSlice";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const getFileIcon = (fileType) => {
  if (fileType.includes("image")) return <Image size={24} className="text-pink-500" />;
  if (fileType.includes("pdf")) return <FileText size={24} className="text-red-500" />;
  return <File size={24} className="text-blue-500" />;
};

const TeacherFiles = () => {
  const dispatch = useDispatch();
  const { teacherFiles, loading } = useSelector((state) => state.teacher);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getTeacherFilesData());
  }, [dispatch]);

  const handleDownload = async (projectId, fileId, fileName) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/download/${projectId}/${fileId}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "project-file");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Failed to download file");
    }
  };

  const filteredFiles = teacherFiles.filter((file) => 
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && teacherFiles.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-xl border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
            Student Files Repository
          </h1>
          <p className="text-gray-500 mt-2">
            Access and manage files uploaded by your assigned students.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm transition-all"
            placeholder="Search by file, project, or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {teacherFiles.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center">
          <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-gray-100">
            <Folder size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Files Available</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Your assigned students have not uploaded any files to their projects yet.
          </p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No files match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file, index) => (
            <div 
              key={`${file._id}-${index}`} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400 transition-all duration-300 flex flex-col h-full group"
            >
              <div className="p-5 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                    {getFileIcon(file.fileType)}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(file.projectId, file._id, file.originalName);
                    }}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                    title="Download File"
                  >
                    <Download size={18} />
                  </button>
                </div>
                
                <h3 className="text-md font-medium text-gray-900 mb-1 line-clamp-2" title={file.originalName}>
                  {file.originalName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar size={12} />
                  <span>{new Date(file.uploadedAt).toLocaleString()}</span>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Student</span>
                    <span className="font-medium text-gray-700 truncate max-w-[120px]" title={file.studentName}>
                      {file.studentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Project</span>
                    <span className="font-medium text-gray-700 truncate max-w-[120px]" title={file.projectName}>
                      {file.projectName}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 px-5 border-t border-gray-200">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(file.projectId, file._id, file.originalName);
                  }}
                  className="w-full text-center block text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Download File
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherFiles;
