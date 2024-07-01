"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Input,
  Select,
  Breadcrumb,
  message,
  Upload,
  Result,
  Alert,
  Tag,
  Tooltip,
} from "antd";
import { Divider, Typography } from "antd";
const { Text } = Typography;
const { Option } = Select;
import axios from "axios";
import { useRouter } from "next/navigation";
import { DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { Eye, LayoutDashboard, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CustomSearch from "../components/CustomSearch";

const { TextArea } = Input;

const Treatment = () => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState(null);
  const router = useRouter();
  const [transferInputValue, setTransferInputValue] = useState("");
  const [actionName, setActionName] = useState("");
  const [actionDetails, setActionDetails] = useState("");
  const [expectedBenefit, setExpectedBenefit] = useState("");
  const [closingDate, setClosingDate] = useState(null);
  const [status, setStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [singleId, setSingleId] = useState("");
  const [refId, setRefId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActionOwner, setSelectedActionOwner] = useState(null);
  const [ownerEmail1, setOwnerEmail1] = useState("");
  const [apiData, setApiData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customActionOwner, setCustomActionOwner] = useState("");
  const [filterInput, setFilterInput] = useState("");

  const handleSettingsClick = () => {
    router.push("/dashboard/settings"); // Navigate to settings page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data.toLowerCase());
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  }, []);

  const { data: Userdata } = useQuery({
    queryKey: ["usersbbbs4545"],
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

  const handleMouseEnter = (e, color) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = `0px 8px 16px ${color}`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
  };
  // Check if apiData exists and if any of the status values is false
  const isError =
    apiData &&
    (!apiData.matrixStatus ||
      !apiData.likelihoodStatus ||
      !apiData.impactStatus);

  const columns = [
    {
      title: t("risk_treatment.id"),
      dataIndex: "refId",
      key: "refId",
      width: 150,
      fixed: "left",
      align: "center",
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: t("risk_treatment.decision"),
      dataIndex: "treatment_decision",
      key: "treatment_decision",
      width: 150,
      fixed: "left",
      align: "center",
      render: (text) => {
        let color = "";

        switch (text) {
          case "Accept":
            color = "green";
            break;
          case "Manage":
            color = "blue";
            break;
          case "Transfer":
            color = "cyan";
            break;
          case "Mitigate":
            color = "orange";
            break;
          case "Reduce":
            color = "volcano";
            break;
          case "Avoid":
            color = "gold";
            break;
          case "Control":
            color = "purple";
            break;
          default:
            color = "";
            break;
        }

        return (
          <Tag color={color} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: t("risk_treatment.action_summary.summary"),
      children: [
        {
          title: t("risk_treatment.action_summary.action_name"),
          dataIndex: "treatments",
          key: "name",
          align: "center",
          render: (treatments, record) => {
            return (
              <>
                {treatments.map((treatment, index) => (
                  <>
                    <div key={index}>{treatment.treat_name}</div>
                    <Divider />
                  </>
                ))}
              </>
            );
          },
        },
        {
          title: t("risk_treatment.action_summary.status"),
          dataIndex: "treatments",
          key: "status",
          align: "center",
          render: (treatments) => (
            <>
              {treatments.map((treatment, index) => (
                <>
                  <div key={index}>{treatment.treat_status}</div>
                  <Divider />
                </>
              ))}
            </>
          ),
        },
        {
          title: t("risk_treatment.Transfer"),
          dataIndex: "treatments",
          key: "owner",
          align: "center",
          render: (treatments) => (
            <>
              {treatments.map((treatment, index) => (
                <>
                  <div key={index}>{treatment.resolve}</div>
                  <Divider />
                </>
              ))}
            </>
          ),
        },
        {
          title: t("risk_treatment.action_summary.end_date"),
          dataIndex: "treatments",
          key: "end_date",
          align: "center",
          render: (treatments) => (
            <>
              {treatments.map((treatment, index) => (
                <>
                  <div key={index}>{treatment.closing_date}</div>
                  <Divider />
                </>
              ))}
            </>
          ),
        },
        {
          title: t("risk_treatment.action_summary.owner"),
          dataIndex: "treatments",
          key: "owner",
          align: "center",
          render: (treatments) => {
           
            return (
              <>
                {treatments.map((treatment, index) => (
                  <div key={index}>
                    <div>{treatment?.user?.name}</div>
                    <Divider />
                  </div>
                ))}
              </>
            );
          },
        },
      ],
    },
    {
      title: t("risk_treatment.action"),
      width: 150,
      key: "action",
      align: "center",
      render: (text, record) => {
        const isAddButtonVisible = record.treatment_decision !== "Accept";

        return (
          <div
            style={{
              display: "flex",
              justifyContent: isAddButtonVisible ? "space-between" : "flex-end",
            }}
          >
            {isAddButtonVisible && (
              <Tooltip title="Add Action">
                <Button
                  type="primary"
                  onClick={() => showModal(record)}
                  style={{
                    marginBottom: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 255, 0.3)", // Blue tinted shadow
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    handleMouseEnter(e, "rgba(0, 0, 255, 0.3)")
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <Plus size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip title="View">
              <Button
                type="default"
                onClick={() => {
                  router.push(`/dashboard/risk_treatment/view/${record?.id}`);
                }}
                style={{
                  marginBottom: "8px",
                  marginRight: "14px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  handleMouseEnter(e, "rgba(0, 0, 255, 0.3)")
                }
                onMouseLeave={handleMouseLeave}
              >
                <Eye size={20} color="#4096FF" />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const token = localStorage.getItem("authorization");

  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["treatment1"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/treatments`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.riskTreatments;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  const showModal = (record) => {
    setEditId(record.id);
    setRefId(record.refId);
    setSelectedRow(record);
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    const hide = message.loading({ content: 'Processing...', duration: 0 });
    try {
      const formData = new FormData();
      formData.append("register_id", editId);
      formData.append("refId", refId);
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
      formData.append("treat_status", status);
      formData.append("user_id", singleId);
      if (selectedFile) {
        formData.append("attachment", selectedFile.originFileObj);
      }

      const apiUrl = "/api/treatments/save";
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        refetch();
        setActionName("");
        setActionDetails("");
        setSelectedActionOwner("");
        setCustomActionOwner("");
        setOwnerEmail1("");
        setCustomEmail("");
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
        setTimeout(() => {
          message.destroy(); 
        }, 4000);
      } else {
        message.error("Something went wrong!");
      }
    } finally {
      hide(); 
    }
};

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const props = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        setSelectedFile(info.file);
      }
    },
  };
  // Handle import
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/treatment/import", formData);
      // Handle success

      message.success("File uploaded successfully");
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error);
      message.error("Error uploading file");
    }
  };

  // search function

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

  // const showModalExample = () => {
  //   setIsModalExampleOpen(true);
  // };
  const handleImportModal = () => {
    setModalVisible(true);
  };

  const handleImport = () => {
    // Make an API call to download the file
    axios({
      url: "/api/treatment/example/file", // Replace 'your-api-endpoint' with your actual API endpoint
      method: "GET",
      responseType: "blob", // Tell Axios to expect a blob (binary data)
    })
      .then((response) => {
        // Create a Blob from the response data
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        // Create a link element
        const url = window.URL.createObjectURL(blob);
        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = url;
        a.download = "Risk-Treatment-Example.xlsx"; // Specify the file name
        // Append the anchor element to the body
        document.body.appendChild(a);
        // Programmatically click the anchor element to start downloading
        a.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        // Handle error
      });
    setModalVisible(false);
  };


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
      key: "riskTreatment",
      title: (
        <div>
          <span style={{ fontSize: "15px", color: "gray" }}>
            {t("risk_treatment.risk_treatment_page")}
          </span>
        </div>
      ),
      style: { marginBottom: "20px" },
    },
  ];

  return (
    <div>
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
            <Button type="primary" key="console" onClick={handleSettingsClick}>
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
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ flex: "1 1 auto", minWidth: "200px" }}>
            <CustomSearch placeholder={t("search_here")} onSearch={handleSearch} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleImportModal}>{t("Example File")}</Button>
            <Modal
              width={800}
              centered
              title=" "
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={[
                <Button key="cancel" onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>,
                <Button key="download" type="primary" onClick={handleImport}>
                  Download
                </Button>,
              ]}
            >
              <div style={{ marginTop: "20px" }}>
                <Alert
                  message={t("Download Example")}
                  description={
                    <div>
                      {t(
                        "In the Excel sheet, the predefined and unchangeable headings include"
                      )}{" "}
                      <strong>SL</strong>, <strong>Risk Name</strong>,{" "}
                      <strong>Date</strong>, <strong>Risk Owner</strong>,{" "}
                      <strong>Owner Email</strong>,{" "}
                      {t(
                        "and other all headings.These headings will serve as the key fields for importing data into the database."
                      )}
                    </div>
                  }
                  type="info"
                  showIcon
                />
              </div>
              <p></p>
            </Modal>
  
            <Upload
              customRequest={handleUpload}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              showUploadList={false}
            >
              <Button type="primary">
                {t("risk_treatment.import")}
              </Button>
            </Upload>
          </div>
        </div>
  
        <div style={{ overflowX: "auto" }}>
        <Table
            dataSource={filterData()}
            columns={columns}
            bordered
            size="middle"
            rowKey={() => Math.random().toString(12).substr(2, 9)}
            style={{
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          />
        </div>
        <Modal
              title={t("risk_treatment.modal_title")}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              centered
              width={600}
            >
              <Divider />
              <p>
                {t("risk_treatment.modal_id_label")} {selectedRow?.refId}
              </p>
              <Typography.Title level={5}>
                {t("risk_treatment.decision_title")}:{" "}
                <Text type="secondary">{selectedRow?.treatment_decision}</Text>{" "}
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
                    style={{
                      height: 120,
                      resize: "none",
                    }}
                    allowClear
                    status={error}
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
                    <Option value="other">{t("Other")}</Option>
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
                    <Space align="center" justifyContent="flex-start">
                      <Typography.Title level={5}>
                        {t("risk_treatment.closing_date_title")}
                      </Typography.Title>
                      <DatePicker
                        onChange={(date, dateString) =>
                          setClosingDate(dateString)
                        }
                        style={{ marginTop: "20px" }}
                      />
                      <Typography.Title level={5} style={{ marginLeft: "10px" }}>
                        {t("risk_treatment.status_title")}
                      </Typography.Title>
                      <Select
                        style={{ width: "150px", marginTop: "15px" }}
                        defaultValue={t("risk_treatment.Select_Status")}
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
                            value: "Halted - Need Managedment Support",
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
                        <Upload {...props}>
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

export default Treatment;
