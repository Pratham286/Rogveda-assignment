import api from "./axios";

export const searchHospitals = async (query) => {
  // console.log(api);
  const res = await api.post("/api/hospitals", { query });
  return res.data.data; // array of hospital objects
};

export const getHospitalById = async (id) => {
  const res = await api.get(`/api/hospitals/${id}`);
  return res.data.data;
};
