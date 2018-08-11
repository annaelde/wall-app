<template>
    <div class="modal is-active" @keypress.enter="submit()" @keypress.esc="$emit('close')">
        <div class="modal-background" @click="$emit('close')"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Register</p>
                <button class="delete" @click="$emit('close')" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <form>
                    <div class="field">
                        <label class="label">Username</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="username" class="input" type="text" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-user"></i>
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="email" class="input" type="email" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-key"></i>
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="password" class="input" type="password" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-key"></i>
                            </span>
                        </div>
                    </div>
                </form>
            </section>
            <footer class="modal-card-foot">
                <button @click.prevent="submit()" class="button is-link">
                    <span>Submit</span>
                    <span v-if="loading" class="icon">
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                    </span>
                </button>
                <button class="button" @click="$emit('close')">Cancel</button>
                <p v-if="!error" class="help">By clicking submit, you consent to receive emails from us.</p>
                <p v-if="error" class="help is-danger">Invalid registration information.</p>
            </footer>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { request, setToken } from '../services/request'
import { mapActions } from 'vuex'

export default Vue.component('register-modal', {
    data: function() {
        return {
            username: '',
            password: '',
            email: '',
            loading: false,
            error: false
        }
    },
    methods: {
        ...mapActions(['login']),
        submit: function() {
            this.loading = true
            let user = {
                username: this.username,
                password: this.password,
                email: this.email
            }
            request
                .post('register/', user)
                .then(({ data }) => {
                    if (data.token) {
                        setToken(data.token)
                        this.login({
                            ...user,
                            token: data.token
                        })
                        this.loading = false
                        this.$router.push('/')
                    }
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


