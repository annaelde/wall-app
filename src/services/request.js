import axios from 'axios'

let http = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 1000
})

const request = {
    get: async (url, payload = {}) => http.get(url, payload),
    post: async (url, payload = {}) => http.post(url, payload),
    delete: async (url, payload = {}) => http.delete(url, payload)
}

function setToken(token) {
    http.defaults.headers.common['Authorization'] = `Token ${token}`
}

function removeToken() {
    delete http.defaults.headers.common['Authorization']
}

export { request, setToken, removeToken }
