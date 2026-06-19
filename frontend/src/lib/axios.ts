import axios from "axios";

export const axiosinstance = axios.create({
    baseURL: "http://backend-service:5000/api"
})