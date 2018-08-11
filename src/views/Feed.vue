<template>
    <section class="section home">
        <div class="container">
            <post v-for="post in posts" :key="post.id" :post="post"></post>
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
            required: true
        }
    }
})
</script>
