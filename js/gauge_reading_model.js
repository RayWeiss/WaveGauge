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
  
  module.exports = GaugeReadingModel;
  