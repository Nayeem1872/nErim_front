import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Modal,
  Checkbox,
  Space,
  Table,
  Tag,
  Popconfirm,
  message,
  Alert,
} from "antd";
import {
  CloudDownloadOutlined,
  DatabaseTwoTone,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ArchiveRestore } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dots from "../../components/DotLoader";
const CheckboxGroup = Checkbox.Group;

const Backup = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");
  const userId = localStorage.getItem("userId");
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [isModalRestoreOpen, setIsModalRestoreOpen] = useState(false);
  const [restore, setRestore] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [checkboxValues, setCheckboxValues] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const {
    data: dataSourceQuery,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["backup"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/get-risk-data-backup`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      const data = { userId: userId, verifyEmail: email, ...checkboxValues }; 

      const apiUrl = "/api/create-backup";

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refetch();
      message.success(t("BackUp.Took_a_new_backup!"));
    } catch (error) {
      console.error("Error sending data:", error);
      message.error("Something went wrong!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (name, e) => {
    const updatedValues = { ...checkboxValues, [name]: e.target.checked };
    setCheckboxValues(updatedValues);
  };

  // download popconfirm

  const showPopconfirm = (record) => {
    setOpen(record?.id);
  };
  const handleDownloadOk = async (record) => {
    try {
      // Start loading
      setConfirmLoading(true);

      const response = await axios.get(
        `/api/download-backup/${record?.storeFolder}`,
        {
          responseType: "blob", 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const blobUrl = window.URL.createObjectURL(response.data);
      const fileName = `Backup${
        record?.storeFolder ? `_${record.storeFolder}` : ""
      }.zip`;

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);

   
      document.body.appendChild(link);
      link.click();

    
      document.body.removeChild(link);

    
      setConfirmLoading(false);
      
      setOpen(false);

      message.success(t("BackUp.Downloaded!"));
    } catch (error) {
      console.error("Error downloading file:", error);
      // Stop loading if an error occurs
      setConfirmLoading(false);
    }
  };

  const handleDownloadCancel = () => {
    setOpen(false);
  };

  // delete popconfirm

  const showPopDeleteconfirm = (record) => {
    setOpenDelete(record?.id);
  };
  const handleDeleteOk = async (record) => {
    setConfirmLoadingDelete(true);

    try {
      const response = await axios.delete(
        `/api/delete-backup/${record?.storeFolder}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        refetch();
        const indexToDelete = dataSource.findIndex(
          (record) => record.key === id
        );
        setTimeout(() => {
          setOpenDelete(false);
          setConfirmLoadingDelete(false);
          message.success(t("BackUp.Backup_deleted_successfully"));
        }, 2000);
      }
    } catch (error) {
      setOpen(false);
      setConfirmLoading(false);
    }
  };
  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  // restore

  const handleRestoreOk = async (record) => {
    setIsModalRestoreOpen(false);
    setConfirmLoadingDelete(true);

    try {
      const response = await axios.get(`/api/backup-restore/${restore}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      if (response.status === 200) {
        message.success(t("BackUp.Backup_Restored_successfully"));
      }
    } catch (error) {
      setOpen(false);
      setConfirmLoading(false);
      // console.error("Error deleting record:", error);
      message.error(t("BackUp.An_error_occurred"));
    }
  };

  const showRestoreModal = (record) => {
    setIsModalRestoreOpen(true);
    setRestore(record?.storeFolder);
  };
  const handleRestoreCancel = () => {
    setIsModalRestoreOpen(false);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
  
        const response = await axios.get("/api/basic-status");


        setApiData(response.data.is_admin.toLowerCase());
      } catch (error) {
        console.error("Error fetching data:", error);
     
      }
    };

    fetchData();
  }, []);

  // Table
  const columns = [
    {
      title: t("BackUp.Date"),
      dataIndex: "date",
      key: "date",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("BackUp.File_Name"),
      dataIndex: "storeFolder",
      key: "storeFolder",
    },
    {
      title: t("BackUp.Content"),
      key: "content",
      dataIndex: "content",
      render: (content) => {
        let color = "";
        if (content === "Settings") {
          color = "green";
        } else if (content === "Risk Register") {
          color = "blue";
        } else if (content === "Register") {
          color = "violet";
        }

        return (
          <Tag color={color} key={content}>
            {content}
          </Tag>
        );
      },
    },
  ];

  if (apiData !== "user") {
    columns.push({
      title: t("BackUp.Action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Download"
            description="Are you sure?"
            open={open === record?.id}
            onConfirm={() => handleDownloadOk(record)}
            okButtonProps={{
              loading: confirmLoading,
            }}
            onCancel={handleDownloadCancel}
          >
            {/* Use a function reference for onClick */}

            <Button
              style={{ display: "flex", alignItems: "center" }}
              type="primary"
              onClick={() => showPopconfirm(record)}
            >
              {" "}
              <CloudDownloadOutlined size={20} /> {t("BackUp.Download")}
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            style={{
              display: "flex",
              alignItems: "center",
              background: "#2d6a4f",
              borderColor: "#2d6a4f",
            }}
            onClick={() => showRestoreModal(record)}
          >
            <ArchiveRestore size={16} style={{ marginRight: 5 }} />
            {t("BackUp.Restore")}
          </Button>

          <Popconfirm
            title={t("BackUp.Delete_the_task")}
            description={t("BackUp.Are_you_sure_to_delete_this_task")}
            open={openDelete == record?.id}
            onConfirm={() => handleDeleteOk(record)}
            // okButtonProps={{
            //   loading: confirmLoadingDelete,
            // }}
            onCancel={handleDeleteCancel}
          >
            <Button
              placement="topRight"
              style={{ display: "flex", alignItems: "center" }}
              type="primary"
              danger
              onClick={() => showPopDeleteconfirm(record)}
            >
              <DeleteOutlined size={16} /> {t("BackUp.Delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  }

  const start = () => {
    setLoading(true);

    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const checkboxes = [
    { name: "settings", label: t("BackUp.Settings"), value: "settings" },
    {
      name: "risk_registers",
      label: t("BackUp.Risk_Registers"),
      value: "risk_registers",
    },
    {
      name: "risk_treatments",
      label: t("BackUp.Risk_Treatments"),
      value: "risk_treatments",
    },
  ];

  return (
    <>
      {/* Modal */}
      <Modal
        title={t("BackUp.Are_you_sure?")}
        open={isModalRestoreOpen}
        onOk={handleRestoreOk}
        onCancel={handleRestoreCancel}
        centered
      >
        <Alert
          message={t("BackUp.If_you_execute_the_restore_action")}
          type="warning"
          showIcon
        />
      </Modal>

      <div>
        {apiData !== "user" && (
          <Button type="primary" onClick={showModal}>
            <DatabaseTwoTone /> {t("BackUp.Take_New_Backup")}
          </Button>
        )}
        <Modal
          title={t("BackUp.New_Backup")}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
        >
          {checkboxes.map((checkbox) => (
            <Checkbox
              key={checkbox.name}
              onChange={(e) => onChange(checkbox.name, e)} 
            >
              {checkbox.label}
            </Checkbox>
          ))}
        </Modal>
      </div>
      <>
        {dataSourceQuery && (
          <div style={{ marginTop: "15px" }}>
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <div></div>
              {/* <Button
                type="primary"
                danger
                onClick={start}
                disabled={!hasSelected}
                loading={loading}
              >
                {t("BackUp.Delete_All")}
              </Button> */}
              <span
                style={{
                  marginLeft: 8,
                }}
              >
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
              </span>

              {/* <h3>Backup Table</h3> */}
            </div>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "100px",
                }}
              >
                <Dots />
              </div>
            ) : (
              <Table
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSourceQuery}
                rowKey={() => Math.random().toString(12).substr(2, 9)}
                style={{
                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>
        )}
      </>
    </>
  );
};

export default Backup;
