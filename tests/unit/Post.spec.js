import {
    shallowMount
} from '@vue/test-utils'
import Post from '@/components/Post.vue'
import moment from 'moment'
import {
    posts
} from './resources/posts'

describe('Post.vue', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallowMount(Post, {
            propsData: {
                post: posts[0]
            }
        })
    })

    afterEach(() => {
        wrapper.destroy()
    })

    it('should display post message', () => {
        expect(wrapper.text()).toContain(posts[0].message)
    })

    it('should display post author', () => {
        expect(wrapper.text()).toContain(posts[0].author.username)
    })

    it('should display formatted timestamp', () => {
        expect(wrapper.text()).toContain(moment(posts[0].timestamp).calendar())
    })
})
