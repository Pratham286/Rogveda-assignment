import { ApiError } from "../utils/apiError.js";

export const verifyVendor = (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers["x-vendor-token"];
  if (!token || token !== "vendor-apollo-token") {
    throw new ApiError(401, "Unauthorized. Please login as vendor.");
  }

  next();
};