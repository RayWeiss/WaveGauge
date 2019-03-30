const FlowDataPoint = require('./flow_data_point.js');

class TimeSeriesReadingModel {
  constructor(tabbedResponse) {
    this.labels = [];
    this.rates = [];
    this.points = [];

    tabbedResponse.split('\n')
    .filter(line => line[0] != "#" && line.includes("USGS"))
    .map(line => {
      var splitLine = line.split('\t');
      this.labels.push(splitLine[2].toString());
      this.rates.push(splitLine[4].toString());
      this.points.push(new FlowDataPoint(splitLine[2], splitLine[4]));
    });
  }
}

module.exports = TimeSeriesReadingModel;
