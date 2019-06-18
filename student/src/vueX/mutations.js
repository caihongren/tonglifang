export default{
    user(state,name){
        
        const newuser=JSON.parse(sessionStorage.getItem("user"))
        
       
        state.userlist.name=newuser.name;
    }
}