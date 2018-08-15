<template>
    <div id="app">
        <div class="container">
            <div class="navbar">
                <div class="navbar-brand">
                    <div class="navbar-brand-title">
                        <span class="icon has-text-info">
                            <i class="fa fa-comments"></i>
                        </span>
                        Wall App
                    </div>
                </div>
                <div class="navbar-item" v-show="!user">
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-primary" name="sign-up" @click="show.register = true">Sign Up</button>
                        </div>
                        <div class="control">
                            <button class="button" name="login" @click="show.login = true">Login</button>
                        </div>
                    </div>
                </div>
                <div class="navbar-item" v-show="user">
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-primary" name="make-a-post" @click="show.post = true">Make a Post</button>
                        </div>
                        <div class="control">
                            <button class="button" name="logout" @click="requestLogout()">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <feed :posts="posts" />
        <login-modal v-show="show.login" :user="user" @close="show.login = false"></login-modal>
        <register-modal v-show="show.register" @close="show.register = false"></register-modal>
        <post-modal v-show="show.post" @close="show.post = false" @post-created="retrievePosts()"></post-modal>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { request, removeToken } from './services/request'
import './views/Feed'
import './components/LoginModal'
import './components/RegisterModal'
import './components/PostModal'

export default Vue.component('app', {
    data: function() {
        return {
            posts: [],
            show: {
                login: false,
                register: false,
                post: false
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'GET_USER'
        })
    },
    created: function() {
        // Get posts
        this.retrievePosts()
        // Add an event listener to hide any modal open on escape
        window.addEventListener('keydown', ({ key }) => {
            if (key === 'Escape') {
                for (let modal in this.show) {
                    this.show[modal] = false
                }
            }
        })
    },
    methods: {
        ...mapActions(['logout']),
        requestLogout: function() {
            request
                .delete('auth/')
                .then((response) => {
                    removeToken()
                    this.logout()
                })
                .catch(() => {
                    // Still delete the token locally,
                    // even if we didn't succeed in deleting in on the server
                    console.error('Logout request failed.')
                    removeToken()
                    this.logout()
                })
        },
        retrievePosts: function() {
            request.get('posts/')
                .then(({ data }) => {
                    this.posts = data
                })
                .catch(() => {
                    console.error('Request for posts failed.')
                })
        }
    }
})
</script>

<style lang="scss">
@import '~bulma';
@import '~font-awesome/css/font-awesome.css';

.navbar {
    display: flex;
}

.navbar-brand-title {
    align-self: center;
    font-weight: bold;
    margin: 1em;
}
</style>
