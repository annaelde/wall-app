<template>
    <section class="section home">
        <div v-if="posts && posts.length > 0" class="container">
            <post v-for="post in posts" :key="post.id" :post="post"></post>
        </div>
        <div v-else class="container">
            <div class="notification is-info">
                There's no posts to display!
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import '../components/Post.vue'

export default Vue.component('feed', {
    props: {
        posts: {
            type: Array,
            required: false
        }
    }
})
</script>
