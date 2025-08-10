import axios from "axios";

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Client with only apikey in query params
const apiClient = axios.create({
  params: {
    apikey: apiKey,
  },
});

// Client with both apikey and apisecret in query params
const privateClient = axios.create({
  params: {
    apikey: apiKey,
    apisecret: apiSecret,
  },
});

export { apiClient, privateClient };