import {
    shallowMount
} from '@vue/test-utils'
import flushPromises from 'flush-promises'
import PostModal from '@/components/PostModal.vue'
import {
    request
} from '@/services/request'

jest.mock('@/services/request')

describe('PostModal.vue', () => {
    describe('when created', () => {
        let wrapper

        beforeEach(() => {
            wrapper = shallowMount(PostModal)
            request.post.mockResolvedValueOnce()
        })

        afterEach(() => {
            wrapper.destroy()
            request.post.mockReset()
        })

        it('should display message field', () => {
            const message = wrapper.find('[name=\'message\']')
            expect(message.isVisible()).toBe(true)
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

        it('should request post creation when clicking Submit', () => {
            const buttons = wrapper.findAll('button')
            const submit = buttons.filter(button => button.text() === 'Submit').at(0)
            submit.trigger('click')
            expect(request.post).toHaveBeenCalledWith('posts/', expect.anything())
        })

        it('should request post creation when pressing CTRL + Enter', () => {
            const message = wrapper.find('[name=\'message\']')
            message.trigger('keyup', {
                key: 'Enter',
                keyCode: 13,
                ctrlKey: true
            })
            expect(request.post).toHaveBeenCalledWith('posts/', expect.anything())
        })
    })

    describe('when submission succeeds', () => {
        let wrapper, submit
        beforeEach(() => {
            wrapper = shallowMount(PostModal)
            const buttons = wrapper.findAll('button')
            submit = buttons.filter(button => button.text() === 'Submit').at(0)
            request.post.mockResolvedValueOnce()
        })

        afterEach(() => {
            wrapper.destroy()
            request.post.mockReset()
        })

        it('should close', async () => {
            submit.trigger('click')
            await flushPromises()
            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('should signal successful post', async () => {
            submit.trigger('click')
            await flushPromises()
            expect(wrapper.emitted('post-created')).toBeTruthy()
        })
    })

    describe('when submission fails', () => {
        let wrapper, submit

        beforeEach(() => {
            wrapper = shallowMount(PostModal)
            const buttons = wrapper.findAll('button')
            submit = buttons.filter(button => button.text() === 'Submit').at(0)
        })

        afterEach(() => {
            wrapper.destroy()
            request.post.mockReset()
        })

        it('should show generic error if none specified', async () => {
            request.post.mockRejectedValueOnce()
            const errorMessage = wrapper.find('.help.is-danger')
            expect(errorMessage.isVisible()).toBe(false)
            submit.trigger('click')
            await flushPromises()
            expect(errorMessage.isVisible()).toBe(true)
            expect(errorMessage.text()).toBe('Failed to submit post.')
        })

        it('should show specific error if request returns it', async () => {
            request.post.mockRejectedValueOnce({
                response: {
                    data: {
                        message: ['Server error.']
                    }
                }
            })
            const errorMessage = wrapper.find('.help.is-danger')
            expect(errorMessage.isVisible()).toBe(false)
            submit.trigger('click')
            await flushPromises()
            expect(errorMessage.isVisible()).toBe(true)
            expect(errorMessage.text()).toBe('Server error.')
        })
    })
})
