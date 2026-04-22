import api from "./axios";

export const vendorLogin = async ({ username, password }) => {
  const res = await api.post("/api/vendor/login", { username, password });
  return res.data.data; // { vendor, token }
};

export const getVendorBookings = async () => {
  const res = await api.get("/api/vendor/bookings");
  return res.data.data;
};

export const getBookingDetails = async (bookingId) => {
  const res = await api.get(`/api/vendor/bookings/${bookingId}`);
  return res.data.data;
};

export const completeTask = async (taskId) => {
  const res = await api.put(`/api/vendor/tasks/${taskId}`);
  return res.data.data; // { task, booking }
};
