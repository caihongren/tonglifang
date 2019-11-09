export default {
  user(state, name) {

    const newuser = JSON.parse(sessionStorage.getItem("user"))


    state.userlist.name = newuser.name;
  },
  task(state, list) {
    state.taskList = list
  },
  course(state, list) {
    state.courseList = list
  },
  element(state, list) {
    state.elementList = list
  },
  setAction(state, action){
    state.action = action;
  },
}
