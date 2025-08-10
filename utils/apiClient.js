import axios from "axios";

const apiClient = axios.create({
  headers: {
    "x-api-key": process.env.API_KEY,
    "x-api-secret": process.env.API_SECRET
  }
});

export default apiClient;
