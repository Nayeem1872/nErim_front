"use client";
import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import { Row, Col, Card, Table, Spin, Alert, Divider } from "antd";
import axios from "axios";
import StatusRange from "./StatusRange";
import LineChart from "./LineChart";

const Stats = () => {
  const [riskSummaryData, setRiskSummaryData] = useState([]);
  const [topFiveRisk, setTopFiveRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskWithInLimit, setRiskWithInLimit] = useState([]);
  const [riskWithOutLimit, setRiskWithOutLimit] = useState([]);
  const [slaViolations, setSlaViolations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/statistics");
        setRiskSummaryData(response.data);
        setTopFiveRisk(response.data.topFiveRisks);
        setRiskWithInLimit(response?.data?.riskWithInLimit);
        setRiskWithOutLimit(response.data.riskWithOutLimit);
        // setSlaViolations(response.data.slaViolations);

        const formattedData = [];

        Object.keys(response.data.slaViolations).forEach((riskOwner) => {
          const ownerData = response.data.slaViolations[riskOwner];
          const percentageViolated = response.data.slaViolations.total_count ? (response.data.slaViolations.violation / response.data.slaViolations.total_count) * 100 : 0;
          formattedData.push({
            risk_owner: riskOwner,
            total_count: ownerData.total_count,
            violation: ownerData.violation,
            assigned_risks: ownerData.data.map((d) => d.treat_name).join(", "),
            percentage_violated: percentageViolated.toFixed(2) // assuming assigned risks are the treat_names
          });
        });

        setSlaViolations(formattedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      dataIndex: "name",
      key: "name",
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
      render: (text, record) => record?.category?.category_name,
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
      dataIndex: "potential_impact",
      key: "potential_impact",
    },
    {
      title: "Risk Casused",
      dataIndex: "risk_casuse",
      key: "risk_casuse",
    },
    {
      title: "Description",
      dataIndex: "risk_identified",
      key: "risk_identified",
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

  const riskWithInLimitColumns = [
    {
      title: "Risk Id",
      dataIndex: "refId",
      key: "refId",
    },
    // {
    //   title: "Risk Domain",
    //   dataIndex: "category",
    //   key: "category_name",
    //   render: (text, record) => record.category.category_name,
    // },
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
    // {
    //   title: "Risk Value",
    //   dataIndex: "risk_matrix",
    //   key: "risk_value",
    //   render: (text, record) => {
    //     const color = record.risk_matrix.color.startsWith("#")
    //       ? record.risk_matrix.color
    //       : `#${record.risk_matrix.color}`;
    //     const isCriticalStepDefined =
    //       record.risk_matrix.critical_step !== undefined &&
    //       record.risk_matrix.critical_step !== "";
    //     return (
    //       <div
    //         style={{
    //           backgroundColor: color,
    //           borderRadius: "8px",
    //           padding: "5px 10px",
    //           color: isCriticalStepDefined ? "#000" : "#fff",
    //           textAlign: "center",
    //         }}
    //       >
    //         {record.risk_matrix.critical_step}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Details",
      dataIndex: "risk_identified",
      key: "risk_identified",
    },
  ];
  const riskWithOutLimitColumns = [
    {
      title: "Risk Id",
      dataIndex: "refId",
      key: "refId",
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
      title: "Details",
      dataIndex: "risk_identified",
      key: "risk_identified",
    },
  ];

  const slaViolationsColumns = [
    {
      title: "Risk owner",
      dataIndex: "risk_owner",
      key: "risk_owner",
    },
    {
      title: "Assigned Risks",
      dataIndex: "total_count",
      key: "total_count",
    },
    {
      title: "SlA Violated Number",
      dataIndex: "violation", // Assuming this should be dataIndex: "total_count"
      key: "violation",
    },
    {
      title: "SLA Violated (%)",
      dataIndex: "percentage_violated",
      key: "percentage_violated",
      render: (text) => `${text}%`
    }
  ];

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
    {
      key: '3',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
    {
      key: '4',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
    {
      key: '5',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
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
                <h2>Mitigated</h2>
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
      
        <div style={{marginTop:"10px"}}>
          <Divider>
          <h2>Top Five Risk</h2>
        </Divider>
          <Table
            bordered
            dataSource={topFiveRisk}
            columns={columns}
            pagination={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
        </div>
    

      <div style={{ marginTop: "30px" }}>
        <Divider>
          <h2>Risk Threshold</h2>
        </Divider>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <h3>Risk Below Appatite</h3>
          <Table
            bordered
            dataSource={riskWithInLimit}
            columns={riskWithInLimitColumns}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
        </Col>
        <Col span={12}>
          <h3>Risk Upper Appatite</h3>
          <Table
            bordered
            dataSource={riskWithOutLimit}
            columns={riskWithOutLimitColumns}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
        </Col>
      </Row>

      <div>
        <Divider>
          <h2>SLA Violation</h2>
        </Divider>
        <Row gutter={16}>
        <Col span={12}>
        <Table
            dataSource={slaViolations}
            columns={slaViolationsColumns}
            // pagination={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
        </Col>
        <Col span={12}>
       <LineChart riskSummaryData={riskSummaryData}/>
        </Col>
      </Row>
        
      </div>
    <StatusRange/>
    </>
  );
};

export default Stats;