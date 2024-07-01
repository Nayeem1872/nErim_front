"use client";
import { Skeleton, Row, Col, Card, Descriptions, Tag } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { CheckCircleOutlined } from "@ant-design/icons";
import { CircleDollarSign } from "lucide-react";

function Account() {
  const { t } = useTranslation();

  const [dataSourceQuery, setDataSourceQuery] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("/api/account-info", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataSourceQuery(response.data.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setLoading(false); // Set loading to false on error
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className={styles.profile}>
        <img
          src="/image/bg-profile.jpg"
          alt="User Image"
          style={{
            width: "1680px",
            height: "380px",
            borderRadius: "10%",
            marginBottom: "8px",
          }}
        />
      </div>

      <Row className={styles.middle} gutter={[24, 0]}>
        <Col span={12} offset={6} className="mb-24">
          <Card
            bordered={true}
            title={
              <h3 className={`${styles.cardTitle} font-semibold m-0`}>
                {t("account_info.ProfileInformation")}
              </h3>
            }
            className={`${styles.cardCustom} header-solid h-full card-profile-information`}
            style={{ paddingTop: 0, paddingBottom: 16 }}
          >
            {loading ? ( // Conditionally render skeleton loader while loading
              <Skeleton active paragraph={{ rows: 7 }} />
            ) : (
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Descriptions title="" style={{ marginTop: "20px" }}>
                    <Descriptions.Item
                      label={t("account_info.OrgName")}
                      span={3}
                      className={styles.descriptionItem}
                    >
                      {dataSourceQuery.orgName}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("account_info.Subscription")}
                      span={3}
                      className={styles.descriptionItem}
                    >
                      <Tag
                        color="cyan"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px", 
                        }}
                      >
                        <CircleDollarSign style={{ marginRight: "5px" }} size={15} />
                        {dataSourceQuery.subscription}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("account_info.UserCount")}
                      span={3}
                      className={styles.descriptionItem}
                    >
                      {dataSourceQuery.userCount}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("account_info.StartDate")}
                      span={3}
                      className={styles.descriptionItem}
                    >
                      {dataSourceQuery.startDate}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("account_info.EndDate")}
                      span={3}
                      className={styles.descriptionItem}
                    >
                      {dataSourceQuery.endDate}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("account_info.ModelName")}
                      span={3}
                      className={styles.descriptionItem}
                    >
                      {dataSourceQuery.modelName}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("account_info.Status")}
                      span={3}
                      className={styles.descriptionItem}
                    >
                      <span style={{ color: "green" }}>
                        <CheckCircleOutlined style={{ marginRight: "5px" }} />
                        {dataSourceQuery.status}
                      </span>{" "}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} sm={12}>
                  <img
                    src="/image/account.svg"
                    alt="Description of image"
                    style={{
                      width: "100%",
                      height: "300px",
                    }}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Account;
