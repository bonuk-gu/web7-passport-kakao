var express = require('express');
var router = express.Router();
var fs = require('fs');
var template = require('../lib/template.js');
var dbConnection = require('../db_info.js');
const { doesNotMatch } = require('assert');
var dbconn = dbConnection.init();

module.exports = function(passport){
    router.get('/login', function(request, response){ 
        var title = 'login';
        var body = `
            <form action="/auth/login_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p>
                    <input type="password" name="pwd" placeholder="password"></p>
                </p>
                <p>
                    <input type="submit" value="login">
                </p>
            </form>
        `;
        var list = template.list(request.list);
        var html = template.html(title, list, body, '', '');
        response.send(html);
    })
    
    router.post('/login_process', 
        passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true }), (req, res) => {
            req.session.save( () => { res.redirect('/') })
        }
    );

    router.get('/register', function(request, response){
        var title = 'register';
        var body = `
            <form action="/auth/register_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="pwd" placeholder="password"></p>
                <p><input type="password" name="pwd2" placeholder="password"></p>
                <p><input type="text" name="displayName" placeholder="display name"></p>
                <p><input type="submit" value="register"></p>
            </form>
        `;
        var list = template.list(request.list);
        var html = template.html(title, list, body, '', '');
        response.send(html);
    })

    router.post('/register_process', function(request, response){
        var post = request.body;
        var email = post.email;
        var pwd = post.pwd;
        var pwd2 = post.pwd2;
        var displayName = post.displayName;

        if(pwd !== pwd2){
            console.log('password');
            response.redirect('/auth/register');
        } else {
            dbconn.query(`select * from users where email='${email}'`, (err, results, fields) => {
                if(err) {
                    console.log(err);
                } else {
                    var user = results[0];
                    if(user) {
                        console.log('email already exist');
                        response.redirect('/auth/register');
                    } else {
                        dbconn.query(`select * from users where displayname='${displayName}'`, (err, results, fields) => {
                            var user = results[0]
                            if(user) {
                                console.log('displayName already exist');
                                response.redirect('/auth/register');
                            } else {
                                dbconn.query(`insert into users (email, pwd, displayname) values ('${email}', '${pwd}', '${displayName}')`);
                                
                                var user = {
                                    email: email,
                                    pwd: pwd,
                                    displayname: displayName
                                }
                    
                                request.login(user, function(err){
                                    console.log('redirect');
                                    request.session.save(function(){
                                        response.redirect('/');
                                    })
                                })
                            }
                        })
                    }
                }
            })

           
        }   
    })
    
    router.get('/logout', function(request, response){
        request.logout();
        request.session.save(function(){
            response.redirect('/');
        })
    })
    
    return router;
}