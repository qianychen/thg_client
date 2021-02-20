import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getter'
import mutations from './mutation'
import actions from './action'

import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [
        persistedState({ storage: window.sessionStorage })
    ]
})