<template>
    <div class="card">
        <div class="card-header">
            <div class="content">
                <div class="media-content">
                    <p class="title is-5">{{ post.author }}</p>
                </div>
            </div>
        </div>
        <div class="card-content">
            <div class="content">
                <div class="is-size-5">
                    {{ post.message }}
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="card-footer-item">
                <time class="is-size-6">{{ timestamp }}</time>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'

export default Vue.component('post', {
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    computed: {
        timestamp: function() {
            return moment(this.post.timestamp).calendar()
        }
    }
})
</script>

<style>
.card {
    margin-bottom: 1rem;
    margin-top: 1rem;
}

.card-header {
    padding-left: 1.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.card-footer-item {
    justify-content: flex-start !important;
    padding: 1rem 1.5rem !important;
}
</style>
