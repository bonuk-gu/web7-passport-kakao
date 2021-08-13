module.exports = {
    isOwner:function(request, response){
        if(request.user){ // deserial~ 의 done 에서 온 user
            return true;
        } else {
            return false;
        }
    },

    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">Login</a> | <a href="/auth/register">Register</a> | <a href="auth/google">Login with Google</a>' 
        if(this.isOwner(request, response)){
            authStatusUI= `${request.user.displayname} | <a href="/auth/logout">logout</a><br><a href="/msg/sms">SMS</a> | <a href="/msg/kakao">Kakao</a>`
            return authStatusUI
        } 
    }
}