"use client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BarChart2,
  UserRoundPlus,
  ActivitySquare,
  Eye,
  Settings,
  LogOut,
  HelpCircle,
  UserCheck,
  Cross,
  CloudCog,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Space, ConfigProvider } from "antd";
import Dashboard_Settings from "./components/Dashboard_Settings";

import { useTranslation } from "react-i18next";
import Logo from "./components/logo";
import Cookies from "js-cookie";
import axios from "axios";

const { Header, Sider, Content, Footer } = Layout;

export default function DashboardLayout({ children }) {
  const { t } = useTranslation();
  const [apiData, setApiData] = useState(null);
  const [optVerify, setOtpVerify] = useState("");
  const [domLoaded, setDomLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [maintainence,setMaintainence] = useState("")
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");
        setApiData(response.data);
        setMaintainence(response.data.maintainenceMode)
        setOtpVerify(response.data.otp_verify);
        const twofactorStatus = localStorage
          .getItem("twofactorStatus")
          .toString()
          .toLowerCase();
        if (twofactorStatus === "enable" && response.data.otp_verify === "no") {
          // console.log("twofactorStatus",twofactorStatus);
          // console.log("otp_verify",response.data.otp_verify);
          // localStorage.clear();
          // Cookies.remove("XSRF-TOKEN");
          // Cookies.remove("nerim_session");
          router.push("/verify");
        }
        if (response.data.maintainenceMode == true) {
        
          handleLogout();
        }
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          //   localStorage.clear();
          //   Cookies.remove("XSRF-TOKEN");
          // Cookies.remove("nerim_session");
          router.push("/");
        }
        if (error?.response?.status === 500) {
          // Handle HTTP 500 error
          router.push("/");
        }
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
    setDomLoaded(true);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const baseStyle = {
    paddingLeft: "20px",
    transition:
      "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
  };

  const pathname = usePathname();

  const parts = pathname.split("/");

  const lastValue = parts[parts.length - 1];
  const last2value = parts[parts.length - 2];

  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("isDarkMode")) || false;
    }
    return false;
  });

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authorization");
    const email = localStorage.getItem("verifyEmail");
    try {
      // Remove token from localStorage
      localStorage.removeItem("authorization");
      const apiUrl = "/api/logout";

      const data = {
        verifyEmail: email,
        userId: userId,
        cookies: document.cookie,
      };

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        Cookies.remove("XSRF-TOKEN");
        Cookies.remove("nerim_session");

        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleClick = () => {
    setIsDarkMode((previousValue) => {
      // Toggle the mode
      const newMode = !previousValue;

      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  let userName = "";
  if (typeof window !== "undefined") {
    userName = localStorage.getItem("userName");
  }

  const isSettingsPage = pathname === "/dashboard/settings";

  return (
    <>
      {domLoaded ? (
        <>
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "rgb(245, 245, 245)",

                  fontSize: 15,
                },
                // Modal: {
                //   contentBg: "rgba(206, 212, 218, 0.48)",
                //   headerBg: "rgba(206, 212, 218, 0)"
                // }
              },
            }}
          >
            <Layout style={{ minHeight: "100vh", backgroundColor: "#4096FF" }}>
              <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                  setCollapsed(broken);
                }}
                onCollapse={(collapsed, type) => {
                  setCollapsed(collapsed);
                }}
                style={{
                  position: "fixed",
                  height: "100%",
                  zIndex: 1,
                  justifyContent: "center" /* horizontally center */,
                  alignItems: "center",
                }}
              >
                {/* Top of Sidebar - Image, Name, Subname */}
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    // color: "#191919",
                    // backgroundColor: isDarkMode ? "#141414" : "#FFFFFF",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Logo />
                  <p
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      // color: isDarkMode ? "#F2F2F2" : "#000000",
                      color: "#000000",
                      marginBottom: "30px",
                    }}
                  >
                    {userName}
                  </p>
                </div>

                {/* Menu Items */}
                <Menu
                  // theme="light"
                  mode="inline"
                  // defaultSelectedKeys={["1"]}
                  style={{
                    minHeight: "100vh",
                    // backgroundColor: isDarkMode ? "#001529" : "#ffffff",
                    backgroundColor: "#ffffff",
                  }}
                  items={[
                    {
                      key: "1",
                      icon: <LayoutDashboard />,
                      label: t("side_navbar.dashboard"),
                      onClick: () => router.push("/dashboard"),
                      style: {
                        ...baseStyle,
                        background:
                          pathname === "/dashboard" ? "#4096FF" : "inherit",
                        color: pathname === "/dashboard" ? "white" : "inherit",
                        boxShadow:
                          pathname === "/dashboard"
                            ? "0 0 15px rgba(0, 0, 255, 0.5)"
                            : "none",
                        transition:
                          "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      ":hover": {
                        transform:
                          pathname === "/dashboard"
                            ? "translateY(-3px)"
                            : "none",
                        background:
                          pathname === "/dashboard" ? "#3382CC" : "inherit", // Light blue on hover
                      },
                    },
                    {
                      key: "5",
                      icon: <User />,
                      label: t("side_navbar.users"),
                      style: {
                        background:
                          pathname === "/dashboard/users"
                            ? "#4096FF"
                            : "inherit",
                        color:
                          pathname === "/dashboard/users" ? "white" : "inherit",
                        boxShadow:
                          pathname === "/dashboard/users"
                            ? "0 0 15px rgba(0, 0, 255, 0.5)"
                            : "none",
                        transition:
                          "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      onClick: () => router.push("/dashboard/users"),
                    },

                    {
                      key: "2",
                      icon: <CloudCog style={{ fontSize: "22px" }} />,
                      label: t("side_navbar.Risk Management"),
                      style: {
                        background: "#FFFFFF",
                        border: "none", // Ensure no border if applicable
                      },
                      children: [
                        {
                          key: "22",
                          icon: <UserRoundPlus />,
                          label: t("side_navbar.register"),
                          style: {
                            paddingLeft: "40px",
                            background:
                              pathname === "/dashboard/register" ||
                              pathname ===
                                `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                              pathname ===
                                `/dashboard/register/edit/${lastValue}` ||
                              pathname === "/dashboard/register/add" ||
                              pathname ===
                                `/dashboard/register/view/${lastValue}`
                                ? "#4096FF"
                                : "#FFFFFF",
                            color:
                              pathname === "/dashboard/register" ||
                              pathname ===
                                `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                              pathname ===
                                `/dashboard/register/edit/${lastValue}` ||
                              pathname === "/dashboard/register/add" ||
                              pathname ===
                                `/dashboard/register/view/${lastValue}`
                                ? "white"
                                : "inherit",
                            boxShadow:
                              pathname === "/dashboard/register" ||
                              pathname ===
                                `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                              pathname ===
                                `/dashboard/register/edit/${lastValue}` ||
                              pathname === "/dashboard/register/add" ||
                              pathname ===
                                `/dashboard/register/view/${lastValue}`
                                ? "0 0 15px rgba(0, 0, 255, 0.5)"
                                : "none",
                            transition:
                              "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer", // Ensure cursor changes on hover
                          },
                          ":hover": {
                            background:
                              pathname === "/dashboard/register" ||
                              pathname ===
                                `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                              pathname ===
                                `/dashboard/register/edit/${lastValue}` ||
                              pathname === "/dashboard/register/add" ||
                              pathname ===
                                `/dashboard/register/view/${lastValue}`
                                ? "#3382CC"
                                : "#FFFFFF", // Light blue on hover
                          },
                          onClick: () => router.push("/dashboard/register"),
                        },
                        {
                          key: "3",
                          icon: <Cross />,
                          label: t("side_navbar.Treatment"),
                          style: {
                            paddingLeft: "40px",
                            background:
                              pathname === "/dashboard/risk_treatment" ||
                              pathname ===
                                `/dashboard/risk_treatment/view/${lastValue}`
                                ? "#4096FF"
                                : "#FFFFFF",
                            color:
                              pathname === "/dashboard/risk_treatment" ||
                              pathname ===
                                `/dashboard/risk_treatment/view/${lastValue}`
                                ? "white"
                                : "inherit",
                            boxShadow:
                              pathname === "/dashboard/risk_treatment" ||
                              pathname ===
                                `/dashboard/risk_treatment/view/${lastValue}`
                                ? "0 0 15px rgba(0, 0, 255, 0.5)"
                                : "none",
                            transition:
                              "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer", // Ensure cursor changes on hover
                          },
                          ":hover": {
                            background:
                              pathname === "/dashboard/risk_treatment" ||
                              pathname ===
                                `/dashboard/risk_treatment/view/${lastValue}`
                                ? "#3382CC"
                                : "#FFFFFF", // Light blue on hover
                          },
                          onClick: () =>
                            router.push("/dashboard/risk_treatment"),
                        },
                        {
                          key: "4",
                          icon: <ActivitySquare />,
                          label: t("side_navbar.heat_map"),
                          style: {
                            paddingLeft: "40px",
                            background:
                              pathname === "/dashboard/heat_map"
                                ? "#4096FF"
                                : "#FFFFFF",
                            color:
                              pathname === "/dashboard/heat_map"
                                ? "white"
                                : "inherit",
                            boxShadow:
                              pathname === "/dashboard/heat_map"
                                ? "0 0 15px rgba(0, 0, 255, 0.5)"
                                : "none",
                            transition:
                              "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer", // Ensure cursor changes on hover
                          },
                          onClick: () => router.push("/dashboard/heat_map"),
                        },
                      ],
                    },

                    {
                      key: "6",
                      icon: <Eye />,
                      label: t("side_navbar.audit"),
                      style: {
                        background:
                          pathname === "/dashboard/audit"
                            ? "#4096FF"
                            : "inherit",
                        color:
                          pathname === "/dashboard/audit" ? "white" : "inherit",
                        boxShadow:
                          pathname === "/dashboard/audit"
                            ? "0 0 15px rgba(0, 0, 255, 0.5)"
                            : "none",
                        transition:
                          "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      ":hover": {
                        transform:
                          pathname === "/dashboard/audit"
                            ? "translateY(-3px)"
                            : "none",
                        background:
                          pathname === "/dashboard/audit"
                            ? "#3382CC"
                            : "inherit", // Light blue on hover
                      },
                      onClick: () => router.push("/dashboard/audit"),
                    },

                    {
                      key: "7",
                      icon: <BarChart2 />,
                      label: t("side_navbar.States Menu"),
                      style: {
                        background:
                          pathname === "/dashboard/stats"
                            ? "#4096FF"
                            : "inherit",
                        color:
                          pathname === "/dashboard/stats" ? "white" : "inherit",
                        boxShadow:
                          pathname === "/dashboard/stats"
                            ? "0 0 15px rgba(0, 0, 255, 0.5)"
                            : "none",
                        transition:
                          "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      ":hover": {
                        transform:
                          pathname === "/dashboard/stats"
                            ? "translateY(-3px)"
                            : "none",
                        background:
                          pathname === "/dashboard/stats"
                            ? "#3382CC"
                            : "inherit", // Light blue on hover
                      },
                      onClick: () => router.push("/dashboard/stats"),
                    },

                    {
                      key: "8",
                      icon: <Settings />,
                      label: t("side_navbar.settings"),
                      style: {
                        background:
                          pathname === "/dashboard/settings"
                            ? "#4096FF"
                            : "inherit",
                        color:
                          pathname === "/dashboard/settings"
                            ? "white"
                            : "inherit",
                        boxShadow:
                          pathname === "/dashboard/settings"
                            ? "0 0 15px rgba(0, 0, 255, 0.5)"
                            : "none",
                        transition:
                          "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      ":hover": {
                        transform:
                          pathname === "/dashboard/settings"
                            ? "translateY(-3px)"
                            : "none",
                        background:
                          pathname === "/dashboard/settings"
                            ? "#3382CC"
                            : "inherit", // Light blue on hover
                      },
                      onClick: () => router.push("/dashboard/settings"),
                    },

                    {
                      key: "9",
                      icon: <UserCheck />,
                      label: t("side_navbar.account_info"),
                      style: {
                        background:
                          pathname === "/dashboard/account_info"
                            ? "#4096FF"
                            : "inherit",
                        color:
                          pathname === "/dashboard/account_info"
                            ? "white"
                            : "inherit",
                        boxShadow:
                          pathname === "/dashboard/account_info"
                            ? "0 0 15px rgba(0, 0, 255, 0.5)"
                            : "none",
                        transition:
                          "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      ":hover": {
                        transform:
                          pathname === "/dashboard/account_info"
                            ? "translateY(-3px)"
                            : "none",
                        background:
                          pathname === "/dashboard/account_info"
                            ? "#3382CC"
                            : "inherit", // Light blue on hover
                      },
                      onClick: () => router.push("/dashboard/account_info"),
                    },

                    {
                      key: "11",
                      icon: <HelpCircle />,
                      label: t("side_navbar.Help"),
                      style: {
                        background: "inherit",
                        color: "inherit",
                        boxShadow: "none",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      ":hover": {
                        transform: "translateY(-3px)",
                        background: "#3382CC", // Light blue on hover
                      },
                      onClick: () =>
                        router.push("https://nnurcloud.com/support/"),
                    },

                    {
                      key: "10",
                      icon: <LogOut />,
                      label: t("side_navbar.logout"),
                      style: {
                        background:
                          pathname === "/dashboard/profile"
                            ? "#4096FF"
                            : "inherit",
                        color:
                          pathname === "/dashboard/profile"
                            ? "white"
                            : "inherit",
                        boxShadow:
                          pathname === "/dashboard/profile"
                            ? "0 0 15px rgba(0, 0, 255, 0.5)"
                            : "none",
                        transition:
                          "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                        cursor: "pointer", // Ensure cursor changes on hover
                      },
                      ":hover": {
                        transform:
                          pathname === "/dashboard/profile"
                            ? "translateY(-3px)"
                            : "none",
                        background:
                          pathname === "/dashboard/profile"
                            ? "#3382CC"
                            : "inherit", // Light blue on hover
                      },
                      onClick: handleLogout,
                    },
                  ]}
                />
              </Sider>
              <Layout
                className="site-layout"
                style={{ marginLeft: collapsed ? 0 : 200 }}
              >
                <Header
                  style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: 10,
                    position: "sticky",
                    top: 0,
                    zIndex: 1000, // Ensure the header is on top of other content
                  }}
                >
                  <Space>
                    <Button
                      type="text"
                      icon={
                        collapsed ? (
                          <MenuUnfoldOutlined />
                        ) : (
                          <MenuFoldOutlined />
                        )
                      }
                      onClick={() => setCollapsed(!collapsed)}
                      style={{
                        fontSize: "20px",
                        width: 64,
                        height: 64,
                      }}
                    />
                    {/* <Search /> */}
                  </Space>

                  <Space style={{ marginRight: "50px" }}>
                    {/* <Notification /> */}
                    <Dashboard_Settings onToggle={handleClick} />
                  </Space>
                </Header>

                <Content
                  style={{
                    margin: "15px 16px 24px",
                    padding: 24,
                    minHeight: 280,
                    background: isDarkMode ? "#000000" : "#F5F5F5",
                  }}
                >
                  {children}
                </Content>
                {!isSettingsPage && (
                  <Footer
                    style={{
                      textAlign: "center",
                      // background: isDarkMode ? "#141414" : "#ffffff",
                      background: "#ffffff",
                      color: "#333", // Adjust text color as needed
                      padding: "20px",
                      // Adjust padding as needed
                    }}
                  >
                    nErim v2.0.0 ©{new Date().getFullYear()} Developed by{" "}
                    <span style={{ color: "#4096FF", fontWeight: "bold" }}>
                      Alo It Consultants
                    </span>
                  </Footer>
                )}
              </Layout>
              {/* <DashboardFooter /> */}
            </Layout>
          </ConfigProvider>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
