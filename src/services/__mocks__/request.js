/* global jest */
const request = {
    get: jest.fn().mockResolvedValue({
        data: []
    }),
    post: jest.fn().mockResolvedValue({
        data: []
    }),
    delete: jest.fn().mockResolvedValue({
        data: []
    })
}

const setToken = jest.fn()

const removeToken = jest.fn()

export {
    request,
    setToken,
    removeToken
}
