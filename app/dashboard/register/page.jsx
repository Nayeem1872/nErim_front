"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Space,
  Breadcrumb,
  ConfigProvider,
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
const { Search, TextArea } = Input;
const { Title, Text } = Typography;
import { useTranslation } from "react-i18next";
import { Edit3, Eye, LayoutDashboard, ShieldPlus, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { RedoOutlined } from "@ant-design/icons";

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
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data);
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
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
    try {
      const formData = new FormData();

      // Ensure all necessary fields are included
      formData.append("register_id", selectedRow?.id);
      formData.append("refId", selectedRow?.refId);
      formData.append("resolve", transferInputValue);
      formData.append("treat_name", actionName);
      formData.append("treat_detial", actionDetails);
      formData.append("treat_owner", selectedActionOwner);
      formData.append("action_owner_email", ownerEmail1);
      formData.append("expected_benefit", expectedBenefit);
      formData.append("closing_date", closingDate);
      formData.append("finishing_date", finishingDate);
      formData.append("treat_status", status);
      formData.append("user_id", singleId);

      if (selectedFile) {
        formData.append("attachment", selectedFile.originFileObj);
      }

      // Log formData content
      // for (let pair of formData.entries()) {

      // }

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
        message.success("Risk Treatment has been added!");
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
        // Add more conditions for other fields if needed
        setTimeout(() => {
          message.destroy(); // Clear all messages after 3 seconds
        }, 4000);
      } else {
        console.error("Error details:", error.response?.data);
        message.error(error.response.data.message);
      }
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
    },
    {
      title: t("register.action"),
      align: "center",
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="View">
            <a
              onClick={() => {
                setId(record?.id);
                router.push(`/dashboard/register/view/${record?.id}`);
              }}
            >
              <Eye size={23} />
            </a>
          </Tooltip>
          {isAdmin !== "user" && (
            <>
              <Tooltip title="Edit">
                <a
                  onClick={() =>
                    router.push(`/dashboard/register/edit/${record?.id}`)
                  }
                >
                  <Edit3
                    size={23}
                    style={{ marginLeft: "10px", color: "green" }}
                  />
                </a>
              </Tooltip>
              <Tooltip title="Add treatment">
                <a
                  onClick={() => showModal(record)}
                  style={{
                    display:
                      record.treatment_decision === "Accept" ? "none" : "block",
                    marginLeft: "10px",
                  }}
                >
                  <ShieldPlus
                    size={23}
                    style={{ marginLeft: "5px", color: "purple" }}
                  />
                </a>
              </Tooltip>
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
                    danger
                    onClick={() => showPopconfirm(record)}
                    style={{
                      display: "flex",
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "white",
                      marginBottom: "6px",
                      // marginRight:"15px"
                    }}
                  >
                    <Trash size={23} />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
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
      link.setAttribute("download", "Register.zip");

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

  const handleActionOwnerChange = (value) => {
    setSelectedActionOwner(value);

    // Find the selected user by name and update the ownerEmail1 state
    const selectedUser = Userdata.find((user) => user.name === value);

    if (selectedUser) {
      setOwnerEmail1(selectedUser.email);
      setSingleId(selectedUser.id);
    } else {
      setOwnerEmail1(""); // Reset the ownerEmail1 if no user is selected
    }
  };

  return (
    <div>
      <>
        <div>
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
          <div></div>

          {isError ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                // title={t("There are some problems with your operation.")}
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
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleRefresh} style={{ marginRight: "10px" }}>
                  <RedoOutlined /> Refresh
                </Button>
                {/* {loading && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spin />
                  </div>
                )} */}
                <Button
                  onClick={handleExportButtonClick}
                  style={{ marginRight: "10px" }}
                >
                  {t("register.export")}
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/register/add")}
                  type="primary"
                >
                  {t("register.add_new")}
                </Button>
              </div>

              <div>
                <Search
                  placeholder={t("register.search_risk_name")}
                  onSearch={handleSearch}
                  allowClear
                  enterButton
                  style={{
                    width: 400,
                    marginBottom: "15px",
                  }}
                />
                <ConfigProvider
                  theme={{
                    table: {
                      container: {
                        background: "#69b1ff",
                      },
                    },
                  }}
                >
                  <Table
                    columns={columns}
                    dataSource={filterData()}
                    onChange={onChange}
                    bordered
                    loading={isLoading}
                  />
                </ConfigProvider>
              </div>
            </>
          )}
        </div>
      </>
      <Modal
        title={t("risk_treatment.modal_title")}
        visible={isModalVisible}
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
                <Option key={user.id} value={user.name}>
                  {user.name}
                </Option>
              ))}
            </Select>

            <Typography.Title level={5}>
              {t("risk_treatment.owner_email_title")}
            </Typography.Title>
            <Input
              placeholder={t("risk_treatment.owner_email")}
              value={ownerEmail1}
              disabled
            />

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
                  onChange={(date, dateString) => setClosingDate(dateString)}
                  style={{ marginTop: "20px" }}
                />
                {status === "Finished" && (
                  <>
                    <div style={{marginLeft:"10px", display:'flex'}}>
                      <Typography.Title level={5}>
                        Finishing Date:
                      </Typography.Title>
                      <DatePicker
                     
                        onChange={(date, dateString) =>
                          setFinishingDate(dateString)
                        }
                        style={{ marginLeft:"5px" , marginTop:"20px" }}
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
                    { value: "Started", label: t("risk_treatment.Started") },
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
                    { value: "Finished", label: t("risk_treatment.Finished") },
                  ]}
                />
              </Space>
              {status === "Finished" && (
                <>
                  <Typography.Title level={5}>Attachment</Typography.Title>
                  <Upload {...uploadProps}>
                    <Button>Click to Upload</Button>
                  </Upload>
                </>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Register;
