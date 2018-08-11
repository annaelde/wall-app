import axios from 'axios'

let http = axios.create({
    baseURL: 'http://localhost:8000/'
})

export default {
    get: async (url, payload = {}) => http.get(url, payload),
    post: async (url, payload = {}) => http.post(url, payload)
}
