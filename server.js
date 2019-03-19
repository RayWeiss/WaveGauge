var express = require('express');
var path = require('path');
const UsgsService = require('./js/usgs_service.js');

const MAP_API_KEY = process.env.MAP_API_KEY || "libraries=visualization&sensor=true_or_false";

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", function(req, res) {
  UsgsService.getJaitReading().then(function(usgsResult) {
    res.render('index', {
      gaugeReading: usgsResult,
      mapApiKey: MAP_API_KEY
    });
  });
});

app.get("/search", function(req, res) {
  UsgsService.getJaitTimeSeries().then(function(usgsResult) {
    res.render('search', {
      timeSeriesData: usgsResult
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);
