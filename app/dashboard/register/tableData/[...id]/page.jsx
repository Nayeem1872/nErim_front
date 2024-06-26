"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
const { Title } = Typography;
import { Breadcrumb, Divider, Spin, Table, Typography } from "antd";
import { Edit3, Eye, LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";

const page = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const parts = pathname.split("/");

  // Get the last two parts of the URL
  const matrix_id = parts[parts.length - 2];
  const status_id = parts[parts.length - 1];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard-risk-data/${matrix_id}/${status_id}`
        );
        setData(response.data.registerData);
        setLoading(false);
      } catch (error) {
        // setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [matrix_id, status_id]);


  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin />
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div>
  //       Error: {error.message}
  //       <Spin />
  //     </div>
  //   );
  // }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("heatmap.Risk_Identified"),
      dataIndex: "risk_identified",
      key: "risk_identified",
    },
    {
      title: t("heatmap.Potential_Impact"),
      dataIndex: "potential_impact",
      key: "potential_impact",
    },
    {
      title: t("heatmap.Financial_Impact"),
      dataIndex: "financial_impact",
      key: "financial_impact",
    },
    {
      title: t("heatmap.Criticality_Score"),
      key: "criticality_score",
      render: (text, record) => {
        const criticalityScore = record.risk_consequence_id * record.risk_likelihood_id;
        return <div>{criticalityScore}</div>;
      },
    },
    {
      title: t("register.risk_criticality"),
      dataIndex: "risk_criticality",
      align: "center",
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
        )
      }
    },
    {
      title: t("settingsImpact.Action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <a
            onClick={() => {
              router.push(`/dashboard/register/view/${record?.id}`);
            }}
          >
            <Eye size={23} />
          </a>
          <a
            onClick={() =>
              router.push(`/dashboard/register/edit/${record?.id}`)
            }
          >
            {" "}
            <Edit3 size={23} style={{ marginLeft: "10px" }} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* <h1>Data fetched for Matrix ID: {matrix_id} and Status ID: {status_id}</h1> */}
      <Title level={2}>{t("register.register")}</Title>

      <Breadcrumb
        items={[
          {
            title: (
              <a
                onClick={() => {
                  router.push(`/dashboard`);
                }}
              >
                <LayoutDashboard color="#0D85D8" size={20} />
              </a>
            ),
          },
          {
            title: t("register.register_page"),
          },
        ]}
      />
      <Divider />

      <Table dataSource={data} columns={columns} pagination={false} rowKey={() => Math.random().toString(12).substr(2, 9)} />
    </div>
  );
};

export default page;
