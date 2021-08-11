var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var CryptoJS = require('crypto-js');
var axios = require('axios');

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
    send_message(number, message);
    console.log("complete");
    response.send("complete!");
})

send_message = async (number, message) => {
    var user_phone_number = number;
    var contents = message;

    const date = Date.now().toString();
    const uri = 'ncp:sms:kr::nodejs-sendingsms'; //서비스 ID
    const secretKey = '';// Secret Key
    const accessKey = '';//Access Key
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
    await axios({
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
    }).then( res => { console.log(res) })
    .catch( err => { console.error(err) })
   */
    
    
    const body = {
        type: "SMS",
        countryCode: "82",
        from: "",
        content: contents,
        messages: [
            { to: `${user_phone_number}` }
        ],
    }

    const options = {
        headers: {
            "Contenc-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        }
    }

    console.log("ready to call axios");
    try{
    const result = await axios.post(url, body, options);
     console.log(result);   
    }catch(err) {
        console.log(err);
    }
        /*.then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.error(err.response.data);
        })*/
   // console.log(result);

    console.log("done");
    
}

module.exports = router;