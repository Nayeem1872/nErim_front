"use client";
import React from "react";
import { Breadcrumb, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Divider, Typography } from "antd";
import { LayoutDashboard } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Dots from "../components/DotLoader";
const { Title } = Typography;

const Audit = () => {
  const { t } = useTranslation();
  const { data: dataSourceQuery, isLoading, error } = useQuery({
    queryKey: ["audit"],
    queryFn: async () => {
      const response = await axios.get(`/api/risk-audit`);
      return response.data.auditData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });
  
  if (isLoading) {
    return <Dots />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to fetch data" type="error" />
    );
  }
  
  const columns = [
    {
      title: t("audit.time"),
      dataIndex: "time",
      key: "time",
    },
    {
      title: t("audit.username"),
      dataIndex: "useremail",
      key: "useremail",
    },
    {
      title: t("audit.ip_address"),
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title:t("audit.changes"),
      dataIndex: "change",
      key: "change",
    },
  ];


  const breadcrumbItems = [
    {
      key: 'dashboard',
      title: (
        <a
          onClick={() => {
            router.push(`/dashboard`);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <LayoutDashboard style={{ fontSize: '20px', marginBottom: '2px' }} color="#0D85D8" />
        </a>
      ),
    },
    {
      key: 'audit',
      title: (
        <div>
          <span style={{ fontSize: '15px', color: 'gray' }}>{t("audit.audit")}</span>
        </div>
      ),
      style: { marginBottom: '20px' },
    },
  ];




  return (
    <div>
      {/* <Title level={2}>{t("audit.audit")}</Title> */}
   
      <Breadcrumb style={{ padding: '10px' }} items={breadcrumbItems} />
      <Divider />

      <Table dataSource={dataSourceQuery} columns={columns} rowKey={() => Math.random().toString(12).substr(2, 9)} />
    </div>
  );
};

export default Audit;
