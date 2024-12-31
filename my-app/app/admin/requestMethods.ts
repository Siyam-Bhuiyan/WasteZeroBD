import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

const getToken = (): string | null => {
  try {
    const rootData = localStorage.getItem("persist:root");
    if (rootData) {
      const parsedData = JSON.parse(rootData);
      const user = JSON.parse(parsedData.user);
      return user?.currentUser?.accessToken || null;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving token from localStorage:", error);
    return null;
  }
};

const TOKEN = getToken();

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: TOKEN ? { token: `Bearer ${TOKEN}` } : {},
});
