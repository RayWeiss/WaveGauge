var express = require('express');
var path = require('path');
var formidable = require('express-formidable');
const UsgsService = require('./js/usgs_service.js');
const MAP_API_KEY = process.env.MAP_API_KEY || "libraries=visualization&sensor=true_or_false";

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(formidable());

app.get("/", function(req, res) {
  UsgsService.getJaitReading().then(function(usgsResult) {
    res.render('index', {
      gaugeReading: usgsResult,
      mapApiKey: MAP_API_KEY
    });
  });
});

app.get("/search", function(req, res) {
  var data = JSON.parse(JSON.stringify(req.query));
  var id = "04206425";
  var startDate = data.startDate;
  var endDate = data.endDate;
  if(startDate && endDate) {
    UsgsService.getTimeSeries(id, startDate, endDate).then(function(usgsResult) {
      res.render('search', {
        timeSeriesData: usgsResult
      });
    });
  } else {
    UsgsService.getTimeSeries(id).then(function(usgsResult) {
      res.render('search', {
        timeSeriesData: usgsResult
      });
    });
  };
});

app.post("/search", function(req, res) {
  var data = JSON.parse(JSON.stringify(req.fields));
  let startDate = data.startDate
  let endDate = data.endDate
  if (startDate.length > 0 && endDate.length > 0) {
    let queryString = "?startDate=" + data.startDate + "&endDate=" + data.endDate
    res.redirect("/search" + queryString)
  } else {
    res.redirect("/search")
  };
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);
