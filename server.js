var express = require('express');
var request = require('request');

var app = express();

var jaitURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=04206425&parameterCd=00060&siteStatus=all"

// Set up a URL route
app.get("/", function(req, res) {
 request(jaitURL, function (error, response, body) {
   if (!error && response.statusCode == 200) {
     var j = JSON.parse(body);
     var gaugeInfo = j.value.timeSeries[0].sourceInfo;
     var gaugeData = j.value.timeSeries[0].values[0].value[0];

     var gaugeName = gaugeInfo.siteName;
     var lat = gaugeInfo.geoLocation.geogLocation.latitude;
     var lon = gaugeInfo.geoLocation.geogLocation.longitude;
     var flowRate = gaugeData.value;
     var dateTime = gaugeData.dateTime.split("T");
     var fullDate = dateTime[0].split("-");
     var date = fullDate[1] + "-" + fullDate[2] + "-" + fullDate[0];
     var fullTime = dateTime[1].split("-")[0].split(".")[0].split(":");
     var time = fullTime[0] + ":" + fullTime[1];

     var responseBody =
       gaugeName + "<br><br>" +
       flowRate + " cfs" + "<br><br>" +
       time + "<br><br>" +
       date + "<br><br>";

     res.status(200).send(responseBody);
   }
 })
});

// bind the app to listen for connections on a specified port
var port = process.env.PORT || 3000;
app.listen(port);

// Render some console log output
console.log("Listening on port " + port);
