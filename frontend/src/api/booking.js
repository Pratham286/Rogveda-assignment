import api from "./axios";

export const createPatient = async ({ name, email, phone, country }) => {
  const res = await api.post("/api/patients", { name, email, phone, country });
  return res.data.data; // { _id, name, email, walletBalance, ... }
};

export const createBooking = async ({ patientId, hospitalId, doctorId, roomType }) => {
  const res = await api.post("/api/booking", { patientId, hospitalId, doctorId, roomType });
  return res.data.data;
};

export const getPatientBookings = async (patientId) => {
  const res = await api.get(`/api/booking/${patientId}`);
  return res.data.data; // { walletBalance, bookings }
};
