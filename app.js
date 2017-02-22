/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var http = require('http');
var https = require("https");
var jsonDataobj,jsonObj,jsonRow;
var jsonData="";

app.get('/getTemperature', function(request, response){
  var options = {
    "method": "GET",
    "hostname": "484059b1-efd4-4898-a9c3-7f38a51c12fe-bluemix.cloudant.com",
    "port": null,
    "path": "/temp/_design/createdAt/_view/createdAt?limit=10&reduce=false&descending=true",
    "headers": {
      "authorization": "Basic " + process.env.basicAuthTempVizToken,
      "cache-control": "no-cache"
    }
  };

  var req = https.request(options, function (res) {
  var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log("JSON ", JSON.stringify(JSON.parse(body).rows[0]));
      response.send(JSON.parse(body).rows[0]);
      console.log(body.toString());
    });
  });

  req.end();
});

app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
