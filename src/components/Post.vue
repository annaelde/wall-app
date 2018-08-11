<template>
    <div class="card">
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{ post.author.username }}</p>
                    <p class="subtitle is-6">{{ post.author.date_joined }}</p>
                </div>
            </div>
            <div class="content">
                {{ post.message }}
                <time>{{ post.timestamp }}</time>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

export default Vue.component('post', {
    props: {
        post: {
            type: Object,
            required: true
        }
    }
})
</script>

<style>
.card {
    margin-bottom: 1em;
    margin-top: 1em;
}
</style>
