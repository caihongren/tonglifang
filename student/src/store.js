import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import state from './vueX/state'
import mutations from './vueX/mutations'
import actions from './vueX/actions'

export default new Vuex.Store({
  state,
  mutations ,
  actions

  
})
