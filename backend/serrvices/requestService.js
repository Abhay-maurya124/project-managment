import { supervisor } from "../models/supervisorrequest.js";

export const createRequest = async (requestData) => {
  const existingRequest = await supervisor.findOne({
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
  return await supervisor.create(requestData);
};
