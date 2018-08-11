<template>
    <div class="modal is-active">
        <div class="modal-background" @click="$emit('close')"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Make a Post</p>
                <button class="delete" @click="$emit('close')" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <form>
                    <div class="field">
                        <div class="control has-icons-left has-icons-right">
                            <textarea v-model="content" @keypress.enter="submit()" class="textarea" type="text" required></textarea>
                        </div>
                    </div>
                </form>
            </section>
            <footer class="modal-card-foot">
                <button @click="submit()" class="button is-link">
                    <span>Submit</span>
                    <span v-show="loading" class="icon">
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                    </span>
                </button>
                <button class="button" @click="$emit('close')">Cancel</button>
                <p v-show="error" class="help is-danger">Post failed. Try again.</p>
            </footer>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { request } from '../services/request'

export default Vue.component('post-modal', {
    data: function() {
        return {
            content: '',
            loading: false,
            error: false
        }
    },
    methods: {
        submit: function() {
            this.loading = true
            request
                .post('posts/', { message: this.content })
                .then(({ data }) => {
                    this.loading = false
                    this.error = false
                    this.$emit('post-created')
                    this.$emit('close')
                })
                .catch(() => {
                    this.loading = false
                    this.error = true
                })
        }
    }
})
</script>

<style>
</style>
