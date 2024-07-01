"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Space,
  Breadcrumb,
  Result,
  Tooltip,
  Modal,
  DatePicker,
  Select,
  Upload,
  Tag,
  Flex,
} from "antd";
import { useRouter } from "next/navigation";
import { Button, message, Popconfirm } from "antd";
import { Divider, Typography } from "antd";
import { Input } from "antd";
import Search from "antd/es/input/Search";
const { TextArea } = Input;
const { Text } = Typography;
import { useTranslation } from "react-i18next";
import { Edit3, Eye, LayoutDashboard, ShieldPlus, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { RedoOutlined } from "@ant-design/icons";
import CustomSearch from "../components/CustomSearch";

const Register = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [id, setId] = useState("");
  const token = localStorage.getItem("authorization");
  const [isAdmin, setIsAdmin] = useState("");
  const [selectedActionOwner, setSelectedActionOwner] = useState(null);
  const [ownerEmail1, setOwnerEmail1] = useState("");
  const [apiData, setApiData] = useState(null);
  const [singleId, setSingleId] = useState("");
  const [transferInputValue, setTransferInputValue] = useState("");
  const [actionName, setActionName] = useState("");
  const [actionDetails, setActionDetails] = useState("");
  const [actionOwner, setActionOwner] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [expectedBenefit, setExpectedBenefit] = useState("");
  const [closingDate, setClosingDate] = useState(null);
  const [finishingDate, setFinishingDate] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [startingDate, setStartingDate] = useState(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customActionOwner, setCustomActionOwner] = useState("");
  const [componentLoaded, setComponentLoaded] = useState(false);

  const handleSettingsClick = () => {
    router.push("/dashboard/settings"); // Navigate to settings page
  };

  const { data: Userdata } = useQuery({
    queryKey: ["usersbbbs"],
    queryFn: async () => {
      const response = await axios.get(`/api/users`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.userData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/basic-status");

        setApiData(response.data);
        setIsAdmin(response.data.is_admin.toLowerCase());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    setComponentLoaded(true);
  }, []);

  // Check if apiData exists and if any of the status values is false
  const isError =
    apiData &&
    (!apiData.matrixStatus ||
      !apiData.likelihoodStatus ||
      !apiData.impactStatus);

  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["registerData"],
    queryFn: async () => {
      setLoading(true);
      const response = await axios.get(
        `/api/risk-register`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      return response.data.registerData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  const showPopconfirm = (record) => {
    setOpen(record?.id);
    setIdDelete(record?.id);
  };

  const confirm = async (e) => {
    setConfirmLoading(true);

    try {
      // Make a DELETE request to your backend API
      const response = await axios.delete(
        `/api/delete-risk-register/${idDelete}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the deletion was successful
      if (response.status === 200) {
        refetch();
        const indexToDelete = dataSource.findIndex(
          (record) => record.key === id
        );

        if (indexToDelete !== -1) {
          const updatedDataSource = [...dataSource];
          updatedDataSource.splice(indexToDelete, 1);

          setDataSource(updatedDataSource);
        }

        // setOpen(false);
        // setConfirmLoading(false);
        message.success("Register deleted successfully.");
      } else {
        // Handle error if deletion fails
        setOpen(false);
        setConfirmLoading(false);
        // console.error("Deletion failed:", response.statusText);
        message.error("Failed to delete record.");
      }
    } catch (error) {
      message.error("An error occurred while deleting the record.");
    }

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);

      // message.success("Click on Yes");
    }, 1000);
  };
  const cancel = (e) => {
    message.error("Click on No");
    setOpen(false);
  };

  const uploadProps = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        setSelectedFile(info.file);
      }
    },
  };

  const showModal = (record) => {
    setSelectedRow(record);

    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    const hide = message.loading({ content: 'Processing...', duration: 0 });
    try {
      const formData = new FormData();

      // Ensure all necessary fields are included
      formData.append("register_id", selectedRow?.id);
      formData.append("refId", selectedRow?.refId);
      formData.append("resolve", transferInputValue);
      formData.append("treat_name", actionName);
      formData.append("treat_detial", actionDetails);
      if (isOtherSelected) {
        formData.append("treat_owner", customActionOwner);
        formData.append("action_owner_email", customEmail);
      } else {
        formData.append("treat_owner", selectedActionOwner);
        formData.append("action_owner_email", ownerEmail1);
      }
      formData.append("expected_benefit", expectedBenefit);
      formData.append("closing_date", closingDate);
      formData.append("finishing_date", finishingDate);
      formData.append("treat_status", status);
      formData.append("user_id", singleId);
      formData.append("started_date", startingDate);

      if (selectedFile) {
        formData.append("attachment", selectedFile.originFileObj);
      }

      const apiUrl = "/api/treatments/save";
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        refetch();
        setActionName("");
        setActionDetails("");
        setActionOwner("");
        setOwnerEmail("");
        setExpectedBenefit("");
        setClosingDate(null);
        setStatus("");
        message.success({
          content: (
            <span>
              Risk Treatment has been added!{" "}
              <a
                onClick={() =>
                  router.push(`/dashboard/register/view/${selectedRow?.id}`)
                }
                style={{ color: "#1890ff" }}
              >
                Go there
              </a>
            </span>
          ),
          duration: 3,
        });
      } else {
        message.error("Something went wrong!");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        if (errors.treat_detial) {
          message.error(errors.treat_detial[0]);
        }
        if (errors.treat_owner) {
          message.error(errors.treat_owner[0]);
        }
        if (errors.action_owner_email) {
          message.error(errors.action_owner_email[0]);
        }
        if (errors.expected_benefit) {
          message.error(errors.expected_benefit[0]);
        }
        if (errors.treat_status) {
          message.error(errors.treat_status[0]);
        }
        if (errors.attachment) {
          message.error(errors.attachment[0]);
        }
        setTimeout(() => {
          message.destroy(); // Clear all messages after 3 seconds
        }, 4000);
      } else {
        console.error("Error details:", error.response?.data);
        message.error(error.response.data.message);
      }
    } finally {
      hide(); 
    }
};


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: t("register.id"),
      align: "center",
      dataIndex: "refId",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        // Extract numeric part of refId
        const getIdNumber = (refId) => parseInt(refId.match(/\d+/)[0]);

        // Compare the numeric parts
        return getIdNumber(a.refId) - getIdNumber(b.refId);
      },
    },

    {
      title: t("register.risk_name"),
      dataIndex: "risk_name",
      align: "center",
      onFilter: (value, record) => record.risk_name.indexOf(value) === 0,
      sorter: (a, b) => a.risk_name.length - b.risk_name.length,
      sortDirections: ["descend"],
      render: (text) => <span style={{ fontWeight: "600" }}>{text}</span>,
    },
    {
      title: t("register.potential_impact"),
      dataIndex: "potential_impact",
      align: "center",
    },
    {
      title: t("register.financial_impact"),
      dataIndex: "financial_impact",
      defaultSortOrder: "descend",
      align: "center",
    },
    {
      title: t("register.decision"),
      dataIndex: "treatment_decision",
      defaultSortOrder: "descend",
      align: "center",
      render: (text, record) => {
        // Check if treatment_decision is "accept"
        if (record.treatment_decision === "Accept") {
          return <Tag color="green">Accept</Tag>;
        }
        if (record.treatment_decision === "Manage") {
          return <Tag color="cyan">Manage</Tag>;
        }
        if (record.treatment_decision === "Mitigate") {
          return <Tag color="blue">Mitigate</Tag>;
        }
        if (record.treatment_decision === "Transfer") {
          return <Tag color="purple">Transfer</Tag>;
        } else {
          return <Tag color="default">{text}</Tag>; // Render the original text if it's not "accept"
        }
      },
    },
    {
      title: t("register.risk_criticality"),
      dataIndex: "risk_criticality",
      align: "center",
      render: (text, record) => {
        if (!record?.risk_matrix) {
          // If risk_matrix is null or undefined, render normally
          return <div style={{ textAlign: "center" }}>{text}</div>;
        }

        const color = record?.risk_matrix.color.startsWith("#")
          ? record?.risk_matrix.color
          : `#${record?.risk_matrix.color}`;
        const isCriticalStepDefined =
          record?.risk_matrix?.critical_step !== undefined &&
          record?.risk_matrix?.critical_step !== "";

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
            {record?.risk_matrix?.critical_step}
          </div>
        );
      },
    },

    {
      title: t("register.action"),
      align: "center",
      key: "action",
      render: (text, record) => {
        const isTreatmentActionVisible = record.treatment_decision !== "Accept";

        const iconStyle = {
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          fontSize: "12px",
          minWidth: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        };

        const handleMouseEnter = (e, color) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0px 8px 16px ${color}`;
        };

        const handleMouseLeave = (e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
        };

        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                isAdmin !== "user" ? "repeat(4, auto)" : "repeat(1, auto)",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <Tooltip title="View">
              <Button
                onClick={() => {
                  setId(record?.id);
                  router.push(`/dashboard/register/view/${record?.id}`);
                }}
                style={{
                  ...iconStyle,
                  borderColor: "#4096FF",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                onMouseEnter={(e) =>
                  handleMouseEnter(e, "rgba(0, 0, 255, 0.3)")
                }
                onMouseLeave={handleMouseLeave}
              >
                <Eye size={20} color="#4096FF" />
              </Button>
            </Tooltip>
            {isAdmin !== "user" && (
              <>
                <Tooltip title="Edit">
                  <Button
                    onClick={() =>
                      router.push(`/dashboard/register/edit/${record?.id}`)
                    }
                    style={{
                      ...iconStyle,
                      borderColor: "green",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, "rgba(0, 255, 0, 0.3)")
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <Edit3 size={20} style={{ color: "green" }} />
                  </Button>
                </Tooltip>
                {isTreatmentActionVisible && (
                  <Tooltip title="Treatment Action">
                    <Button
                      onClick={() => showModal(record)}
                      style={{
                        ...iconStyle,
                        borderColor: "purple",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                      onMouseEnter={(e) =>
                        handleMouseEnter(e, "rgba(128, 0, 128, 0.3)")
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      <ShieldPlus size={20} style={{ color: "purple" }} />
                    </Button>
                  </Tooltip>
                )}
              </>
            )}

            {!isTreatmentActionVisible && (
              <div style={{ marginLeft: "28px", marginRight: "28px" }}></div>
            )}
            {isAdmin !== "user" && (
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                open={open === record?.id}
                onConfirm={() => confirm(record?.id)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ loading: confirmLoading }}
              >
                <Tooltip title="Delete">
                  <Button
                    onClick={() => showPopconfirm(record)}
                    style={{
                      ...iconStyle,
                      cursor: "pointer",
                      borderColor: "red",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, "rgba(255, 0, 0, 0.3)")
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <Trash size={20} style={{ color: "red" }} />
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  // Search Function

  const handleSearch = (value) => {
    setFilterInput(value);
  };

  const filterData = () => {
    if (filterInput === "") return data;

    return data.filter((record) => {
      // Iterate over each column and check if any of the column data includes the filter input
      for (const column of columns) {
        if (record[column.dataIndex]) {
          // Check if the column data includes the filter input
          if (
            record[column.dataIndex]
              .toString()
              .toLowerCase()
              .includes(filterInput.toLowerCase())
          ) {
            return true; // Return true if any column data includes the filter input
          }
        }
      }
      return false; // Return false if no column data includes the filter input
    });
  };

  // Export Download

  const handleExportButtonClick = async () => {
    try {
      // Perform your API call here
      const response = await axios.get("/api/register/export", {
        responseType: "blob", // Set the response type to 'blob'
        withCredentials: true, // Include credentials in the request
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the response

      const blobUrl = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "Register.xlsx");

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
      // Handle errors
    }
  };

  const handleRefresh = async () => {
    setLoading(true); // Set loading to true before refetching
    await refetch(); // Await the refetch
    setTimeout(() => setLoading(false), 1000); // Set loading to false after 1 second
  };

  // Event handler for selecting action owner

  const handleActionOwnerChange = (value) => {
    setSelectedActionOwner(value);

    if (value === "other") {
      setIsOtherSelected(true);
      setOwnerEmail1(""); // Clear the email field for custom input
      setSingleId(null); // Reset the ID if "Other" is selected
    } else {
      setIsOtherSelected(false);

      // Find the selected user by name and update the ownerEmail1 state
      const selectedUser = Userdata.find((user) => user.name === value);

      if (selectedUser) {
        setOwnerEmail1(selectedUser.email);
        setSingleId(selectedUser.id);
      } else {
        setOwnerEmail1(""); // Reset the ownerEmail1 if no user is selected
        setSingleId(null);
      }
    }
  };

  const handleCustomEmailChange = (e) => {
    setCustomEmail(e.target.value);
    setOwnerEmail1(e.target.value); // Sync custom email input with ownerEmail1 state
  };

  const handleCustomActionOwnerChange = (e) => {
    setCustomActionOwner(e.target.value);
    // Sync custom action owner input with selectedActionOwner state
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
      key: "register",
      title: (
        <div>
          <span style={{ fontSize: "15px", color: "gray" }}>
            {t("register.register_page")}
          </span>
        </div>
      ),
      style: { marginBottom: "20px" },
    },
  ];
  return (
    <div>
      {componentLoaded && (
        <>
          <>
            <Breadcrumb style={{ padding: "10px" }} items={breadcrumbItems} />
            <Divider />

            {isError ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <Result
                  status="warning"
                  title={
                    apiData?.impactStatus === false
                      ? "There are some problem with your Risk Impact!"
                      : apiData?.likelihoodStatus === false
                      ? "Something wrong in your risk Likelihood"
                      : "Something wrong in your risk valuation"
                  }
                  subTitle={t("Please check your settings.")}
                  extra={
                    <Button
                      type="primary"
                      key="console"
                      onClick={handleSettingsClick}
                    >
                      {t("Go Settings")}
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                    rowGap: "10px",
                  }}
                >
                  <div style={{ flex: "1 1 auto", minWidth: "200px" }}>
                    <CustomSearch
                      placeholder={t("search_here")}
                      onSearch={handleSearch}
                    />
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      display: "flex",
                      flexWrap: "wrap",
                      rowGap: "10px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      onClick={handleRefresh}
                      style={{ marginRight: "10px", flex: "1 1 auto" }}
                    >
                      <RedoOutlined />
                      {t("Refresh")}
                    </Button>
                    <Button
                      onClick={handleExportButtonClick}
                      style={{ marginRight: "10px", flex: "1 1 auto" }}
                    >
                      {t("register.export")}
                    </Button>
                    <Button
                      onClick={() => router.push("/dashboard/register/add")}
                      type="primary"
                      style={{ flex: "1 1 auto" }}
                    >
                      {t("register.add_new")}
                    </Button>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <Table
                    columns={columns}
                    dataSource={filterData()}
                    onChange={onChange}
                    bordered
                    loading={isLoading}
                    rowKey={() => Math.random().toString(12).substr(2, 9)}
                    style={{
                      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                      borderRadius: "10px",
                      width: "100%",
                      minWidth: "600px",
                    }}
                  />
                </div>
              </>
            )}
          </>
          <Modal
            title={t("risk_treatment.modal_title")}
            open={isModalVisible}
            centered
            onOk={handleOk}
            onCancel={handleCancel}
            width={900}
          >
            <Divider />

            <p>
              {t("risk_treatment.modal_id_label")} {selectedRow?.refId}
            </p>
            <Typography.Title level={5}>
              {t("risk_treatment.decision_title")}:{" "}
              <Text type="secondary">{selectedRow?.treatment_decision}</Text>
            </Typography.Title>
            {selectedRow?.treatment_decision === "Transfer" ? (
              <Input
                placeholder={t("risk_treatment.transfer_placeholder")}
                value={transferInputValue}
                onChange={(e) => setTransferInputValue(e.target.value)}
              />
            ) : (
              <>
                <Typography.Title level={5}>
                  {t("risk_treatment.action_name_title")}
                </Typography.Title>
                <Input
                  placeholder={t("risk_treatment.action_name")}
                  value={actionName}
                  onChange={(e) => setActionName(e.target.value)}
                />

                <Typography.Title level={5}>
                  {t("risk_treatment.action_details_title")}
                </Typography.Title>
                <TextArea
                  style={{ height: 120, resize: "none" }}
                  allowClear
                  placeholder={t("risk_treatment.action_details")}
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                />

                <Typography.Title level={5}>
                  {t("risk_treatment.action_owner_title")}
                </Typography.Title>
                <Select
                  placeholder={t("risk_treatment.action_owner")}
                  value={selectedActionOwner}
                  onChange={handleActionOwnerChange}
                  style={{ width: "100%" }}
                >
                  {Userdata?.map((user) => (
                    <Select.Option key={user.id} value={user.name}>
                      {user.name}
                    </Select.Option>
                  ))}
                  <Select.Option value="other">{t("Other")}</Select.Option>
                </Select>

                {isOtherSelected && (
                  <Input
                    placeholder={t("risk_treatment.custom_action_owner")}
                    value={customActionOwner}
                    onChange={handleCustomActionOwnerChange}
                    style={{ width: "100%", marginTop: "1rem" }}
                  />
                )}

                <Typography.Title level={5}>
                  {t("risk_treatment.owner_email_title")}
                </Typography.Title>
                {isOtherSelected ? (
                  <Input
                    placeholder={t("risk_treatment.custom_email")}
                    value={customEmail}
                    onChange={handleCustomEmailChange}
                    style={{ width: "100%", marginTop: "1rem" }}
                  />
                ) : (
                  <Input
                    placeholder={t("risk_treatment.owner_email")}
                    value={ownerEmail1}
                    readOnly={!isOtherSelected}
                    style={{ width: "100%" }}
                  />
                )}

                <Typography.Title level={5}>
                  {t("risk_treatment.expected_benefit_title")}
                </Typography.Title>
                <Input
                  placeholder={t("risk_treatment.expected_benefit")}
                  value={expectedBenefit}
                  onChange={(e) => setExpectedBenefit(e.target.value)}
                />

                <div style={{ marginBottom: "20px" }}>
                  <Space align="center" justify="flex-start">
                    <Typography.Title level={5}>
                      {t("risk_treatment.closing_date_title")}
                    </Typography.Title>
                    <DatePicker
                      onChange={(date, dateString) =>
                        setClosingDate(dateString)
                      }
                      style={{ marginTop: "20px" }}
                    />
                    {status === "Finished" && (
                      <>
                        <div style={{ marginLeft: "10px", display: "flex" }}>
                          <Typography.Title level={5}>
                            Finishing Date:
                          </Typography.Title>
                          <DatePicker
                            onChange={(date, dateString) =>
                              setFinishingDate(dateString)
                            }
                            style={{ marginLeft: "5px", marginTop: "20px" }}
                          />
                        </div>
                      </>
                    )}
                    {status === "Started" && (
                      <>
                        <div style={{ marginLeft: "10px", display: "flex" }}>
                          <Typography.Title level={5}>
                            Starting Date:
                          </Typography.Title>
                          <DatePicker
                            onChange={(date, dateString) =>
                              setStartingDate(dateString)
                            }
                            style={{ marginLeft: "5px", marginTop: "20px" }}
                          />
                        </div>
                      </>
                    )}

                    <Typography.Title level={5} style={{ marginLeft: "10px" }}>
                      {t("risk_treatment.status_title")}
                    </Typography.Title>
                    <Select
                      style={{ width: "150px", marginTop: "15px" }}
                      placeholder={t("risk_treatment.Select_Status")}
                      allowClear
                      value={status}
                      onChange={(value) => setStatus(value)}
                      options={[
                        {
                          value: "Not Started",
                          label: t("risk_treatment.Not_Started"),
                        },
                        {
                          value: "Started",
                          label: t("risk_treatment.Started"),
                        },
                        {
                          value: "In Progress - In Control",
                          label: t("risk_treatment.In_Progrese_In Control"),
                        },
                        {
                          value: "Halted - In Control",
                          label: t("risk_treatment.Halted_In Control"),
                        },
                        {
                          value: "Halted - Need Management Support",
                          label: t(
                            "risk_treatment.Halted_Need Managedment Support"
                          ),
                        },
                        {
                          value: "Finished",
                          label: t("risk_treatment.Finished"),
                        },
                      ]}
                    />
                  </Space>
                  {status === "Finished" && (
                    <>
                      <Typography.Title level={5}>
                        {t("Attachment")}
                      </Typography.Title>
                      <Upload {...uploadProps}>
                        <Button>{t("Click to Upload")}</Button>
                      </Upload>
                    </>
                  )}
                </div>
              </>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default Register;
