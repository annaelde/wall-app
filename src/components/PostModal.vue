<template>
    <div class="modal is-active">
        <div class="modal-background" @click="close()"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Make a Post</p>
                <button class="delete" @click="close()" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <form>
                    <div class="field">
                        <div class="control has-icons-left has-icons-right">
                            <textarea v-model="content" name="message" @keyup.ctrl.13="submit($event)" class="textarea" type="text" required></textarea>
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
                <button class="button" @click="close()">Cancel</button>
                <p v-show="!error" class="help">You can use CTRL + Enter or CMD + Enter to submit, too!</p>
                <p v-show="error" class="help is-danger">{{ error }}</p>
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
            error: ''
        }
    },
    methods: {
        submit: function(event) {
            console.log(event)
            this.loading = true
            this.error = ''
            request
                .post('posts/', { message: this.content })
                .then(() => {
                    this.$emit('post-created')
                    this.close(false)
                })
                .catch(({ response } = {}) => {
                    // If there's a specific error message, provide it
                    if (response && response.data && response.data.message) {
                        this.error = response.data.message.join(' ')
                    } else {
                        this.error = 'Failed to submit post.'
                    }
                    this.loading = false
                })
        },
        reset: function(preserve = true) {
            // Sometimes, we may want to keep a draft of the post
            // because users can accidentally click out of the modal
            if (!preserve) {
                this.content = ''
            }
            this.loading = false
            this.error = ''
        },
        close: function(preserve = true) {
            this.reset(preserve)
            this.$emit('close')
        }
    }
})
</script>

<style>
</style>
