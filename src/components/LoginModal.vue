<template>
    <div class="modal is-active">
        <div class="modal-background" @click="close()"></div>
        <div class="modal-card">
            <header v-show="!user" class="modal-card-head">
                <p class="modal-card-title">Login</p>
                <button class="delete" @click="close()" aria-label="close"></button>
            </header>
            <section v-show="!user" class="modal-card-body">
                <form>
                    <div class="field">
                        <label class="label">Username</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="username" @keypress.enter="submit()" name="username" class="input" type="text" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-user"></i>
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control has-icons-left has-icons-right">
                            <input v-model="password" @keypress.enter="submit()" name="password" class="input" type="password" required>
                            <span class="icon is-small is-left">
                                <i class="fa fa-key"></i>
                            </span>
                        </div>
                    </div>
                </form>
            </section>
            <footer v-show="!user" class="modal-card-foot">
                <button @click="submit()" class="button is-link">
                    <span>Submit</span>
                    <span v-show="loading" class="icon">
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                    </span>
                </button>
                <button class="button" @click="close()">Cancel</button>
                <p v-show="error" class="help is-danger">Invalid login information.</p>
            </footer>
            <header v-show="user" class="modal-card-head">
                <p class="modal-card-title">Welcome back!</p>
                <button class="delete" @click="close()" aria-label="close"></button>
            </header>
            <section v-show="user" class="modal-card-body">
                <div class="content">Glad to see you again, {{ username }}!</div>
            </section>
            <footer v-show="user" class="modal-card-foot">
            </footer>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { request, setToken } from '../services/request'
import { mapActions, mapGetters } from 'vuex'

export default Vue.component('login-modal', {
    data: function() {
        return {
            username: '',
            password: '',
            loading: false,
            error: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'GET_USER'
        })
    },
    methods: {
        ...mapActions(['login']),
        submit: function() {
            this.loading = true
            let user = {
                username: this.username,
                password: this.password
            }
            request
                .post('auth/', user)
                .then(({ data } = {}) => {
                    if (data && data.token) {
                        setToken(data.token)
                        this.login({
                            ...user,
                            token: data.token
                        })
                        // Reset component state
                        this.error = false
                        this.loading = false
                        // Auto close
                        setTimeout(() => {
                            // Reset username/password
                            this.username = ''
                            this.password = ''
                            this.$emit('close')
                        }, 3000)
                    }
                })
                .catch(() => {
                    this.loading = false
                    this.error = true
                })
        },
        reset: function() {
            this.error = false
            this.loading = false
            this.username = ''
            this.password = ''
        },
        close: function() {
            this.reset()
            this.$emit('close')
        }
    }
})
</script>
