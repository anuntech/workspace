import axios from "axios";

// use this to interact with our own API (/app/api folder) from the front-end side
// See https://shipfa.st/docs/tutorials/api-call
export const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});
