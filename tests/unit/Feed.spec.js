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
    let wrapper
    beforeEach(() => {
        wrapper = shallowMount(Feed)
    })

    describe('when created', () => {
        it('try to load posts for the feed', () => {
            expect(request.get).toHaveBeenCalledWith('posts/')
        })
    })

    describe('when posts are loaded', () => {
        beforeAll(() => {
            request.get.mockResolvedValueOnce({ data: posts })
        })

        it('should display posts', () => {
            const postComponents = wrapper.findAll({
                name: 'post'
            })
            expect(postComponents.length).toBe(posts.length)
        })
    })

    describe('when loading posts fails', () => {
        beforeAll(() => {
            request.get.mockRejectedValueOnce()
            jest.spyOn(console, 'error').mockImplementation(() => {})
        })

        it('logs an error', async() => {
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
