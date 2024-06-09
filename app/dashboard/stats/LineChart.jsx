"use client";
import React, { useEffect } from "react";
import { Line } from "@ant-design/plots";
import { Card } from "antd";

const LineChart = ({ riskSummaryData }) => {
  useEffect(() => {}, [riskSummaryData]);
  console.log("riskSummaryData", riskSummaryData);

  //   const transformedData = Object.keys(riskSummaryData.slaViolations).map(
  //     (key) => ({
  //       year: key,
  //       value: riskSummaryData.slaViolations[key].total_count,
  //     })
  //   );
  const transformedData = [
    { year: "1987", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  console.log("transformedData", transformedData);
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
