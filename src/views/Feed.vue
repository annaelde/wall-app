<template>
    <section class="section home">
        <div v-if="posts && posts.length > 0" class="container">
            <post v-for="post in posts" :key="post.id" :post="post"></post>
        </div>
        <div v-else class="container">
            <div v-show="notify" class="notification is-info">
                There's no posts to display!
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import { request } from '../services/request'
import '../components/Post.vue'

export default Vue.component('feed', {
    props: {
        retrieve: {
            type: Boolean,
            required: false
        }
    },
    data: function() {
        return {
            posts: [],
            notify: false
        }
    },
    created: function() {
        this.retrievePosts()
    },
    methods: {
        retrievePosts: function() {
            request
                .get('posts/')
                .then(({ data } = {}) => {
                    if (data) {
                        this.posts = data
                        this.notify = false
                    }
                })
                .catch(() => {
                    console.error('Request for posts failed.')
                    this.notify = true
                })
        }
    }
})
</script>
