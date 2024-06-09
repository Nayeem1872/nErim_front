import { Divider, Flex, Radio, DatePicker, Button } from "antd";
import React, { useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

const StatusRange = ({ riskSummaryData }) => {
  const { t } = useTranslation();
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
      const startDate = start.startOf(rangeType).valueOf();
      const endDate = end.endOf(rangeType).valueOf();
      const filteredData = riskSummaryData.dateWiseData.filter((item) => {
        const itemDate = moment(item.date, "DD MMMM YYYY");
        return itemDate.valueOf() >= startDate && itemDate.valueOf() <= endDate;
      });
      updateChart(filteredData);
    }
  };

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
        layout: rootInstance.verticalLayout,
      })
    );

    // Add legend
    const legend = chartInstance.children.push(
      am5.Legend.new(rootInstance, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(rootInstance, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
    });

    const xAxis = chartInstance.xAxes.push(
      am5xy.CategoryAxis.new(rootInstance, {
        categoryField: "date",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(rootInstance, {}),
      })
    );

    xRenderer.grid.template.setAll({
      location: 1,
    });

    xAxis.data.setAll(riskSummaryData.dateWiseData);

    const yAxis = chartInstance.yAxes.push(
      am5xy.ValueAxis.new(rootInstance, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(rootInstance, {
          strokeOpacity: 0.1,
        }),
      })
    );

    // Add series dynamically
    const firstDataPoint = riskSummaryData.dateWiseData[0];
    Object.keys(firstDataPoint).forEach((key) => {
      if (key !== "date") {
        makeSeries(key, key, false);
      }
    });

    function makeSeries(name, fieldName, stacked) {
      const series = chartInstance.series.push(
        am5xy.ColumnSeries.new(rootInstance, {
          stacked: stacked,
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "date",
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY}",
        width: am5.percent(90),
        tooltipY: am5.percent(10),
      });

      series.data.setAll(riskSummaryData.dateWiseData);

      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(rootInstance, {
          locationY: 0.5,
          sprite: am5.Label.new(rootInstance, {
            text: "{valueY}",
            fill: rootInstance.interfaceColors.get("alternativeText"),
            centerY: am5.percent(50),
            centerX: am5.percent(50),
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
    }

    chartInstance.appear(1000, 100);

    setChart(chartInstance);
    setRoot(rootInstance);

    return () => {
      rootInstance.dispose();
    };
  }, [riskSummaryData.dateWiseData]);

  return (
    <>
      <Divider>
        <h2>{t("stats.Risk Status Report")}</h2>
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
          <Radio.Button value="year">{t("stats.Year")}</Radio.Button>
          <Radio.Button value="quarter"> {t("stats.Quarter")}</Radio.Button>
          <Radio.Button value="month"> {t("stats.Month")}</Radio.Button>
          <Radio.Button value="week"> {t("stats.Week")}</Radio.Button>
          <Radio.Button value="custom">{t("stats.Custom")}</Radio.Button>
        </Radio.Group>
      </Flex>

      <Flex
        direction="vertical"
        align="center"
        style={{ gap: "10px", marginBottom: "10px" }}
      >
        {rangeType === "custom" ? (
          <RangePicker onChange={handleDateRangeChange} />
        ) : (
          <RangePicker picker={rangeType} onChange={handleDateRangeChange} />
        )}
        <Button type="primary" onClick={handleSearch}>
          {t("stats.Search")}
        </Button>
      </Flex>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </>
  );
};

export default StatusRange;
