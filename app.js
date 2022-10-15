const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const { json } = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/signup.html');
})

app.post('/', function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/3cc70f13cd1";
    const options = {
        method: "POST",
        auth: "heera7242:434572c35fa42e1da8fcb36481dd5875-us9"
    }
    const request = https.request(url, options, function(response) {
        if(response.statusCode === 200) {
            res.sendFile(__dirname+'/success.html');
            response.on("data", function(data) {
                console.log(JSON.parse(data));
            });
        } else {
            res.sendFile(__dirname+'/failure.html');
        }
        
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure', function(req, res) {
    // home dir
    res.redirect('/');
});
app.listen(process.env.PORT || 3000, function() {
    console.log("App has started on port: 3000");
});

// API KEY
// 434572c35fa42e1da8fcb36481dd5875-us9

// Audience id
// 3cc70f13cd

// 3000 is replaced by current server service provider
// something like this 
// process.env.PORT