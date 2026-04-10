import { asynchandler } from "../middleware/asyncHandler.js";
import { User } from "../models/user.js";
import * as projectServices from "../serrvices/projectServices.js";
import * as notificationServices from "../serrvices/notificationService.js";
import * as requestServices from "../serrvices/requestService.js";
import * as fileServices from "../serrvices/fileServices.js";
import { Project } from "../models/project.js";
import { Notification } from "../models/notification.js";
import * as userServices from "../serrvices/userServices.js";
import { Supervisor } from "../models/supervisorrequest.js";
import { sendemail } from "../serrvices/emailservice.js";
export const getTeacherDashBoardStats = asynchandler(async (req, res) => {
  const teacherId = req.user._id;
  const totalPendingRequests = await Supervisor.countDocuments({
    Supervisor: teacherId,
    status: "pending",
  });
  const completedProjects = await Project.countDocuments({
    Supervisor: teacherId,
    status: "completed",
  });
  const recentNotification = await Notification.find({
    user: teacherId,
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const dashboardStats = {
    totalPendingRequests,
    completedProjects,
    recentNotification,
  };
  res.status(200).json({
    success: true,
    message: "Dashboard Stats fetch",
    data: { dashboardStats },
  });
});

export const getRequests = asynchandler(async (req, res) => {
  const { supervisor } = req.query;
  const filters = {};
  if (supervisor) filters.supervisor = supervisor;
  const { request, total } = await requestServices.getAllRequests(filters);

  const updatedRequests = await Promise.all(
    request.map(async (reqobj) => {
      const requestObj = reqobj.toObject ? reqobj.toObject() : reqobj;
      if (requestObj?.student?._id) {
        const latestProject = await Project.findOne({
          student: requestObj.student._id,
        })
          .sort({ createdAt: -1 })
          .lean();
        return { ...requestObj, latestProject };
      }
      return requestObj;
    }),
  );
  res.status(200).json({
    success: true,
    message: "Request fetch successfully",
    data: {
      requests: updatedRequests,
      total,
    },
  });
});
export const accceptRequest = asynchandler(async (req, res) => {
  const { requestId } = req.params;
  const teacherId = req.user._id;

  const request = await requestServices.acceptRequest(requestId, teacherId);
  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found",
    });
  }

  await notificationServices.notifyUser(
    request.student._id,
    `Your Supervisor request has been accepted bt ${req.user.name}`,
    "approval",
    "/students/stats",
    "low",
  );
  const student = await User.findById(request.student._id);
  const studentEmail = student.email;
  const message = generateRequestAcceptTemplate(req.user.name);
  await sendemail({
    to: studentEmail,
    subject: "FYP SYSTEM -Your supervisor Request Has Been Accepted",
    message,
  });
  res.status(200).json({
    success: true,
    message: "Request Accepted successfully",
    data: { request },
  });
});
// export const getRequests = asynchandler(async(req,res)=>{

// })
