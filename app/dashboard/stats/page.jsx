"use client";
import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import {
  Row,
  Col,
  Card,
  Table,
  Spin,
  Alert,
  Divider,
  Button,
  Modal,
  Breadcrumb,
  FloatButton,
} from "antd";
import axios from "axios";
import StatusRange from "./StatusRange";
import Dots from "../components/DotLoader";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, CloudDownload, Download } from "lucide-react";
import {
  CaretRightOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const Stats = () => {
  const { t } = useTranslation();
  const [riskSummaryData, setRiskSummaryData] = useState([]);
  const [topFiveRisk, setTopFiveRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskWithInLimit, setRiskWithInLimit] = useState([]);
  const [riskWithOutLimit, setRiskWithOutLimit] = useState([]);
  const [slaViolations, setSlaViolations] = useState([]);
  const [apatiteValue, setApatiteValue] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalBelowVisible, setIsModalBelowVisible] = useState(false);
  const [isModalUpperVisible, setIsModalUpperVisible] = useState(false);
  const [isModalDataExporVisible, setIsModalDataExporVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/statistics");
        setRiskSummaryData(response.data);
        setApatiteValue(response.data.appetiteValue);
        setTopFiveRisk(response.data.topFiveRisks);
        setRiskWithInLimit(response.data.riskWithInLimit);
        setRiskWithOutLimit(response.data.riskWithOutLimit);
        // setSlaViolations(response.data.slaViolations);

        const formattedData = [];

        Object.keys(response.data.slaViolations).forEach((riskOwner) => {
          const ownerData = response.data.slaViolations[riskOwner];
          const percentageViolated = response.data.slaViolations.total_count
            ? (response.data.slaViolations.violation /
                response.data.slaViolations.total_count) *
              100
            : 0;
          formattedData.push({
            risk_owner: riskOwner,
            total_count: ownerData.total_count,
            violation: ownerData.violation,
            assigned_risks: ownerData.data.map((d) => d.treat_name).join(", "),
            percentage_violated: percentageViolated.toFixed(2), // assuming assigned risks are the treat_names
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
    return <Dots />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to fetch data" type="error" />
    );
  }
  const columns = [
    {
      title: t("stats.Risk"),
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: t("stats.Risk Domain"),
      dataIndex: "category",
      key: "category",
      render: (category, record, index) => {
        // Predefined colors array
        const colors = ["#81C3D7", "#F3DE8A", "#EB9486", "#3A7CA5", "#97A7B3"];
        // Cycle through the colors array
        const backgroundColor = colors[index % colors.length];
        return (
          <div
            style={{
              backgroundColor: backgroundColor,
              borderRadius: "8px",
              padding: "5px 10px",
              color: "#000", // Set text color to black
              textAlign: "center",
            }}
          >
            {category?.category_name}
          </div>
        );
      },
    },
    {
      title: t("stats.Risk Name"),
      dataIndex: "risk_name",
      key: "risk_name",
    },
    {
      title: t("stats.risk Owner"),
      dataIndex: "risk_owner",
      key: "risk_owner",
    },
    {
      title: t("stats.Risk Value"),
      dataIndex: "risk_matrix",
      key: "risk_value",
      render: (text, record) => {
        if (!record?.risk_matrix) {
          // If risk_matrix is null or undefined, render normally
          return <div style={{ textAlign: "center" }}>{text}</div>;
        }
    
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
      title: t("stats.Consequence"),
      dataIndex: "potential_impact",
      key: "potential_impact",
    },
    {
      title: t("stats.Risk Casused"),
      dataIndex: "risk_casuse",
      key: "risk_casuse",
    },
    {
      title: t("stats.Description"),
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
      title: t("stats.Risk Id"),
      dataIndex: "refId",
      key: "refId",
    },

    {
      title: t("stats.Risk Name"),
      dataIndex: "risk_name",
      key: "risk_name",
    },
    {
      title: t("stats.risk Owner"),
      dataIndex: "risk_owner",
      key: "risk_owner",
    },

    {
      title: t("stats.Details"),
      dataIndex: "risk_identified",
      key: "risk_identified",
    },
    {
      title: t("stats.Risk Apatite Value"),
      dataIndex: "risk_identified",
      render: (text, record) => {
        const criticalityScore =
          record.risk_consequence_id * record.risk_likelihood_id;
        return <div>{criticalityScore}</div>;
      },
    },
  ];
  const riskWithOutLimitColumns = [
    {
      title: t("stats.Risk Id"),
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: t("stats.Risk Name"),
      dataIndex: "risk_name",
      key: "risk_name",
    },
    {
      title: t("stats.risk Owner"),
      dataIndex: "risk_owner",
      key: "risk_owner",
    },
    {
      title: t("stats.Details"),
      dataIndex: "risk_identified",
      key: "risk_identified",
    },
    {
      title: t("stats.Risk Apatite Value"),
      dataIndex: "risk_identified",
      render: (text, record) => {
        const criticalityScore =
          record.risk_consequence_id * record.risk_likelihood_id;
        return <div>{criticalityScore}</div>;
      },
    },
  ];

  const slaViolationsColumns = [
    {
      title: t("stats.Risk owner"),
      dataIndex: "risk_owner",
      key: "risk_owner",
    },
    {
      title: t("stats.Assigned Risks"),
      dataIndex: "total_count",
      key: "total_count",
    },
    {
      title: t("stats.SlA Violated Number"),
      dataIndex: "violation",
      key: "violation",
      render: (text, record) => (
        <p
          style={{
            textDecoration: "underline",
            color: "#4096FF",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => handleViolationClick(record.risk_owner)}
        >
          {text}
        </p>
      ),
    },
    {
      title: t("stats.SLA Violated (%)"),
      dataIndex: "percentage_violated",
      key: "percentage_violated",
      render: (text, record) => {
        const percentage = record.total_count
          ? ((record.violation / record.total_count) * 100).toFixed(2)
          : 0;
        return `${percentage}%`;
      },
    },
  ];

  // const [riskOwner, setRiskOwner] = useState('');

  // const [error, setError] = useState(null);

  const handleViolationClick = async (riskOwner) => {
 
    try {
  
      const response = await axios.get(`/api/violations/data/${riskOwner}`);
     
  
      setResponseData(response.data);
      setError(null);
    } catch (error) {
      // Handle error
      console.error("Error making GET request:", error);
      setError(error);
      setResponseData(null);
    }
  };

  const ViolationColumns = [
    {
      title: t("stats.ID"),
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: t("stats.Risk owner"),
      dataIndex: "treat_owner",
      key: "treat_owner",
    },
    {
      title: t("stats.Decision"),
      dataIndex: "treat_status",
      key: "treat_status",
    },
    {
      title: t("stats.Email"),
      dataIndex: "action_owner_email",
      key: "action_owner_email",
    },
    {
      title: t("stats.Closing Date"),
      dataIndex: "closing_date",
      key: "closing_date",
    },
    {
      title: t("stats.Finished Date"),
      dataIndex: "finished_date",
      key: "finished_date",
    },
  ];

  // modal top Five Risk

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      // Perform the GET request to export the file here
      const response = await axios.get("/api/export/top-five-risk", {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "TopFiveRisk.csv");

      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link from the document body
      document.body.removeChild(link);

      // Stop loading after successful download
      setConfirmLoading(false);

      message.success("Downloaded!");
      
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalDataExporVisible(false);
    setIsModalBelowVisible(false);
    setIsModalUpperVisible(false);
  };
  // SLA Below Modal

  const showBelowModal = () => {
    setIsModalBelowVisible(true);
  };

  const handleBelowOk = async () => {
    setIsModalBelowVisible(false);
    try {
      // Perform the GET request to export the file here
      const response = await axios.get("/api/export/with-in-limit", {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "BelowAppatite.csv");

      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link from the document body
      document.body.removeChild(link);

      // Stop loading after successful download
      setConfirmLoading(false);

      message.success("Downloaded!");
    
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const showUpperModal = () => {
    setIsModalUpperVisible(true);
  };

  const handleUpperOk = async () => {
    setIsModalUpperVisible(false);
    try {
      // Perform the GET request to export the file here
      const response = await axios.get("/api/export/with-out-limit", {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "UpperApatite.csv");

      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link from the document body
      document.body.removeChild(link);

      // Stop loading after successful download
      setConfirmLoading(false);

      message.success("Downloaded!");
   
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  // SLA Violation Modal

  const showDataExportModal = () => {
    setIsModalDataExporVisible(true);
  };

  const handleDataExport = async () => {
    setIsModalDataExporVisible(false);
    try {
      // Perform the GET request to export the data file here
      const response = await axios.get("/api/export/sla-violations", {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "SLA.csv");

      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link from the document body
      document.body.removeChild(link);

      // Stop loading after successful download
      setConfirmLoading(false);

      message.success("Downloaded!");

    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };
  const breadcrumbItems = [
    {
      key: "dashboard",
      title: (
        <a
          onClick={() => {
            router.push(`/dashboard`);
          }}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <LayoutDashboard
            style={{ fontSize: "20px", marginBottom: "2px" }}
            color="#0D85D8"
          />
        </a>
      ),
    },
    {
      key: "statesMenu",
      title: (
        <div>
          <span style={{ fontSize: "15px", color: "gray" }}>
            {t("side_navbar.States Menu")}
          </span>
        </div>
      ),
      style: { marginBottom: "20px" },
    },
  ];

  return (
    <>
    {/* top */}
    <Breadcrumb style={{ padding: "10px" }} items={breadcrumbItems} />
    <Divider />
    <Row gutter={[16, 16]} justify="center">
    <Col xs={24} sm={12} md={12} lg={8} xl={6}>
  <Card
    bordered={false}
    style={{
      margin: "5px",
      height: "220px",
      backgroundColor: "#2f6690",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      color: "#fff",
    }}
  >
    <div className={styles.cardContent}>
      <div className={styles.cardHeader}>
        <h2>
          <ThunderboltOutlined style={{ marginRight: "10px", color: "#fff" }} />
          {t("stats.Action")}
        </h2>
        <Divider style={{ backgroundColor: "#fff" }} />
      </div>
      <div className={styles.cardStats}>
        <div className={styles.statItem}>
          <div style={{ display: "flex", gap: "27px", flexWrap: "wrap", justifyContent: "center" }}>
            {Object.keys(riskSummaryData.registerWithStatus).map((status, index) => (
              <div key={index} className={styles.statItem} style={{ textAlign: "center", fontSize: "18px" }}>
                <span style={{ fontWeight: "bold" }}>{status}</span>
                <br />
                <span>{riskSummaryData.registerWithStatus[status].total_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Card>
</Col>



      <Col xs={24} sm={12} md={12} lg={8} xl={6}>
        <Card
          bordered={false}
          style={{
            margin: "5px",
            backgroundColor: "#3a7ca5",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            height: "220px",
            color: "#fff",
          }}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h2>
                <SafetyOutlined style={{ marginRight: "10px", color: "#fff" }} />
                {t("stats.Mitigated")}
              </h2>
              <Divider style={{ backgroundColor: "#fff" }} />
            </div>
            <div className={styles.cardStats}>
              <div className={styles.statItem} style={{ marginTop: "18px" }}>
                <span>{riskSummaryData.totalMitigate}</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={12} lg={8} xl={6}>
        <Card
          bordered={false}
          style={{
            margin: "5px",
            backgroundColor: "#00607a",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            height: "220px",
            color: "#fff",
          }}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h2>
                <CheckCircleOutlined style={{ marginRight: "10px", color: "#fff" }} />
                {t("stats.Accepted")}
              </h2>
              <Divider style={{ backgroundColor: "#fff" }} />
            </div>
            <div className={styles.cardStats}>
              <div className={styles.statItem} style={{ marginTop: "18px" }}>
                <span>{riskSummaryData.totalAccepted}</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={8} xl={6}>
        <Card
          bordered={false}
          style={{
            margin: "5px",
            backgroundColor: "#003d5c",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            height: "220px",
            color: "#fff",
          }}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h2>
                <ExclamationCircleOutlined style={{ marginRight: "10px", color: "#fff" }} />
                {t("stats.Total Risk")}
              </h2>
              <Divider style={{ backgroundColor: "#fff" }} />
            </div>
            <div className={styles.cardStats}>
              <div className={styles.statItem} style={{ marginTop: "18px" }}>
                <span>{riskSummaryData.totalRisk}</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <Modal
      title="Export Confirmation"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
    >
      <p> {t("stats.Are you sure you want to export Top Five Risk?")}</p>
    </Modal>
    {/* Table */}

    <div style={{ marginTop: "10px" }}>
      <Divider style={{ marginBottom: "0px" }}>
        <h2> {t("stats.Top Five Risk")}</h2>
      </Divider>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button type="primary" onClick={showModal}>
          {" "}
          {t("register.export")} <DownloadOutlined size={16} />
        </Button>
      </div>

      <Table
        bordered
        dataSource={topFiveRisk}
        columns={columns}
        pagination={false}
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        rowKey={() => Math.random().toString(12).substr(2, 9)}
        scroll={{ x: true }} // Add horizontal scroll for small screens
      />
    </div>

    <div style={{ marginTop: "30px" }}>
      <Divider style={{ marginBottom: "0px" }}>
        <h2>
          {" "}
          {t("stats.Risk Threshold")}
        </h2>
      </Divider>
    </div>
    <Row gutter={16}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <h3>{t("stats.Risk Below Appatite")}</h3>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <Button type="primary" onClick={showBelowModal}>
            {" "}
            {t("register.export")} <DownloadOutlined size={16} />
          </Button>
        </div>
        <Modal
          title="Export Data Confirmation"
          open={isModalBelowVisible}
          onOk={handleBelowOk}
          onCancel={handleCancel}
          centered
        >
          <p>{t("stats.Are you sure you want to export below apatite data?")}</p>
        </Modal>
        <Table
          bordered
          dataSource={riskWithInLimit}
          columns={riskWithInLimitColumns}
          pagination={{ pageSize: 5 }}
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          rowKey={() => Math.random().toString(12).substr(2, 9)}
          scroll={{ x: true }} // Add horizontal scroll for small screens
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <h3> {t("stats.Risk Upper Appatite")}</h3>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <Button type="primary" onClick={showUpperModal}>
            {" "}
            {t("register.export")} <DownloadOutlined size={16} />
          </Button>
        </div>
        <Modal
          title="Export Data Confirmation"
          open={isModalUpperVisible}
          onOk={handleUpperOk}
          onCancel={handleCancel}
          centered
        >
          <p>{t("stats.Are you sure you want to export upper appatite data?")}</p>
        </Modal>
        <Table
          bordered
          dataSource={riskWithOutLimit}
          columns={riskWithOutLimitColumns}
          pagination={{ pageSize: 5 }}
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          rowKey={() => Math.random().toString(12).substr(2, 9)}
          scroll={{ x: true }} // Add horizontal scroll for small screens
        />
      </Col>
    </Row>

    <div>
      <Divider style={{ marginBottom: "0px" }}>
        <h2> {t("stats.SLA Violation")}</h2>
      </Divider>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button type="primary" onClick={showDataExportModal}>
          {" "}
          {t("register.export")} <DownloadOutlined size={16} />
        </Button>
      </div>
      <Modal
        title="Export Data Confirmation"
        open={isModalDataExporVisible}
        onOk={handleDataExport}
        onCancel={handleCancel}
        centered
      >
        <p>{t("stats.Are you sure you want to export SLA data?")}</p>
      </Modal>
      <Table
        dataSource={slaViolations}
        columns={slaViolationsColumns}
        pagination={{ pageSize: 5 }}
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        rowKey={() => Math.random().toString(12).substr(2, 9)}
        scroll={{ x: true }} // Add horizontal scroll for small screens
      />
      {responseData && (
        <>
          <Divider style={{ marginBottom: "0px" }}>
            <h2>{t("stats.Violation")}</h2>
          </Divider>
          <Table
            dataSource={responseData}
            columns={ViolationColumns}
            rowKey={() => Math.random().toString(12).substr(2, 9)}
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "55px",
            }}
            scroll={{ x: true }} // Add horizontal scroll for small screens
          />
        </>
      )}
    </div>
    <StatusRange riskSummaryData={riskSummaryData} />

    <FloatButton.BackTop />
  </>
  );
};

export default Stats;
