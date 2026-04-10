import { Supervisor } from "../models/supervisorrequest.js";

export const createRequest = async (requestData) => {
  const existingRequest = await Supervisor.findOne({
    student: requestData.student,
    supervisor: requestData.supervisor,
    status: "pending",
  });

  if (existingRequest) {
    const error = new Error(
      "You have already sent a request to this supervisor.",
    );
    error.statusCode = 400;
    throw error;
  }
  return await Supervisor.create(requestData);
};

export const getAllRequests = async (filters) => {};
export const acceptRequest = async (requestId, teacherId) => {};
