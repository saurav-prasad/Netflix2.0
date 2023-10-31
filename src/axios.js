import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
})
export const backend = axios.create({
    baseURL: 'https://netflix2-0-backend.vercel.app/api'
})
export default instance