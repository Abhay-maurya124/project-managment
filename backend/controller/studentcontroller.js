import { asynchandler } from "../middleware/asyncHandler.js";
import { User } from "../models/user.js";
import * as projectServices from "../serrvices/projectServices.js";
import * as notificationServices from "../serrvices/notificationService.js";
import * as requestServices from "../serrvices/requestService.js";
import * as fileServices from "../serrvices/fileServices.js";
import { Project } from "../models/project.js";
import { Notification } from "../models/notification.js";

export const getStudentProject = asynchandler(async (req, res) => {
  const studentId = req.user._id;
  const project = await projectServices.getProjectByStudent(studentId);
  if (!project) {
    return res.status(200).json({
      success: true,
      data: { project: null },
      message: "No Project found for this student",
    });
  }
  return res.status(200).json({
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
    return res.status(400).json({
      success: false,
      data: { project: null },
      message:
        "you already have existing projects.You can only Submit a new Proposal if the Previous one was Rejected",
    });
  }
  if (existingProject.status !== "rejected") {
    await Project.findByIdAndDelete(existingProject._id);
  }
  const projectData = {
    student: studentId,
    title,
    description,
  };
  const project = await projectServices.createProject(projectData);
  await User.findByIdAndUpdate(studentId, { project: project._id });
  return res.status(201).json({
    success: true,
    data: { project },
    message: "Project proposal submit successful",
  });
});

export const uploadFiles = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const studentId = req.user._id;
  const project = await projectServices.getProjectById(projectId);
  if (!project || project.student._id.toString() !== studentId.toString()) {
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
export const getAvailablesupervisor = asynchandler(async (req, res) => {
  const supervisors = await User.find({ role: "Teacher" })
    .select("name email department expertise")
    .lean();

  return res.status(200).json({
    success: true,
    message: "Available supervisors fetched",
    data: { supervisors },
  });
});

export const requestSupervisor = asynchandler(async (req, res) => {
  const { teacherId, message } = req.body;
  const studentId = req.user._id;

  const student = await User.findById(studentId);
  if (student.supervisor) {
    return res
      .status(400)
      .json({ success: false, message: "You already have a supervisor" });
  }

  const supervisor = await User.findById(teacherId);
  if (!supervisor || supervisor.role !== "Teacher") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid supervisor selected" });
  }

  const requestedData = { student: studentId, supervisor: teacherId, message };
  await requestServices.createRequest(requestedData);

  await notificationServices.notifyUser(
    teacherId,
    `${student.name} requested you to be their supervisor`,
    "request",
    "/teacher/requests",
    "medium",
  );

  return res
    .status(200)
    .json({ success: true, message: "Request sent successfully" });
});

export const getDashboardStats = asynchandler(async (req, res) => {
  const studentId = req.user._id;
  const project = await Project.findOne({ student: studentId })

    .sort({ createdAt: -1 })
    .populate("supervisor", "name")
    .lean();
  const now = new Date();
  const upcomingDeadline = await Project.find({
    student: studentId,
    deadline: { $gte: now },
  })
    .select("title description")
    .sort({ deadline: 1 })
    .limit(3)
    .lean();

  const topNotification = await Notification.findOne({ user: studentId })
    .sort({ createdAt: -1 })
    .populate("user", "name")
    .limit(3)
    .lean();
  const feedbackNotification =
    project?.feedback && project?.feedback.length > 0
      ? project.feedback
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
      : [];
  const supervisorName = project?.supervisor?.name || null;

  return res.status(200).json({
    success: true,
    message: "dashboard stats fetched successfully",
    data: {
      project,
      upcomingDeadline,
      topNotification,
      feedbackNotification,
      supervisorName,
    },
  });
});

export const getFeedback = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const studentId = req.user?._id;
  const project = await projectServices.getProjectById(projectId);

  if (!project || project.student.toString() !== studentId.toString()) {
    return res.status(400).json({
      success: false,
      message: "Not authorized to view feedback for this project",
    });
  }
  const sortedFeedback = project.feedback.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return res.status(200).json({
    success: true,
    message: "Feedback fetch successfully",
    data: { feedback: sortedFeedback },
  });
});

export const downloadFiles = asynchandler(async (req, res) => {
  const { projectId, fileId } = req.params;
  const studentId = req.user._id;
  const project = await projectServices.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }
  if (project.student._id.toString() !== studentId.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to download file",
    });
  }
  const file = project.files.id(fileId);
  if (!file) {
    return res.status(404).json({
      success: false,
      message: "file not found",
    });
  }

  fileServices.streamDownload(file.fileUrl, res, file.originalname);
});
