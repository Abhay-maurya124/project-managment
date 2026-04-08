import { Project } from "../models/project.js";

export const getProjectByStudent = async (StudentId) => {
  return await Project.findOne({ student: StudentId });
};

export const createProject = async (projectData) => {
  const project = new Project(projectData);
  await project.save();
  return project;
};
export const getProjectById = async (id) => {
  const project = await Project.findById(id)
    .populate("student", "name email")
    .populate("supervisor", "name email");
  if (!project) {
    console.log("project not found");
  }
  return project;
};
export const addFilesToProject = async (projectId, files) => {
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(400).json({
      success: false,
      message: "project not found",
    });
  }

  const fileMetaData = files.map((file) => ({
    fileType: file.mimetype,
    fileUrl: file.path,
    originalName: file.originalname,
    uploadedAt: new Date(),
  }));

  project.files.push(...fileMetaData);
  await project.save();
  return project;
};
