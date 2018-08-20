import {
    shallowMount,
    createLocalVue
} from '@vue/test-utils'
import flushPromises from 'flush-promises'
import App from '@/App.vue'
import Vuex from 'vuex'
import {
    request,
    removeToken
} from '@/services/request'

const localVue = createLocalVue()
localVue.use(Vuex)
jest.mock('@/services/request')

describe('App.vue', () => {
    describe('when logged in', () => {
        let wrapper, actions, store
        beforeEach(() => {
            actions = {
                logout: jest.fn()
            }
            store = new Vuex.Store({
                actions,
                getters: {
                    GET_USER: () => ({})
                }
            })
            wrapper = shallowMount(App, {
                store,
                localVue
            })
        })

        afterEach(() => {
            wrapper.destroy()
        })

        it('shows Make a Post and Logout buttons', () => {
            const login = wrapper.find('button[name=\'login\'')
            const signUp = wrapper.find('button[name=\'sign-up\']')
            const logout = wrapper.find('button[name=\'logout\']')
            const post = wrapper.find('button[name=\'make-a-post\']')
            expect(login.isVisible()).toBe(false)
            expect(signUp.isVisible()).toBe(false)
            expect(logout.isVisible()).toBe(true)
            expect(post.isVisible()).toBe(true)
        })

        it('shows Post Modal when clicking the Make a Post button', () => {
            const postModal = wrapper.find({
                name: 'post-modal'
            })
            const postButton = wrapper.find('button[name=\'make-a-post\'')
            expect(postModal.isVisible()).toBe(false)
            postButton.trigger('click')
            expect(postModal.isVisible()).toBe(true)
        })

        it('logs out when clicking the Logout button', async () => {
            const logoutButton = wrapper.find('button[name=\'logout\']')
            logoutButton.trigger('click')
            await flushPromises()
            expect(actions.logout).toHaveBeenCalled()
            expect(removeToken).toHaveBeenCalled()
        })

        describe('when a request to logout fails', () => {
            beforeEach(() => {
                request.delete.mockRejectedValueOnce()
                jest.spyOn(console, 'error').mockImplementation(() => {})
                const logoutButton = wrapper.find('button[name=\'logout\']')
                logoutButton.trigger('click')
            })

            afterEach(() => {
                request.delete.mockReset()
            })

            it('logs out locally', async () => {
                await flushPromises()
                expect(actions.logout).toHaveBeenCalled()
                expect(removeToken).toHaveBeenCalled()
            })

            it('logs an error', async () => {
                await flushPromises()
                expect(console.error).toHaveBeenCalled()
            })
        })

        describe('when escape key is pressed', () => {
            beforeAll(() => {
                // Mock window event listener and triggering it
                const map = {}
                window.trigger = jest.fn().mockImplementation((event, options) => {
                    map[event](options)
                })
                window.addEventListener = jest.fn().mockImplementation((event, callback) => {
                    map[event] = callback
                })
            })

            it('should close the Post Modal', () => {
                const postModal = wrapper.find({
                    name: 'post-modal'
                })
                const postButton = wrapper.find('button[name=\'make-a-post\'')
                expect(postModal.isVisible()).toBe(false)
                postButton.trigger('click')
                expect(postModal.isVisible()).toBe(true)
                window.trigger('keydown', {
                    key: 'Escape'
                })
                expect(postModal.isVisible()).toBe(false)
            })
        })

        describe('when a post is submitted', () => {
            it('should refresh the feed', () => {
                const postModal = wrapper.find({
                    name: 'post-modal'
                })
                jest.spyOn(wrapper.vm, 'retrievePosts')
                postModal.vm.$emit('post-created')
                expect(wrapper.vm.retrievePosts).toHaveBeenCalled()
            })
        })
    })

    describe('when logged out', () => {
        let wrapper, store
        beforeEach(() => {
            store = new Vuex.Store({
                getters: {
                    GET_USER: () => null
                }
            })
            wrapper = shallowMount(App, {
                store,
                localVue
            })
        })

        afterEach(() => {
            wrapper.destroy()
        })

        it('shows Login and Sign Up buttons', () => {
            const login = wrapper.find('button[name=\'login\']')
            const signUp = wrapper.find('button[name=\'sign-up\']')
            const logout = wrapper.find('button[name=\'logout\']')
            const post = wrapper.find('button[name=\'make-a-post\']')
            expect(login.isVisible()).toBe(true)
            expect(signUp.isVisible()).toBe(true)
            expect(logout.isVisible()).toBe(false)
            expect(post.isVisible()).toBe(false)
        })

        it('shows Login Modal when clicking the Login button', () => {
            const loginModal = wrapper.find({
                name: 'login-modal'
            })
            const loginButton = wrapper.find('button[name=\'login\'')
            expect(loginModal.isVisible()).toBe(false)
            loginButton.trigger('click')
            expect(loginModal.isVisible()).toBe(true)
        })

        it('shows Register Modal when clicking the Sign Up button', () => {
            const registerModal = wrapper.find({
                name: 'register-modal'
            })
            const signUpButton = wrapper.find('button[name=\'sign-up\'')
            expect(registerModal.isVisible()).toBe(false)
            signUpButton.trigger('click')
            expect(registerModal.isVisible()).toBe(true)
        })

        describe('when escape key is pressed', () => {
            beforeAll(() => {
                // Mock window event listener and triggering it
                const map = {}
                window.trigger = jest.fn().mockImplementation((event, options) => {
                    map[event](options)
                })
                window.addEventListener = jest.fn().mockImplementation((event, callback) => {
                    map[event] = callback
                })
            })

            it('should close the Register Modal', () => {
                const registerModal = wrapper.find({
                    name: 'register-modal'
                })
                const signUpButton = wrapper.find('button[name=\'sign-up\'')
                expect(registerModal.isVisible()).toBe(false)
                signUpButton.trigger('click')
                expect(registerModal.isVisible()).toBe(true)
                window.trigger('keydown', {
                    key: 'Escape'
                })
                expect(registerModal.isVisible()).toBe(false)
            })

            it('should close the Login Modal', () => {
                const loginModal = wrapper.find({
                    name: 'login-modal'
                })
                const loginButton = wrapper.find('button[name=\'login\'')
                expect(loginModal.isVisible()).toBe(false)
                loginButton.trigger('click')
                expect(loginModal.isVisible()).toBe(true)
                window.trigger('keydown', {
                    key: 'Escape'
                })
                expect(loginModal.isVisible()).toBe(false)
            })
        })
    })
})
