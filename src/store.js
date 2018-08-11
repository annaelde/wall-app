import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null
    },
    getters: {
        GET_USER: state => state.user
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user
        }
    },
    actions: {
        login(context, user) {
            context.commit('SET_USER', user)
        },
        logout(context) {
            context.commit('SET_USER', null)
        }
    }
})
