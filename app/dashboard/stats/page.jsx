"use client";
import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import { Row, Col, Card, Table, Spin, Alert, Divider } from "antd";
import axios from "axios";

const Stats = () => {
  const [riskSummaryData, setRiskSummaryData] = useState([]);
  const [topFiveRisk, setTopFiveRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/statistics");
        setRiskSummaryData(response.data);
        setTopFiveRisk(response.data.topFiveRisks);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("topFiveRisks", topFiveRisk);
  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to fetch data" type="error" />
    );
  }

  const riskSummaryColumn = [
    {
      title: "Name",
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: "Current Risk",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Residual Risk",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "%",
      dataIndex: "address",
      key: "address",
    },
  ];
  if (loading) {
    return (
      <div className={styles.centeredSpinner}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to fetch data" type="error" />
    );
  }

  const columns = [
    {
      title: "Risk#",
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: "Risk Domain",
      dataIndex: "category",
      key: "category_name",
      render: (text, record) => record.category.category_name,
    },
    {
      title: "Risk Name",
      dataIndex: "risk_name",
      key: "risk_name",
    },
    {
      title: "risk Owner",
      dataIndex: "risk_owner",
      key: "risk_owner",
    },
    {
      title: "Risk Value",
      dataIndex: "risk_matrix",
      key: "risk_value",
      render: (text, record) => {
        const color = record.risk_matrix.color.startsWith("#")
          ? record.risk_matrix.color
          : `#${record.risk_matrix.color}`;
        const isCriticalStepDefined =
          record.risk_matrix.critical_step !== undefined &&
          record.risk_matrix.critical_step !== "";
        return (
          <div
            style={{
              backgroundColor: color,
              borderRadius: "8px",
              padding: "5px 10px",
              color: isCriticalStepDefined ? "#000" : "#fff",
              textAlign: "center",
            }}
          >
            {record.risk_matrix.critical_step}
          </div>
        );
      },
    },
    {
      title: "Consequence",
      dataIndex: "Consequence",
      key: "Consequence",
    },
  ];
  const gradientColors = [
    "linear-gradient(135deg, #667eea 0%, #7ACDF6 100%)",
    "linear-gradient(135deg, #667eea 0%, #7ACDF6 100%)",
    "linear-gradient(135deg, #667eea 0%, #7ACDF6 100%)",
    "linear-gradient(135deg, #667eea 0%, #7ACDF6 100%)",
  ];

  const shadowStyles = [
    "0px 4px 20px rgba(0, 0, 0, 0.1)",
    "0px 4px 20px rgba(0, 0, 0, 0.1)",
    "0px 4px 20px rgba(0, 0, 0, 0.1)",
    "0px 4px 20px rgba(0, 0, 0, 0.1)",
  ];

  return (
    <>
      {/* top */}
      <Row gutter={24}>
        <Col xs={24} sm={12} md={12} lg={8} xl={6} className="mb-24">
          <Card
            bordered={false}
            style={{
              margin: "5px",
              backgroundImage: gradientColors[0],
              boxShadow: shadowStyles[0],
            }}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h2>Action</h2>
                <Divider style={{ backgroundColor: "black" }} />
              </div>
              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span>Total</span>
                  <span>5</span>
                </div>
                <div className={styles.statItem}>
                  <span>Open</span>
                  <span>2</span>
                </div>
                <div className={styles.statItem}>
                  <span>Closed</span>
                  <span>3</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={6} className="mb-24">
          <Card
            bordered={false}
            style={{
              margin: "5px",
              backgroundImage: gradientColors[1],
              boxShadow: shadowStyles[1],
            }}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h2>Mitigated %</h2>
                <Divider style={{ backgroundColor: "black" }} />
              </div>
              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span>Total</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={6} className="mb-24">
          <Card
            bordered={false}
            style={{
              margin: "5px",
              backgroundImage: gradientColors[2],
              boxShadow: shadowStyles[2],
            }}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h2>Accepted</h2>
                <Divider style={{ backgroundColor: "black" }} />
              </div>
              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span>Total</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={6} className="mb-24">
          <Card
            bordered={false}
            style={{
              margin: "5px",
              backgroundImage: gradientColors[3],
              boxShadow: shadowStyles[3],
            }}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h2>Total Risk</h2>
                <Divider style={{ backgroundColor: "black" }} />
              </div>
              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span>Total</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Row style={{ margin: "18px", gap: "80px" }}>
        {/* <Col span={11}> <Table dataSource={riskSummaryData} columns={riskSummaryColumn} pagination={false} /></Col> */}
        <div>
          <h1>Top Five Risk</h1>
          <Table
            bordered
            dataSource={topFiveRisk}
            columns={columns}
            pagination={false}
          />
        </div>
        <div>
          <h1>Risk Summary</h1>
          <Table
            dataSource={topFiveRisk}
            columns={riskSummaryColumn}
            pagination={false}
          />
        </div>
      </Row>
    </>
  );
};

export default Stats;
