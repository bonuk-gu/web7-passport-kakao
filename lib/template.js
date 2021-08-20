module.exports = {
    html: function (title, list, body, control, authStatusUI='<a href="/auth/login">Login</a> | <a href="/auth/register">Register</a> <br><a href="auth/google">Google</a> | <a href="auth/kakao">Kakao</a> | <a href="auth/naver">Naver</a> | <a href="/auth/kakaoapi">Kakao API</a>') {
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                ${authStatusUI}
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
        </html>                
        `;
    },
    list: function (filelist) {
        var list = '<ul>';
        var i = 0;
        while(i < filelist.length) {
            list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    }
}