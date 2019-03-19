var request = require('request');
const GaugeReadingModel = require('./gauge_reading_model.js');
const TimeSeriesReadingModel = require('./time_series_reading_model.js');

class UsgsService {
  static getInstantValueURL(siteNumber) {
    return "https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites="
            + siteNumber
            + "&parameterCd=00060&siteStatus=all";
  }

  static getTimeSeriesURL(siteNumber, beginDate, endDate) {
    return "https://waterdata.usgs.gov/oh/nwis/uv?search_site_no="
            + siteNumber
            + "&index_pmcode_00060=1&sitefile_output_format=html_table&column_name=agency_cd&column_name=site_no&column_name=station_nm&range_selection=date_range&begin_date="
            + beginDate
            + "&end_date="
            + endDate
            + "&format=rdb&date_format=YYYY-MM-DD";
  }

  static getJaitReading() {
    return new Promise((resolve, reject) => {
      request(this.getInstantValueURL("04206425"), function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var jaitJson = JSON.parse(body);
          resolve(new GaugeReadingModel(jaitJson));
        }
      });
    });
  }

  static getJaitTimeSeries() {
    return new Promise((resolve, reject) => {
      request(this.getTimeSeriesURL("04206425", "2019-01-01", "2019-01-04"), function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(new TimeSeriesReadingModel(body));
        }
      });
    });
  }
}

module.exports = UsgsService;

// function parseTimeseries(data) {
//   var stringData = data.toString();
//   var lines = stringData.split("\n");
//
//   lines.forEach(function(line) {
//     if (!line.includes("#")) {
//       if (line.includes("USGS")) {
//         var splitLine = line.split("\t");
//         var datetime = splitLine[2];
//         if (datetime.split(":")[1] == "45") {
//           var cfs = splitLine[4];
//           console.log(`Time: ${datetime} \t CFS: ${cfs}`);
//           // console.log(line);
//         }
//         // var person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};
//       }
//     }
//   });
// }
//
// request(timeseriesJaitURL, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     // console.log(body);
//     parseTimeseries(body)
//   } else {
//     console.log(error);
//     console.log(response.statusCode);
//   }
// });
