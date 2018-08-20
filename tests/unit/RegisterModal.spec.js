import {
    shallowMount
} from '@vue/test-utils'
import flushPromises from 'flush-promises'
import RegisterModal from '@/components/RegisterModal.vue'
import {
    request
} from '@/services/request'

jest.mock('@/services/request')

describe('RegisterModal.vue', () => {
    describe('when created', () => {
        let wrapper

        beforeEach(() => {
            wrapper = shallowMount(RegisterModal)
            request.post.mockResolvedValueOnce()
        })

        afterEach(() => {
            wrapper.destroy()
            request.post.mockReset()
        })

        it('should display username field', () => {
            const username = wrapper.find('[name=\'username\']')
            expect(username.isVisible()).toBe(true)
        })

        it('should display email field', () => {
            const email = wrapper.find('[name=\'email\']')
            expect(email.isVisible()).toBe(true)
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

        it('should request registration when clicking Submit', () => {
            const buttons = wrapper.findAll('button')
            const submit = buttons.filter(button => button.text() === 'Submit').at(0)
            submit.trigger('click')
            expect(request.post).toHaveBeenCalledWith('users/', expect.anything())
        })
    })

    describe('when registration succeeds', () => {
        let wrapper, submit
        beforeEach(() => {
            wrapper = shallowMount(RegisterModal)
            const buttons = wrapper.findAll('button')
            submit = buttons.filter(button => button.text() === 'Submit').at(0)
            request.post.mockResolvedValueOnce()
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
            const email = wrapper.find('[name=\'email\']')
            expect(username.isVisible()).toBe(false)
            expect(password.isVisible()).toBe(false)
            expect(email.isVisible()).toBe(false)
        })

        it('should show welcome message', async () => {
            submit.trigger('click')
            await flushPromises()
            const message = wrapper.findAll('.modal-card-title')
                .filter(title => title.text() === 'Welcome to the club!').at(0)
            expect(message.isVisible()).toBe(true)
        })
    })

    describe('when registration fails', () => {
        let wrapper, submit

        beforeEach(() => {
            wrapper = shallowMount(RegisterModal)
            const buttons = wrapper.findAll('button')
            submit = buttons.filter(button => button.text() === 'Submit').at(0)
        })

        afterEach(() => {
            wrapper.destroy()
            request.post.mockReset()
        })

        it('should show username error', async () => {
            request.post.mockRejectedValueOnce({
                response: {
                    data: {
                        username: ['Username already taken.']
                    }
                }
            })
            const errorMessage = wrapper.findAll('.field')
                .filter(field => field.contains('[name=\'username\'')).at(0)
                .find('.help.is-danger')
            expect(errorMessage.isVisible()).toBe(false)
            submit.trigger('click')
            await flushPromises()
            expect(errorMessage.isVisible()).toBe(true)
            expect(errorMessage.text()).toBe('Username already taken.')
        })

        it('should show email error', async () => {
            request.post.mockRejectedValueOnce({
                response: {
                    data: {
                        email: ['Email not valid.']
                    }
                }
            })
            const errorMessage = wrapper.findAll('.field')
                .filter(field => field.contains('[name=\'email\'')).at(0)
                .find('.help.is-danger')
            expect(errorMessage.isVisible()).toBe(false)
            submit.trigger('click')
            await flushPromises()
            expect(errorMessage.isVisible()).toBe(true)
            expect(errorMessage.text()).toBe('Email not valid.')
        })

        it('should show password error', async () => {
            request.post.mockRejectedValueOnce({
                response: {
                    data: {
                        password: ['Password needs at least one special character.']
                    }
                }
            })
            const errorMessage = wrapper.findAll('.field')
                .filter(field => field.contains('[name=\'password\'')).at(0)
                .find('.help.is-danger')
            expect(errorMessage.isVisible()).toBe(false)
            submit.trigger('click')
            await flushPromises()
            expect(errorMessage.isVisible()).toBe(true)
            expect(errorMessage.text()).toBe('Password needs at least one special character.')
        })

        it('should show generic error', async () => {
            request.post.mockRejectedValueOnce()
            const errorMessage = wrapper.find('.modal-card-foot .help.is-danger')
            expect(errorMessage.isVisible()).toBe(false)
            submit.trigger('click')
            await flushPromises()
            expect(errorMessage.isVisible()).toBe(true)
            expect(errorMessage.text()).toBe('Server failure. Please try again later.')
        })
    })
})
