import {
    shallowMount,
    createLocalVue
} from '@vue/test-utils'
import flushPromises from 'flush-promises'
import LoginModal from '@/components/LoginModal.vue'
import {
    request
} from '@/services/request'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
jest.mock('@/services/request')

describe('LoginModal.vue', () => {
    describe('when created', () => {
        let wrapper, actions, store
        beforeEach(() => {
            actions = {
                login: jest.fn()
            }
            store = new Vuex.Store({
                actions,
                getters: {
                    GET_USER: () => null
                }
            })
            wrapper = shallowMount(LoginModal, {
                store,
                localVue
            })
        })

        afterEach(() => {
            wrapper.destroy()
        })

        it('should display username field', () => {
            const username = wrapper.find('[name=\'username\']')
            expect(username.isVisible()).toBe(true)
        })

        it('should display password field', () => {
            const password = wrapper.find('[name=\'password\']')
            expect(password.isVisible()).toBe(true)
        })

        it('should close when clicking out', () => {
            wrapper.find('.modal-background').trigger('click')
            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('should close when clicking X button', () => {
            wrapper.find('button.delete').trigger('click')
            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('should close when clicking Cancel button', () => {
            const buttons = wrapper.findAll('button')
            const cancel = buttons.filter(button => button.text() === 'Cancel').at(0)
            cancel.trigger('click')
            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('should request authentication when clicking Submit', () => {
            const buttons = wrapper.findAll('button')
            const submit = buttons.filter(button => button.text() === 'Submit').at(0)
            submit.trigger('click')
            expect(request.post).toHaveBeenCalledWith('auth/', expect.anything())
        })
    })
    describe('when login succeeds', () => {
        let wrapper, actions, store, submit
        beforeEach(() => {
            actions = {
                login: jest.fn()
            }
            store = new Vuex.Store({
                actions,
                getters: {
                    GET_USER: () => ({})
                }
            })
            wrapper = shallowMount(LoginModal, {
                store,
                localVue
            })

            const buttons = wrapper.findAll('button')
            submit = buttons.filter(button => button.text() === 'Submit').at(0)
            request.post.mockResolvedValueOnce({
                data: {
                    token: 'token'
                }
            })
        })

        afterEach(() => {
            wrapper.destroy()
            request.post.mockReset()
        })

        it('should hide form', async () => {
            submit.trigger('click')
            await flushPromises()
            const username = wrapper.find('[name=\'username\']')
            const password = wrapper.find('[name=\'password\']')
            expect(username.isVisible()).toBe(false)
            expect(password.isVisible()).toBe(false)
        })

        it('should show welcome message', async () => {
            submit.trigger('click')
            await flushPromises()
            const message = wrapper.findAll('.modal-card-title')
                .filter(title => title.text() === 'Welcome back!').at(0)
            expect(message.isVisible()).toBe(true)
        })

        it('should update store', async () => {
            submit.trigger('click')
            await flushPromises()
            expect(actions.login).toHaveBeenCalled()
        })

        it('should auto-close', async (done) => {
            submit.trigger('click')
            await flushPromises()
            setTimeout(() => {
                expect(wrapper.emitted('close')).toBeTruthy()
                done()
            }, 3000)
        })
    })

    describe('when login fails', () => {
        let wrapper, actions, store, submit
        beforeEach(() => {
            actions = {
                login: jest.fn()
            }
            store = new Vuex.Store({
                actions,
                getters: {
                    GET_USER: () => null
                }
            })
            wrapper = shallowMount(LoginModal, {
                store,
                localVue
            })
            const buttons = wrapper.findAll('button')
            submit = buttons.filter(button => button.text() === 'Submit').at(0)
            request.post.mockRejectedValueOnce()
        })

        afterEach(() => {
            wrapper.destroy()
            request.post.mockReset()
        })

        it('should show error', async () => {
            const errorMessage = wrapper.find('.help.is-danger')
            expect(errorMessage.isVisible()).toBe(false)
            submit.trigger('click')
            await flushPromises()
            expect(errorMessage.isVisible()).toBe(true)
        })
    })
})
