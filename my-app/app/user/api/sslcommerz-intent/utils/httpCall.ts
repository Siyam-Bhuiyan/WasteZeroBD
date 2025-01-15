import fetch, { RequestInit } from "node-fetch";
import FormData from "form-data";

interface HttpCallParams {
  url: string;
  method?: "GET" | "POST";
  data?: FormData;
}

const httpCall = async ({ url, method = "POST", data }: HttpCallParams) => {
  const headers: Record<string, string> = {};

  if (data instanceof FormData) {
    Object.assign(headers, data.getHeaders()); // Add headers from FormData
  }

  const options: RequestInit = {
    method,
    headers,
    body: data as unknown as BodyInit, // Cast FormData explicitly for node-fetch
  };

  console.log("Request Options:", options);

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};

export default httpCall;
