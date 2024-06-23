"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, message, Space, Table } from "antd";
import { Divider, Typography } from "antd";
import { Button, Modal } from "antd";
import { Form, Input, Select } from "antd";
const { Option } = Select;
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
const { Title } = Typography;

const Users = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const email = localStorage.getItem("verifyEmail");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authorization");
  const [apiData, setApiData] = useState(null);
  const [serviceOwner, setServiceOwner] = useState("");
  
  // get data
  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
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

  const showModal = (record) => {
    if (record) {
      form.setFieldsValue(record);
      setEditId(record.id);
    } else {
      form.resetFields(); // Clear form fields if no record is provided
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // handle delete
  const handleDelete = async (record) => {
    try {
      const data = { userId: userId, verifyEmail: email, id: record };
      const response = await axios.post(`/api/user/delete`, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the deletion was successful
      if (response.status === 200) {
        refetch();
        message.success(t("users.Success_Messages.User_Deleted"));
      } else {
        // Handle error if deletion fails
        message.error(response.data);
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error("Error deleting record:", error);
      message.error(error.response.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data.is_admin);
        setServiceOwner(response.data.serviceOwner);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  }, []);

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: t("users.Confirm_Delete_Title"),
      content: t("users.Confirm_Delete_Content"),
      okText: t("users.Confirm"),
      okType: 'danger',
      cancelText: t("users.Cancel"),
      centered: true,
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    {
      title: t("users.id"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("users.name"),
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        // Predefined colors array
        const colors = ["#CAE7B9", "#F3DE8A", "#EB9486", "#7E7F9A", "#97A7B3"];
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
            {text}
          </div>
        );
      },
    },
    {
      title: t("users.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("users.is_admin"),
      dataIndex: "is_admin",
      key: "is_admin",
    },
  ];

  if (apiData !== "user") {
    columns.push({
      title: t("users.Action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {apiData === "user" ? null : (
            <>
              <Button type="default" onClick={() => showModal(record)}>
                {t("users.Edit")}
              </Button>
              <a onClick={() => showDeleteConfirm(record?.id)}>
                {t("users.Delete")}
              </a>
            </>
          )}
        </Space>
      ),
    });
  }

  const onFinish = async (values) => {
    setIsModalOpen(false);

    if (!editId) {
      try {
        const data = { userId: userId, verifyEmail: email, ...values };

        const apiUrl = "/api/user/save";
        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        refetch();
        // message.success(t("users.Success_Messages.New_User_Added"));
        message.success(response.data);
      } catch (error) {
        message.error(error.response.data);
      }
    }

    // edit
    else {
      try {
        const data = {
          userId: userId,
          verifyEmail: email,
          ...values,
          id: editId,
        };

        const apiUrl = `/api/user/update`;

        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          refetch();
          // If update is successful, update the dataSource
          const updatedData = dataSource.map((item) =>
            item.id === editId ? { ...item, ...formData } : item
          );
          setDataSource(updatedData);
          message.success(t("users.Success_Messages.User_Updated"));
        }
      } catch (error) {
        console.error("Error updating data:", error);
        message.error(t("users.Error_Messages.Update_Error"));
      }
    }
  };

  return (
    <>
      {/* <Title level={2}>{t("users.users")}</Title> */}
     
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
        <Breadcrumb.Item style={{ marginBottom: "20px" }}>
          <div >
            <span style={{ fontSize: '15px' ,color: "gray" }}>{t("users.users")}</span>
          </div>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />

      <Button
        style={{ marginBottom: "10px" }}
        type="primary"
        onClick={() => showModal()}
      >
        {t("users.Add_New_User")}
      </Button>

      <Table
        dataSource={data}
        columns={columns}
        rowKey={() => Math.random().toString(12).substr(2, 9)}
        style={{
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      />
      <Modal
        centered
        title={t("users.user")}
        open={isModalOpen}
        onCancel={handleCancel}
        footer=""
      >
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={t("users.name")}
            rules={[
              {
                required: true,
                message: t("users.Full_Name"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("users.email")}
            rules={[
              {
                type: "email",
                message: t("users.E-mail Invalid_Email"),
              },
              {
                required: true,
                message: t("users.E-mail Placeholder"),
              },
            ]}
          >
            <Input disabled={!!editId} />
          </Form.Item>

          <Form.Item
            name="is_admin"
            label={t("users.is_admin")}
            rules={[
              {
                required: true,
                message: t("users.Role Select_Role"),
              },
            ]}
          >
            <Select placeholder={t("users.Role Select_Role")}>
              <Option value="admin">{t("users.admin")}</Option>
              <Option value="user">{t("users.user")}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="twofactor_status"
            label={t("users.twofactor_status")}
            rules={[
              {
                required: true,
                message: t("users.Twofactor_Status Select_Status"),
              },
            ]}
          >
            <Select placeholder={t("users.select a Twofactor Status!")}>
              <Option value="Disable">{t("users.disable")}</Option>
              <Option value="Enable">{t("users.enable")}</Option>
            </Select>
          </Form.Item>

          {!editId && (
            <>
              <Form.Item
                name="password"
                label={t("users.password")}
                rules={[
                  {
                    required: true,
                    message: t("users.Password_input"),
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label={t("users.Confirm_Password")}
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: t("users.Placeholder"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t("users.No_Match")));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <button
              style={{
                backgroundColor: "#4096FF",
                color: "white",
                border: "2px solid #4096FF",
                borderRadius: "10px",
                padding: "5px 10px",
                float: "right",
                margin: "0 0 10px 10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
              }}
              type="submit"
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#007BFF")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#4096FF")
              }
            >
              {t("users.Submit")}
            </button>
            <button
              style={{
                backgroundColor: "#ffffff",
                color: "black",
                border: "2px solid #d9d9d9",
                borderRadius: "10px",
                padding: "5px 10px",
                float: "right",
                margin: "0 10px 10px 0",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
              }}
              onClick={handleCancel}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#ffffff")
              }
            >
              {t("users.Cancel")}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
