import axios from "axios";

const API = axios.create({
  baseURL: "https://hrms-backend-i6pw.onrender.com",
});

export default API;