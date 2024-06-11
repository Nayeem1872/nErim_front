"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import {
  Divider,
  Space,
  Typography,
  Table,
  Breadcrumb,
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Row,
  message,
  Col,
} from "antd";
import axios from "axios";
const { TextArea } = Input;
import { Bell, Edit, File, LayoutDashboard, Trash } from "lucide-react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;

const View = ({ params }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [form] = Form.useForm();
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusValue, setStatusValue] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data1, setData1] = useState(null);
  const [closingDate, setClosingDate] = useState(null);
  const [apiData, setApiData] = useState(null);

  const [selectedActionOwner, setSelectedActionOwner] = useState(null);
  const [ownerEmail1, setOwnerEmail1] = useState("");
  const [userID, setUserID] = useState("");
  const [user_Id, setUser_id] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customActionOwner, setCustomActionOwner] = useState("");
  const [recordEmail, setRecordEmail] = useState("");
  const [recordActionOwner, setRecordActionOwner] = useState("");
  console.log("recordEmail", recordEmail);

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
      // setIsLoading(true);
      try {
        const id = params.id;
        const response = await axios.get(`/api/treatments/view/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // const treatmentData = response.data;
        setData1(response.data);

        // Extract and set the status value
        if (treatmentData && treatmentData.treatment) {
          treatmentData.treatment.forEach((treatment) => {
            setStatusValue(treatment.treat_status);
          });
        }

        // setIsLoading(false);
      } catch (error) {
        // setError(error);
        // setIsLoading(false);
      }
    };

    fetchData();
    return () => {};
  }, [params.id]);

  const showModal = (record) => {
    // console.log("record",record);
    setUser_id(record.user_id);
    setEditId(record.id);
    setRecordEmail(record.action_owner_email);
    setRecordActionOwner(record.treat_owner);
    // Format date fields using dayjs
    const formattedStartedDate = record.started_date
      ? dayjs(record.started_date)
      : null;
    const formattedClosingDate = record.closing_date
      ? dayjs(record.closing_date)
      : null;
    const formattedfinished_date = record.finished_date
      ? dayjs(record.finished_date)
      : null;

    setStatusValue(record.treat_status);

    // Set form fields value
    form.setFieldsValue({
      ...record,
      started_date: formattedStartedDate,
      closing_date: formattedClosingDate,
      user_id: record.user_id,
      finished_date: formattedfinished_date,
    });

    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    const formData = form.getFieldsValue();

    try {
      const formData1 = new FormData();
      formData1.append("userId", userId);
      formData1.append("id", editId);
      formData1.append("verifyEmail", email);

      // Format and append dates
      const formattedClosingDate = formData.closing_date
        ? dayjs(formData.closing_date).format("YYYY-MM-DD")
        : null;
      formData1.append("closing_date", formattedClosingDate);

      const formattedStartDate = formData.started_date
        ? dayjs(formData.started_date).format("YYYY-MM-DD")
        : null;

      const formattedfinished_date = formData.finished_date
        ? dayjs(formData.finished_date).format("YYYY-MM-DD")
        : null;
      formData1.append("started_date", formattedStartDate);
      formData1.append("resolve", formData.resolve);
      // Append other form data
      formData1.append("expected_benefit", formData.expected_benefit);

      if (isOtherSelected) {
        formData1.append("treat_owner", customActionOwner || recordActionOwner);
        formData1.append("action_owner_email", customEmail || recordEmail);
      } else {
        formData1.append(
          "treat_owner",
          selectedActionOwner || recordActionOwner
        );
        formData1.append("action_owner_email", ownerEmail1 || recordEmail);
      }
      formData1.append("treat_detial", formData.treat_detial);
      formData1.append("treat_name", formData.treat_name);
      formData1.append("treat_status", formData.treat_status);
      formData1.append("finished_date", formattedfinished_date);
      formData1.append("user_id", userID || user_Id);

      // Append the selected file if it exists
      if (selectedFile) {
        formData1.append("attachment", selectedFile.originFileObj);
      }

      // Log FormData to check its contents

      const apiUrl = "/api/treatments/update";
      const response = await axios.post(apiUrl, formData1, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Update the treatment data in data1.treatment array
        const updatedTreatmentIndex = data1.treatment.findIndex(
          (item) => item.id === editId
        );

        if (updatedTreatmentIndex !== -1) {
          const newData2 = { ...data1 };
          newData2.treatment[updatedTreatmentIndex] = formData1;
          setData1(newData2);

          message.success(t("treatment_view.Updated successfully."));
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
        } else {
          message.error(t("treatment_view.Treatment not found."));
        }
      } else {
        message.error(t("treatment_view.Failed to update record."));
      }
    } catch (error) {
      message.error(t("treatment_view.Failed to update record."));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const alert = async (record) => {
    try {
      const id = record.id;
      // Make the GET request using Axios
      const response = await axios.get(`/api/treatments/alert/${id}`);

      // Handle the response, for example:

      if (response.status === 200) {
        // Display a success message
        message.success(t("treatment_view.Notification Send successfully!"));
      } else {
        // Handle other status codes if needed

        message.error(t("treatment_view.Something went wrong!"));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors, for example:
      // Display an error message to the user
    }
  };
  const file = async (record) => {
    try {
      const id = record.id;
      // Make the GET request using Axios
      const response = await axios.get(`/api/attachment/show/${id}`, {
        responseType: "blob", // Set the response type to 'blob'
        withCredentials: true, // Include credentials in the request
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blobUrl = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "nErim");

      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      setConfirmLoading(false);

      message.success(t("treatment_view.Downloaded!"));
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors, for example:
      // Display an error message to the user
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data.is_admin);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  }, []);

  const columns = [
    {
      title: t("treatment_view.Action_Name"),
      dataIndex: "treat_name",
      key: "treat_name",
    },
    {
      title: t("treatment_view.Status"),
      dataIndex: "treat_status",
      key: "treat_status",
    },
    {
      title: t("treatment_view.Start_Date"),
      dataIndex: "started_date",
      key: "started_date",
    },
    {
      title: t("treatment_view.End_Date"),
      dataIndex: "closing_date",
      key: "closing_date",
    },
    {
      title: t("treatment_view.Action_Owner"),
      dataIndex: "treat_owner",
      key: "treat_owner",
    },
    {
      title: t("treatment_view.Action_Detail"),
      dataIndex: "treat_detial",
      key: "treat_detial",
    },
    {
      title: t("treatment_view.Expected_Benefit"),
      dataIndex: "expected_benefit",
      key: "expected_benefit",
    },
  ];
  // Conditionally include the action column based on apiData
  if (apiData !== "user") {
    columns.push({
      title: t("treatment_view.action"),
      key: "action",
      render: (text, record) => {
        return (
          <Space size="small">
            <Button type="primary" onClick={() => showModal(record)}>
              <Edit size={18} />
            </Button>
            <Button
              type="primary"
              onClick={() => alert(record)}
              style={{
                display: record.treat_status === "Finished" ? "none" : "block",
                marginLeft: "5px",
              }}
            >
              <Bell size={18} />
            </Button>
            <Button
              type="primary"
              onClick={() => file(record)}
              style={{
                display: record.treat_status === "Finished" ? "block" : "none",
              }}
            >
              <File size={18} />
            </Button>
            <Button type="primary" danger onClick={() => deleteFun(record)}>
              <Trash size={18} />
            </Button>
          </Space>
        );
      },
    });
  }

  const columnsTransfer = [
    {
      title: t("register.Action_Details"),
      dataIndex: "resolve",
      key: "resolve",
    },
  ];

  // Conditionally include the action column based on apiData
  if (apiData !== "user") {
    columnsTransfer.push({
      title: t("register.action"),
      key: "action",
      render: (text, record) => {
        return (
          <Space size="small">
            <Button type="primary" onClick={() => showModal(record)}>
              <Edit size={18} />
            </Button>
            <Button type="primary" danger onClick={() => deleteFun(record)}>
              <Trash size={18} />
            </Button>
          </Space>
        );
      },
    });
  }
  const deleteFun = async (record) => {
    try {
      // Make a DELETE request to your backend API
      const response = await axios.delete(
        `/api/treatments/delete/${record.id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the deletion was successful
      if (response.status === 200) {
        const updatedTreatment = data1.treatment.filter(
          (item) => item.id !== record.id
        );
        setData1({
          ...data1,
          treatment: updatedTreatment,
        });

        // setOpen(false);
        // setConfirmLoading(false);
        message.success(t("treatment_view.Risk deleted successfully."));
      } else {
        // Handle error if deletion fails
        setOpen(false);
        setConfirmLoading(false);
        // console.error("Deletion failed:", response.statusText);
        message.error(t("treatment_view.Failed to delete record."));
      }
    } catch (error) {
      message.error(
        t("treatment_view.An error occurred while deleting the record.")
      );
    }
  };

  const props = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        setSelectedFile(info.file);
      }
    },
  };

  const handleActionOwnerChange = (value) => {
    setSelectedActionOwner(value);

    if (value === "other") {
      setIsOtherSelected(true);
      setOwnerEmail1(""); // Clear the email field for custom input
    } else {
      setIsOtherSelected(false);

      // Find the selected user by name and update the ownerEmail1 state
      const selectedUser = Userdata.find((user) => user.name === value);

      if (selectedUser) {
        setOwnerEmail1(selectedUser.email);
        setUserID(selectedUser.id);
        form.setFieldsValue({
          action_owner_email: selectedUser.email,
        });
      } else {
        setOwnerEmail1(""); // Reset the ownerEmail1 if no user is selected
        // setSingleId(null);
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
  return (
    <>
      
      <Breadcrumb style={{ padding: "10px" }}>
        <Breadcrumb.Item>
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
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a
            onClick={() => {
              router.push(`/dashboard/register`);
            }}
            style={{ color: "#0D85D8" }}
          >
            {t("register.register_page")}
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ marginBottom: "20px" }}>
          <div >
            <span style={{ fontSize: "15px", color: "gray" }}>
              {t("treatment_view.View")}
            </span>
          </div>
        </Breadcrumb.Item>
      </Breadcrumb>
      {data1 && (
        <>
          <Card
            style={{ marginTop: "20px" }}
            title={t("treatment_view.Register_View")}
          >
            <Title level={5}>
              {t("treatment_view.Risk_Name")}:{" "}
              <Text mark style={{ fontSize: "18px" }}>
                {data1.register.risk_name}
              </Text>
            </Title>
            <Title level={5}>
              {t("treatment_view.Risk_Details")}:{" "}
              {data1.register.risk_identified}
            </Title>
            <Title level={5}>
              {t("Treatment")}:{" "}
              <span
                style={{
                  color: "#2F6690",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {data1.register.treatment_decision}
              </span>
            </Title>
            <Title level={5}>
              {t("treatment_view.Created_by")}: {data1.register.owner_email}
            </Title>
          </Card>
          <Divider>{t("treatment_view.Treatment_Status")}</Divider>
          {data1?.register.treatment_decision !== "Transfer" ? (
            <Table
              dataSource={data1?.treatment}
              columns={columns}
              rowKey={() => Math.random().toString(12).substr(2, 9)}
            />
          ) : (
            <Table
              dataSource={data1?.treatment}
              columns={columnsTransfer}
              rowKey={() => Math.random().toString(12).substr(2, 9)}
            />
          )}
        </>
      )}
      <Modal
        centered
        title={t("treatment_view.Edit_modal")}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {data1?.register.treatment_decision === "Transfer" ? (
          <Form form={form}>
            <Form.Item name="resolve" label={t("treatment_view.Action_Name")}>
              <Input placeholder={t("treatment_view.Input_Transfer")} />
            </Form.Item>
          </Form>
        ) : (
          <Form form={form}>
            <Form.Item
              name="treat_name"
              label={t("treatment_view.Action_Name")}
            >
              <Input placeholder={t("treatment_view.Input_Action_Name")} />
            </Form.Item>
            <Form.Item
              name="treat_detial"
              label={t("treatment_view.Action_Detail")}
            >
              {/* <TextArea maxLength={2} rows={4} placeholder="Action Detail" /> */}
              <TextArea
                showCount
                // maxLength={5}
                placeholder={t("treatment_view.Write_Details")}
                style={{
                  height: 120,
                  resize: "none",
                }}
              />
            </Form.Item>
            <Form.Item
              label={t("treatment_view.Action_Owner")}
              name="treat_owner"
            >
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
            </Form.Item>
            <Form.Item
              label={t("treatment_view.Owner_Email")}
              name="action_owner_email"
            >
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
            </Form.Item>
            <Form.Item
              name="expected_benefit"
              label={t("treatment_view.Expected_Benefit")}
            >
              <Input placeholder={t("treatment_view.Input_Expected_Benefit")} />
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="closing_date"
                  label={t("treatment_view.Closing_Date")}
                >
                  <DatePicker
                    onChange={(date, dateString) => setClosingDate(dateString)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {statusValue === "Started" && (
                  <Form.Item
                    style={{ marginLeft: "10px" }}
                    name="started_date"
                    label={t("treatment_view.Start_Date")}
                  >
                    <DatePicker onChange={onChange} />
                  </Form.Item>
                )}
                {statusValue === "Finished" && (
                  <>
                    <Form.Item
                      style={{ marginLeft: "10px" }}
                      name="finished_date"
                      label={t("treatment_view.Finished_Date")}
                    >
                      <DatePicker onChange={onChange} />
                    </Form.Item>
                  </>
                )}
              </Col>
            </Row>
            <Form.Item name="treat_status" label={t("treatment_view.Status")}>
              <Select
                defaultValue={t("treatment_view.Select_Status")}
                onChange={(value) => setStatusValue(value)}
                allowClear
                options={[
                  {
                    value: "Not Started",
                    label: t("treatment_view.Not_Started"),
                  },
                  { value: "Started", label: t("treatment_view.Started") },
                  {
                    value: "In Progress - In Control",
                    label: t("treatment_view.In_Progress"),
                  },
                  {
                    value: "Halted - In Control",
                    label: t("treatment_view.Halted_In"),
                  },
                  {
                    value: "Halted - Need Management Support",
                    label: t("treatment_view.Halted_Need"),
                  },
                  { value: "Finished", label: t("treatment_view.Finished") },
                ]}
              />
            </Form.Item>
            {statusValue === "Finished" && (
              <Form.Item label={t("treatment_view.File")}>
                <Upload {...props}>
                  <Button>{t("treatment_view.Click_to_Upload")}</Button>
                </Upload>
              </Form.Item>
            )}
          </Form>
        )}
      </Modal>
    </>
  );
};

export default View;
