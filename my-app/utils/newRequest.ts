import axios from "axios";

const newRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default newRequest;
