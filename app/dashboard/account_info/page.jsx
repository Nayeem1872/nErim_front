"use client";
import styles from "./style.module.css";
import { Row, Col, Card, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect, useState } from "react";


function Account() {
  const { t } = useTranslation();

  const [dataSourceQuery, setDataSourceQuery] = useState([]);

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
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    // <>
    //   <Breadcrumb style={{ padding: "10px" }}>
    //     <Breadcrumb.Item>
    //       <a
    //         onClick={() => {
    //           router.push(`/dashboard`);
    //         }}
    //         style={{ display: "flex", alignItems: "center", gap: "5px" }}
    //       >
    //         <LayoutDashboard
    //           style={{ fontSize: "20px", marginBottom: "2px" }}
    //           color="#0D85D8"
    //         />
    //       </a>
    //     </Breadcrumb.Item>
    //     <Breadcrumb.Item style={{ marginBottom: "20px" }}>
    //       <div >
    //         <span style={{ fontSize: "15px",color: "gray"  }}>{t("side_navbar.account_info")}</span>
    //       </div>
    //     </Breadcrumb.Item>
    //   </Breadcrumb>
    //   {/* <div className={styles.profile}> */}
    //   <img
    //     src="/image/Account.svg"
    //     alt="User Image"
    //     style={{
    //       position: "relative",
    //       width: "860px",
    //       height: "550px",
    //       marginLeft: "-20px",
    //       marginTop:"0px",
    //       top: "10",
    //       left: "0",
    //     }}
    //   />
    //   {/* </div> */}

    //   <Row className={styles.middle} gutter={[24, 0]}>
    //     <Col span={12} offset={6} className="mb-24">
    //       <Card
    //         bordered={true}
    //         title={
    //           <h3 className={`${styles.cardTitle} font-semibold m-0`}>
    //             {t("account_info.ProfileInformation")}
    //           </h3>
    //         }
    //         className={`${styles.cardCustom} header-solid h-full card-profile-information`}
    //         style={{
    //           position: "absolute",
    //           top: "0",
    //           left: "50%",
    //           transform: "translate(-50%, -100%)",
    //           marginTop:"-50px"
    //         }}
    //       >
    //         {/* <hr className="my-25" /> */}
    //         <Descriptions title="" style={{ marginTop: "20px",textAlign: "center"  }}>
    //           <Descriptions.Item
    //             label={t("account_info.OrgName")}
    //             span={3}
    //             className={styles.descriptionItem}
    //             style={{ textAlign: "center" }}
    //           >
    //             {dataSourceQuery.orgName}
    //           </Descriptions.Item>
    //           <Descriptions.Item
    //             label={t("account_info.Subscription")}
    //             span={3}
    //             className={styles.descriptionItem}
    //           >
    //             {dataSourceQuery.subscription}
    //           </Descriptions.Item>
    //           <Descriptions.Item
    //             label={t("account_info.UserCount")}
    //             span={3}
    //             className={styles.descriptionItem}
    //           >
    //             {dataSourceQuery.userCount}
    //           </Descriptions.Item>
    //           <Descriptions.Item
    //             label={t("account_info.StartDate")}
    //             span={3}
    //             className={styles.descriptionItem}
    //           >
    //             {dataSourceQuery.startDate}
    //           </Descriptions.Item>
    //           <Descriptions.Item
    //             label={t("account_info.EndDate")}
    //             span={3}
    //             className={styles.descriptionItem}
    //           >
    //             {dataSourceQuery.endDate}
    //           </Descriptions.Item>
    //           <Descriptions.Item
    //             label={t("account_info.ModelName")}
    //             span={3}
    //             className={styles.descriptionItem}
    //           >
    //             {dataSourceQuery.modelName}
    //           </Descriptions.Item>
    //           <Descriptions.Item
    //             label={t("account_info.Status")}
    //             span={3}
    //             className={styles.descriptionItem}
    //           >
    //             {dataSourceQuery.status}
    //           </Descriptions.Item>
    //         </Descriptions>
    //       </Card>
    //     </Col>
    //   </Row>
    // </>
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
            {/* <hr className="my-25" /> */}
            <Row gutter={16}>
              <Col span={12}>
            <Descriptions title="" style={{marginTop:"20px"}}>
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
                {dataSourceQuery.subscription}
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
                {dataSourceQuery.status}
              </Descriptions.Item>
            </Descriptions>
            </Col>
            <Col span={12}>
                <img
                  src="/image/account.svg"
                  alt="Description of image"
                  style={{
                    width: "100%",
                    height: "300px",
                    // marginLeft: "50px",
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Account;
