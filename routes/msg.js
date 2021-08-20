var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var CryptoJS = require('crypto-js');
var axios = require('axios');
var kakaoCredentials = require('../config/kakao.json');

router.get('/sms', function(request, response){
    if(!auth.isOwner(request, response)){
        response.redirect('/');
        return false;
    }
    var title = 'sms';
    var list = template.list(request.list);
    var html = template.html(title, list, `<form action="/msg/sms_process" method="post">
        <p><input type="text" name="number" placeholder="number"></p>
        <p>
            <textarea name="message" placeholder="message"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>`, '', auth.statusUI(request, response));
    response.send(html);
})

router.post('/sms_process', async (request, response) => {
    var post = request.body;
    var number = post.number;
    var message = post.message;
    await send_message(number, message); // async, await remind!!
    console.log("complete");
    response.redirect('/msg/sms');
})

send_message = async (number, message) => {
    var user_phone_number = number;
    var contents = message;

    const date = Date.now().toString();
    const uri = 'ncp:sms:kr:261250582146:nodejs-sendingsms'; //서비스 ID
    const secretKey = '4DBcF2Iulu0vl7csEqhbUqmIvHqVPuU0d8u0emfM'; // Secret Key
    const accessKey = '26oXRH8IdFdePwULzJj4'; //Access Key
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    
    console.log('ready to call exios');
    
    /*
    try {
    axios({
        method: method,
        json: true,
        url: url,
        headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
        },
        body: {
            type: "SMS",
            countryCode: "82",
            from: "01033235673",
            content: contents,
            messages: [
                { to: `${user_phone_number}`, },
            ],
        },
    })} catch(error) {
        console.log(error);
    }
    */
    
    const body = {
        type: "SMS",
        countryCode: "82",
        from: "01033235673",
        content: contents,
        messages: [
            { to: `${user_phone_number}` }
        ],
    }

    const options = {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        },
    }

    await axios.post(url, body, options)
        .then( res => { console.log(res) })
        .catch( err => { console.log(err) })

    console.log('done');
}

router.get('/kakao', (request, response) => {
    if(!auth.isOwner(request, response)){
        response.redirect('/');
        return false;
    }
    var title = 'Kakao';
    var list = 'template.list(request.list)';
    var html = template.html(title, '', 
        '<a href="/msg/kakao/sendmetext">나에게 보내기</a> | <a href="/msg/kakao/sendfriendstext">친구에게 보내기</a> | <a href="/msg/kakao/unlink">연결 끊기</a>' , 
        '', 
        auth.statusUI(request, response));
    
    response.send(html);
});

router.get('/kakao/unlink', async (req, res) => {
    axios({
        url: "https://kapi.kakao.com/v1/user/unlink",
        method: 'POST',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "KakaoAK 4a8c33e5eb3183ea9a368ceb7874c98a"
        },
        params: {
            "target_id_type": "user_id",
            "target_id": "1839094728"
        }
    })
    .then((res) => {
        console.log("success");
        console.log(res);
    })
    .catch((err) => {
        console.log("err");
        console.log(err.response.headers);
        console.log(err.response);
    })
})

router.get('/kakao/sendmetext', async (req, res) => {
    try {
        var result2 = await axios({
            method: 'POST',
            url: "https://kapi.kakao.com/v2/api/talk/memo/default/send",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${req.session.passport.user.accessToken}`
            },
            data: 'template_object='+JSON.stringify({   
                    'object_type': 'text',
                    'text': 'text1',
                    'link': {
                        'web_url': 'https://developers.kakao.com',
                        'mobile_web_url': 'https://developers.kakao.com'
                    },
                    'button_title': '바로 확인'
                })
        })
    } catch (err) {
        console.log(err);
    }
    console.log(result2.data);

    res.send('sendmetext');
})

router.get('/kakao/sendfriendstext', (req, res) => {
    res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${kakaoCredentials.web.clientID}&redirect_uri=http://localhost:3002/msg/kakao/sendfriendstext_process&response_type=code&scope=friends`);
})

router.get('/kakao/sendfriendstext_process', async (req, res) => {
    try{//access토큰을 받기 위한 코드
        var token = await axios({//token
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: `grant_type=authorization_code&client_id=${kakaoCredentials.web.clientID}&client_secret=${kakaoCredentials.web.clientSecret}&redirectUri=http://localhost:3002/msg/kakao/sendfriendstext_process&code=${req.query.code}`
            //여기서 JSON 형식으로 하면 error
        })
    } catch(err) {
        console.log(err);
    }
    
    console.log('\ntoken data\n', token.data);

    var accessToken = token.data.access_token;

    try {
        var friends = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v1/api/talk/friends',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        console.log('\nfriends!!!!\n', friends.data);
    } catch (err) {
        console.log(err);
    }


    res.send('sendfriendstext');
})

module.exports = router;