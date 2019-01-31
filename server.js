var express = require('express');
var request = require('request');
var path = require('path');

const MAP_API_KEY = process.env.MAP_API_KEY || "libraries=visualization&sensor=true_or_false";

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var jaitURL = "https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=04206425&parameterCd=00060&siteStatus=all"

class GaugeReadingModel {
  constructor(json) {
    this.json = json
    this.gaugeInfo = this.json.value.timeSeries[0].sourceInfo;
    this.gaugeData = this.json.value.timeSeries[0].values[0].value[0];

    this.gaugeName = this.gaugeInfo.siteName;
    this.lat = this.gaugeInfo.geoLocation.geogLocation.latitude;
    this.lon = this.gaugeInfo.geoLocation.geogLocation.longitude;
    this.flowRate = this.gaugeData.value;
    this.dateTime = this.gaugeData.dateTime.split("T");
    this.fullDate = this.dateTime[0].split("-");
    this.date = this.fullDate[1] + "-" + this.fullDate[2] + "-" + this.fullDate[0];
    this.fullTime = this.dateTime[1].split("-")[0].split(".")[0].split(":");
    this.time = this.fullTime[0] + ":" + this.fullTime[1];
  }
}

// Set up a URL route
app.get("/", function(req, res) {
 request(jaitURL, function (error, response, body) {
   if (!error && response.statusCode == 200) {
     var jaitJson = JSON.parse(body);
     var jaitGaugeReading = new GaugeReadingModel(jaitJson);

     res.render('index', {
       gaugeReading: jaitGaugeReading,
       mapApiKey: MAP_API_KEY
     });

   }
 });
});

// bind the app to listen for connections on a specified port
var port = process.env.PORT || 3000;
app.listen(port);

// Render some console log output
console.log("Listening on port " + port);
