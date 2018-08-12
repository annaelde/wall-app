<template>
    <div class="modal is-active" @keypress.enter="registered ? close() : submit()" @keypress.esc="close()">
        <div class="modal-background" @click="close()"></div>
        <div class="modal-card">
            <header v-show="!registered" class="modal-card-head">
                <p class="modal-card-title">Register</p>
                <button class="delete" @click="close()" aria-label="close"></button>
            </header>
            <section v-show="!registered" class="modal-card-body">
                <form>
                    <div class="field">
                        <label class="label">Username</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="username" class="input" :class="{ 'is-danger': errors.username }" type="text" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-user"></i>
                            </span>
                        </div>
                        <p v-show="errors.username" class="help is-danger">{{ errors.username }}</p>
                    </div>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="email" class="input" :class="{ 'is-danger': errors.email }" type="email" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-key"></i>
                            </span>
                            <p v-show="errors.email" class="help is-danger">{{ errors.email }}</p>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="password" class="input" :class="{ 'is-danger': errors.password }" type="password" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-key"></i>
                            </span>
                        </div>
                        <p v-show="errors.password" class="help is-danger">{{ errors.password }}</p>
                    </div>
                </form>
            </section>
            <footer v-show="!registered" class="modal-card-foot">
                <button @click.prevent="submit()" class="button is-link">
                    <span>Submit</span>
                    <span v-if="loading" class="icon">
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                    </span>
                </button>
                <button class="button" @click="close()">Cancel</button>
                <p v-show="!errors.generic" class="help">By clicking submit, you consent to receive emails from us.</p>
                <p v-show="errors.generic" class="help is-danger">{{ errors.generic }}</p>
            </footer>
            <header v-show="registered" class="modal-card-head">
                <p class="modal-card-title">Welcome to club!</p>
                <button class="delete" @click="close()" aria-label="close"></button>
            </header>
            <section v-show="registered" class="modal-card-body">
                <div class="content">Thanks for registering, {{ username }}! Check your inbox for a welcome email!</div>
            </section>
            <footer v-show="registered" class="modal-card-foot">
                <button class="button is-success" @click="close()">Got it!</button>
            </footer>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { request } from '../services/request'
import { mapActions } from 'vuex'

export default Vue.component('register-modal', {
    data: function() {
        return {
            username: '',
            password: '',
            email: '',
            loading: false,
            errors: {
                username: '',
                password: '',
                email: '',
                generic: ''
            },
            registered: false
        }
    },
    methods: {
        ...mapActions(['login']),
        submit: function() {
            this.loading = true
            // Reset errors
            for (let key in this.errors) {
                this.errors[key] = ''
            }
            let user = {
                username: this.username,
                password: this.password,
                email: this.email
            }
            request
                .post('users/', user)
                .then(({ data }) => {
                    this.loading = false
                    this.registered = true
                })
                .catch(({ response }) => {
                    // Add errors
                    if (typeof response.data === 'object') {
                        for (let key in response.data) {
                            if (this.errors.hasOwnProperty(key)) {
                                this.errors[key] = response.data[key].join(' ')
                            }
                        }
                    } else {
                        this.errors.generic = 'Server failure. Please try again later.'
                    }
                    this.loading = false
                })
        },
        close: function() {
            this.reset()
            this.$emit('close')
        },
        reset: function() {
            this.username = ''
            this.email = ''
            this.password = ''
            this.registered = false
            for (let key in this.errors) {
                this.errors[key] = ''
            }
        }
    }
})
</script>

<style>
</style>
