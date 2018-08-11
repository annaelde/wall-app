<template>
    <section class="section home">
        <post v-for="post in posts" :key="post.id" :post="post"></post>
    </section>
</template>

<script>
import Vue from 'vue'
import request from '../services/request'
import '../components/Post.vue'

export default Vue.component('home', {
    data: function () {
        return {
            posts: []
        }
    },
    beforeCreate: function () {
        request.get('posts/').then(({ data }) => {
            this.posts = data
        })
    }
})
</script>
