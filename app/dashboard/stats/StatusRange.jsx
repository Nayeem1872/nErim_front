import { Divider, Flex, Radio, DatePicker, Button } from "antd";
import React, { useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const { RangePicker } = DatePicker;

const StatusRange = () => {
  const [rangeType, setRangeType] = useState("year");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chart, setChart] = useState(null);
  const [root, setRoot] = useState(null);

  const handleRangeTypeChange = (e) => {
    setRangeType(e.target.value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSearch = () => {
    const [start, end] = dateRange;
    if (start && end) {
      const startYear = start.year();
      const endYear = end.year();
      const filteredData = data.filter((item) => {
        const year = parseInt(item.year, 10);
        return year >= startYear && year <= endYear;
      });
      updateChart(filteredData);
    }
  };

  const data = [
    { "year": "2016", "europe": 2.1, "namerica": 2.3, "asia": 2.0, "lamerica": 1.2, "meast": 0.7, "africa": 0.5 },
    { "year": "2017", "europe": 2.3, "namerica": 2.4, "asia": 2.1, "lamerica": 1.3, "meast": 0.8, "africa": 0.6 },
    { "year": "2018", "europe": 2.4, "namerica": 2.5, "asia": 2.2, "lamerica": 1.1, "meast": 0.6, "africa": 0.4 },
    { "year": "2019", "europe": 2.5, "namerica": 2.6, "asia": 2.3, "lamerica": 1.0, "meast": 0.5, "africa": 0.3 },
    { "year": "2020", "europe": 2.6, "namerica": 2.7, "asia": 2.2, "lamerica": 0.5, "meast": 0.4, "africa": 0.3 },
    { "year": "2021", "europe": 2.5, "namerica": 2.5, "asia": 2.1, "lamerica": 1, "meast": 0.8, "africa": 0.4 },
    { "year": "2022", "europe": 2.6, "namerica": 2.7, "asia": 2.2, "lamerica": 0.5, "meast": 0.4, "africa": 0.3 },
    { "year": "2023", "europe": 2.8, "namerica": 2.9, "asia": 2.4, "lamerica": 0.3, "meast": 0.9, "africa": 0.5 },
    { "year": "2025", "europe": 2.8, "namerica": 2.9, "asia": 2.4, "lamerica": 0.3, "meast": 0.9, "africa": 0.5 },
    { "year": "2027", "europe": 2.8, "namerica": 2.9, "asia": 2.4, "lamerica": 0.3, "meast": 0.9, "africa": 0.5 }
  ];

  const updateChart = (filteredData) => {
    if (chart && root) {
      chart.series.each((series) => {
        series.data.setAll(filteredData);
      });
      chart.xAxes.getIndex(0).data.setAll(filteredData);
    }
  };

  useEffect(() => {
    // Create root element
    const rootInstance = am5.Root.new("chartdiv");

    // Set themes
    rootInstance.setThemes([am5themes_Animated.new(rootInstance)]);

    // Create chart
    const chartInstance = rootInstance.container.children.push(
      am5xy.XYChart.new(rootInstance, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        layout: rootInstance.verticalLayout
      })
    );

    // Add legend
    const legend = chartInstance.children.push(
      am5.Legend.new(rootInstance, {
        centerX: am5.p50,
        x: am5.p50
      })
    );

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(rootInstance, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true
    });

    const xAxis = chartInstance.xAxes.push(
      am5xy.CategoryAxis.new(rootInstance, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(rootInstance, {})
      })
    );

    xRenderer.grid.template.setAll({
      location: 1
    });

    xAxis.data.setAll(data);

    const yAxis = chartInstance.yAxes.push(
      am5xy.ValueAxis.new(rootInstance, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(rootInstance, {
          strokeOpacity: 0.1
        })
      })
    );

    // Add series
    function makeSeries(name, fieldName, stacked) {
      const series = chartInstance.series.push(
        am5xy.ColumnSeries.new(rootInstance, {
          stacked: stacked,
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "year"
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(90),
        tooltipY: am5.percent(10)
      });

      series.data.setAll(data);

      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(rootInstance, {
          locationY: 0.5,
          sprite: am5.Label.new(rootInstance, {
            text: "{valueY}",
            fill: rootInstance.interfaceColors.get("alternativeText"),
            centerY: am5.percent(50),
            centerX: am5.percent(50),
            populateText: true
          })
        });
      });

      legend.data.push(series);
    }

    makeSeries("Europe", "europe", false);
    makeSeries("North America", "namerica", true);
    makeSeries("Asia", "asia", false);
    makeSeries("Latin America", "lamerica", true);
    makeSeries("Middle East", "meast", true);
    makeSeries("Africa", "africa", true);

    chartInstance.appear(1000, 100);

    setChart(chartInstance);
    setRoot(rootInstance);

    return () => {
      rootInstance.dispose();
    };
  }, []);

  return (
    <>
      <Divider>
        <h2>Status Range</h2>
      </Divider>

      <Flex
        direction="vertical"
        align="center"
        style={{ gap: "10px", marginBottom: "10px" }}
      >
        <Radio.Group
          defaultValue="year"
          buttonStyle="solid"
          onChange={handleRangeTypeChange}
        >
          <Radio.Button value="year">Year</Radio.Button>
          <Radio.Button value="quarter">Quarter</Radio.Button>
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="week">Week</Radio.Button>
          <Radio.Button value="custom">Custom</Radio.Button>
        </Radio.Group>
      </Flex>

      <Flex
        direction="vertical"
        align="center"
        style={{ gap: '10px', marginBottom: '10px' }}
      >
        {rangeType === 'custom' ? (
          <RangePicker onChange={handleDateRangeChange} />
        ) : (
          <RangePicker picker={rangeType} onChange={handleDateRangeChange} />
        )}
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </Flex>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </>
  );
};

export default StatusRange;
