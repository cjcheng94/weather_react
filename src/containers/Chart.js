import React, { Component } from "react";
import { connect } from "react-redux";
import echarts from "echarts/lib/echarts";
import { mapData } from "../selectors";

import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/title";
import "echarts/lib/component/axisPointer";
import "echarts/theme/macarons";

//change chart style on smaller devices
const innerMargin = window.innerWidth < 576? 25: 50;
  
class Chart extends Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }
  instantiateChart() {
    const weatherChart = echarts.init(
      document.getElementById("chart"),
      "macarons"
    );
    weatherChart.setOption({
      tooltip: {
        trigger: "axis",
        formatter: params => {
          let tooltipHtml = "";
          if (params[0].seriesName === "Humidity") {
            let shift = params.shift();
            params.push(shift);
          }
          tooltipHtml = `${params[0].name}<br/>
							${params[3].value}<img src=${params[2].value} /><br/>
							${params[0].marker}${params[0].seriesName}: ${params[0].value} C\xB0<br/>
							${params[1].marker}${params[1].seriesName}: ${params[1].value || 0}mm<br/>
							${params[4].marker}${params[4].seriesName}: ${params[4].value}%<br/>`;
          return tooltipHtml;
        }
      },
      legend: {
        data: ["Temperature", "Humidity", "Rain"],
        x: "center",
        top: 10
      },
      axisPointer: {
        link: { xAxisIndex: "all" }
      },
      grid: [
        {
          top: "10%",
          left: innerMargin,
          right: innerMargin,
          height: "50%"
        },
        {
          left: innerMargin,
          right: innerMargin,
          bottom: 60,
          height: "20%"
        }
      ],
      xAxis: [
        {
          type: "category",
          data: this.props.timePoints,
          show: false
        },
        {
          gridIndex: 1,
          type: "category",
          boundaryGap: false,
          data: this.props.timePoints
        }
      ],
      yAxis: [
        {
          name: "C\xB0",
          type: "value",
          nameGap: 3,
          scale: true
        },
        {
          name: "mm",
          nameGap: 3,
          type: "value",
          scale: true
        },
        {
          gridIndex: 1,
          name: "%",
          nameGap: 2,
          type: "value",
          interval: 20,
          scale: true
        }
      ],
      series: [
        {
          name: "Temperature",
          type: "line",
          smooth: true,
          data: this.props.temps
        },
        {
          name: "Rain",
          type: "bar",
          yAxisIndex: 1,
          data: this.props.rain
        },

        {
          name: "Humidity",
          type: "line",
          areaStyle: {},
          xAxisIndex: 1,
          yAxisIndex: 2,
          smooth: true,
          data: this.props.humidity
        },
        {
          name: "Icon",
          type: "line",
          show: false,
          data: this.props.iconUrl
        },
        {
          name: "Description",
          type: "line",
          show: false,
          data: this.props.description
        }
      ],
      dataZoom: [
        {
          show: true,
          realtime: true,
          xAxisIndex: [0, 1]
        },
        {
          type: "inside",
          realtime: true,
          xAxisIndex: [0, 1]
        }
      ]
    });
    window.addEventListener("resize", this.handleResize, false);
    return weatherChart;
  }
  handleResize() {
    // -> weatherChart.resize()
    //for removing event listener later
    this.instantiateChart().resize();
  }
  componentDidUpdate() {
    this.instantiateChart();
  }
  componentDidMount() {
    this.instantiateChart();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
  }

  render() {
    return <div id="chart" className="col-sm-12" />;
  }
}

const mapStateToProps = state => {
  const mapDataWithState = mapData(state);
  return {
    temps: mapDataWithState("tempList"),
    timePoints: mapDataWithState("timePoints"),
    humidity: mapDataWithState("humidity"),
    rain: mapDataWithState("rain"),
    description: mapDataWithState("description"),
    iconUrl: mapDataWithState("iconUrl")
  };
};

export default connect(mapStateToProps)(Chart);