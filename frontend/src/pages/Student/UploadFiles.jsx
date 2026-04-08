import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProjectFiles } from "../../store/slices/studentSlice";
import { Upload, File, X, Check } from "lucide-react";

const UploadFiles = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const { project } = useSelector((state) => state.student);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = () => {
  console.log("Button Clicked!");
  if (!project?._id) {
    console.error("Upload failed: No Project ID found in Redux state");
    return;
  }
  
  dispatch(uploadProjectFiles({ projectId: project._id, files: selectedFiles }));
  setSelectedFiles([]);
};

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Project Materials</h2>
        
        <div 
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all mb-6"
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={40} />
          <p className="text-gray-600 font-medium">Click to browse or drag and drop files</p>
          <p className="text-xs text-gray-400 mt-2">Supports PDF, DOCX, ZIP (Max 10 files)</p>
          <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} />
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-3 mb-6">
            {selectedFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
            >
              <Check size={18} /> Confirm Upload
            </button>
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-800 mb-4">Previous Uploads</h3>
        <div className="grid grid-cols-1 gap-3">
          {project?.files?.map((file, i) => (
            <a key={i} href={file.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-600">{file.originalName}</span>
              <span className="text-xs text-gray-400">{new Date(file.uploadedAt).toLocaleDateString()}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;