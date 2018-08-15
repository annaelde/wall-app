import {
    shallowMount
} from '@vue/test-utils'
import Feed from '@/views/Feed.vue'
import {
    posts
} from './resources/posts'

describe('Feed.vue', () => {
    it('should display posts', () => {
        const wrapper = shallowMount(Feed, {
            propsData: {
                posts
            }
        })
        const postComponents = wrapper.findAll({
            name: 'post'
        })
        expect(postComponents.length).toBe(posts.length)
    })

    it('should display notification if no posts are available', () => {
        const wrapper = shallowMount(Feed)
        const postComponents = wrapper.findAll({
            name: 'post'
        })
        const notification = wrapper.find('.notification')
        expect(postComponents.length).toBe(0)
        expect(notification.exists()).toBe(true)
    })
})
