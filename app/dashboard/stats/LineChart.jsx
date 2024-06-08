"use client";
import React from "react";
import { Line } from "@ant-design/plots";
import { Card } from "antd";

const LineChart = ({ riskSummaryData }) => {

  const transformedData = Object.keys(riskSummaryData.slaViolations).map(
    (key) => ({
      year: key,
      value: riskSummaryData.slaViolations[key].total_count,
    })
  );
  const config = {
    data: transformedData, 
    xField: "year",
    yField: "value",
    point: {
      size: 8,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    tooltip: {
      showMarkers: true,
    },
    smooth: true,
    height: 600,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       
      }}
    >
      <Card style={{ textAlign: "center" }}>
        <Line {...config} />
      </Card>
    </div>
  );
};

export default LineChart;
