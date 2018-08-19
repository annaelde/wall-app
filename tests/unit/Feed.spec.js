import {
    shallowMount
} from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Feed from '@/views/Feed.vue'
import {
    request
} from '@/services/request'
import {
    posts
} from './resources/posts'

jest.mock('@/services/request')

describe('Feed.vue', () => {
    describe('when created', () => {
        let wrapper

        beforeEach(() => {
            wrapper = shallowMount(Feed)
        })

        afterEach(() => {
            wrapper.destroy()
        })

        it('try to load posts for the feed', () => {
            expect(request.get).toHaveBeenCalledWith('posts/')
        })
    })

    describe('when posts are loaded', () => {
        let wrapper

        beforeEach(() => {
            request.get.mockResolvedValueOnce({
                data: posts
            })
            wrapper = shallowMount(Feed)
        })

        afterEach(() => {
            wrapper.destroy()
            request.get.mockReset()
        })

        it('should display posts', () => {
            const postComponents = wrapper.findAll({
                name: 'post'
            })
            expect(postComponents.length).toBe(posts.length)
        })
    })

    describe('when loading posts fails', () => {
        let wrapper

        beforeEach(() => {
            request.get.mockRejectedValueOnce()
            jest.spyOn(console, 'error').mockImplementation(() => {})
            wrapper = shallowMount(Feed)
        })

        afterEach(() => {
            wrapper.destroy()
            request.get.mockReset()
        })

        it('logs an error', async () => {
            await flushPromises()
            expect(request.get).toHaveBeenCalledWith('posts/')
            expect(console.error).toHaveBeenCalled()
        })

        it('should display notification if no posts are available', () => {
            const postComponents = wrapper.findAll({
                name: 'post'
            })
            const notification = wrapper.find('.notification')
            expect(postComponents.length).toBe(0)
            expect(notification.exists()).toBe(true)
        })
    })
})
