<template>
    <div class="container" id="app">
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
                    <router-link to="/login">Login</router-link>
                </div>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
@import '~bulma';
@import '~font-awesome/css/font-awesome.css';

.navbar-brand-title {
    align-self: center;
    font-weight: bold;
    margin: 1em;
}
</style>
