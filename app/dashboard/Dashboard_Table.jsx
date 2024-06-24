"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Table } from "antd";
import { useRouter } from "next/navigation";
import Dots from "./components/DotLoader";

const Dashboard_Table = () => {
  const [matrixWithStatus, setMatrixWithStatus] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("authorization");
        const response = await axios.get(`/api/dashboard/`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatrixWithStatus(response.data.matrixWithStatus);
        setData(response.data.tblRegisterWithStatus);
        setLength(response.data.tblRegisterWithStatus.length);
        setLoading(false); // Set loading state to false when fetching finishes
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading state to false if an error occurs
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return <Dots />; // Render a loading message if data is still loading
  }
  console.log("length", length);
  const calculatePadding = (text) => {
    if (length === 2) {
      return "46px 0";
    } else if (length === 3) {
      return "22px 0";
    } else if (length === 4) {
      return "9.5px 0";
    } else if (length === 5) {
      return "3px 0";
    } else if (length === 1) {
      return "60px 0";
    } else {
      return "1px 0"; 
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "status_name",
      key: "status_name",
      render: (text) => (
        <div style={{ padding: calculatePadding(text) }}>{text}</div>
      ),
    },
    // {
    //   title: "Name",
    //   dataIndex: "status_name",
    //   key: `status_name`,
    // },
    ...matrixWithStatus.map((matrix) => ({
      title: matrix.critical_step,
      dataIndex: `count_${matrix.id}`,
      key: `count_${matrix.id}`,
      render: (text, record) => {
        const dataItem = record.data.find(
          (item) => item.matrix_id === matrix.id
        );

        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleDataItemClick(dataItem)}
          >
            {dataItem ? dataItem.count : "-"}
          </span>
        );
      },
    })),
  ];

  const handleDataItemClick = async (dataItem) => {
    router.push(
      `/dashboard/register/tableData/${dataItem?.matrix_id}/${dataItem?.status_id}`
    );
  };

  return (
    <div
      style={{
        marginTop: "14px",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table
            dataSource={data}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowKey={() => Math.random().toString(12).substr(2, 9)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard_Table;
