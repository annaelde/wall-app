<template>
    <section class="section about">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h2 class="title">Login</h2>
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
                            <label class="label">Password</label>
                            <div class="control has-icons-left has-icons-right">
                                <input v-model="password" class="input" type="password" required>
                                <span class="icon is-small is-left">
                                    <i class="fa fa-key"></i>
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button @click.prevent="login()" class="button is-link">
                                    <span>Submit</span>
                                    <span v-if="loading" class="icon">
                                        <i class="fa fa-circle-o-notch fa-spin"></i>
                                    </span>
                                </button>
                            </div>
                            <p v-if="error" class="help is-danger">Invalid login information.</p>
                        </div>
                    </form>
                </div>
                <div class="column">
                    <h2 class="title">Register</h2>
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
                        <div class="field">
                            <div class="control">
                                <button @click.prevent="register()" class="button is-link">
                                    <span>Submit</span>
                                    <span v-if="loading" class="icon">
                                        <i class="fa fa-circle-o-notch fa-spin"></i>
                                    </span>
                                </button>
                            </div>
                            <p v-if="error" class="help is-danger">Invalid registration information.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import { request, setToken } from '../services/request'
import { mapActions } from 'vuex'

export default Vue.component('login', {
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
        login: function() {
            this.loading = true
            let user = {
                username: this.username,
                password: this.password
            }
            request
                .post('login/', user)
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
        },
        register: function() {
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

<style scoped>
.field {
    max-width: 300px;
}
</style>
