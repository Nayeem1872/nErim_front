"use client";
import "../../style/signin.css";
import { useState, useEffect } from "react";
import { Button, Form, Input, message, notification } from "antd";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import axios from "axios";
import Cookies from "js-cookie";
// import fetch from "node-fetch";

const SignIn = () => {
  const [apiData, setApiData] = useState(null);
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const [messageApi] = message.useMessage();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const apiUrl = "/api/login";
      const requestBody = {
        email,
        password,
      };

      const response = await axios.post(apiUrl, requestBody);
      // Set values into localStorage
      localStorage.setItem("verifyEmail", response.data.verifyEmail);
      localStorage.setItem("authorization", response.data.authorization.token);
      localStorage.setItem("modelId", response.data.modelId);
      localStorage.setItem(
        "modelChangeStatus",
        response.data.modelChangeStatus
      );
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userName", response.data.userName);
      localStorage.setItem("twofactorSecrete", response.data.twofactorSecrete);
      localStorage.setItem("twofactorStatus", response.data.twofactorStatus);

      if (response.status === 200) {
        const twofactorStatus = localStorage
          .getItem("twofactorStatus")
          .toLowerCase();
        setLoading(false); // Set loading to false when the response is received
        if (twofactorStatus === "disable") {
          message.success("Login Successful!");
          router.push("/dashboard");
          // window.location.reload();
          return; // Exit the function
        } else {
          message.success("Login Successful!");
          router.push("/verify");
        }
      } else {
        setLoading(false); // Set loading to false if the response status is not 200
        message.error("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false); // Set loading to false if there's an error
      message.error("These credentials do not match our records.");
    }
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <>
      {domLoaded ? (
        <>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="row-col"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Email" style={{ height: "52px" }} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              {contextHolder}
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                className={styles.btn}
                loading={loading} 
              >
                SIGN IN
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default SignIn;
