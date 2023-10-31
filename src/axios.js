import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
})
export const backend = axios.create({
    // baseURL: 'http://localhost:5000/api',
    baseURL: 'http://192.168.29.164:5000/api'
})
export default instance