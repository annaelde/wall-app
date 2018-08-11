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
                    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div class="navbar-menu">
                    <div class="navbar-item">
                        <router-link to="/">Home</router-link>
                    </div>
                    <div class="navbar-item">
                        <router-link v-if="!user" to="/login">Login / Register</router-link>
                        <a v-if="user" @click="logout()">Logout</a>
                    </div>
                </div>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.component('app', {
    computed: {
        ...mapGetters({
            user: 'GET_USER'
        })
    },
    methods: {
        ...mapActions(['logout'])
    }
})
</script>


<style lang="scss">
@import '~bulma';
@import '~font-awesome/css/font-awesome.css';

.navbar-brand-title {
    align-self: center;
    font-weight: bold;
    margin: 1em;
}
</style>
