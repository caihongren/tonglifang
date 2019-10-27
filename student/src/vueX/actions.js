export default {
  user({
    commit
  }, user) {
    commit("user", user)
  },

  task({
    commit
  }, list) {
    commit("task", list)
  },
  course({
    commit
  }, list) {
    commit("course", list)
  },
  element({
    commit
  }, list) {
    commit("element", list)
  },


}
