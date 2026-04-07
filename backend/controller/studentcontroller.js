import { asynchandler } from "../middleware/asyncHandler.js";
import { User } from "../models/user.js";
import * as projectServices from "../serrvices/projectServices.js";

export const getStudentProject = asynchandler(async (req, res) => {
  const studentId = req.user._id;
  const project  = await projectServices.getProjectByStudent(studentId);
  if (!project) {
    return res.status(200).json({
      success: true,
      data: { project: null },
      message: "No Project found for this student",
    });
  }
  res.status(200).json({
    success: true,
    data: { project },
    message: "Project found for this student",
  });
});

export const submitProposal = asynchandler(async (req, res) => {
  const { title, description } = req.body;
  const studentId = req.user._id;
  const existingProject = await projectServices.getProjectByStudent(studentId);
  if (existingProject && existingProject.status !== "rejected") {
    res.status(400).json({
      success: true,
      data: { project: null },
      message:
        "you already have existing projects.You can only Submit a new Proposal if the Previous one was Rejected",
    });
  }
  const projectData = {
    student: studentId,
    title,
    description,
  };
  const Project = await projectServices.createProject(projectData);
  await User.findByIdAndUpdate(studentId, { project: Project._id });
  res.status(201).json({
    success: true,
    data: { Project },
    message: "Project proposal submit successful",
  });
});

export const uploadFiles = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const studentId = req.user._id;
  const project = await projectServices.getProjectById(projectId);
  if (!project || project.student.toString() !== studentId.toString()) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to upload files to this project",
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }
  const updateProject = await projectServices.addFilesToProject(
    projectId,
    req.files,
  );

  return res.status(200).json({
    success: true,
    message: "File uploadede successfully",
    data: { project: updateProject },
  });
});

export const getAvailableSupervisor = asynchandler(async (req, res) => {
  const supervisor = await User.find({ role: "Teacher" })
    .select("name email department expertise")
    .lean(); //use for read only in the database

  return res.status(200).json({
    success: true,
    message: "Available Supervisor",
    data: { supervisor },
  });
});
