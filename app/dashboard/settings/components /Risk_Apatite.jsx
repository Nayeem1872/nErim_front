import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, InputNumber, message, Spin } from "antd";
import { Typography } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";
const { Title } = Typography;
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const Risk_Apatite = () => {
  const [apetiteValue, setApetiteValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");
  const userId = localStorage.getItem("userId");
  const storedMatrixId = localStorage.getItem("modelId");
  const { data: dataSourceQuery, refetch } = useQuery({
    queryKey: ["apetiteData"],
    queryFn: async () => {
      const response = await axios.get(`/api/get-risk-apetite`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.apetiteData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  useEffect(() => {
    if (dataSourceQuery) {
      setApetiteValue(dataSourceQuery.key_value);
    }
  }, [dataSourceQuery]);

  const handleInputChange = async (value) => {
    setLoading(true); // Start loading
    setApetiteValue(value);
    try {
      const data = {
        userId: userId,
        verifyEmail: email,
        value: value, // Use the new value
      };

      const apiUrl = `/api/update-risk-apetite`;

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        refetch();
        message.loading({
          content: t("Risk_Apatite.Action_in_progress"),
          duration: 3,
        });
        setTimeout(() => {
          message.success(t("Risk_Apatite.Risk_Apatite_updated_successfully."));
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      message.error(
        t("Risk_Apatite.An_error_occurred_while_updating_the_record.")
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const max = () => {
    return storedMatrixId * storedMatrixId;
  };
  const [apiData, setApiData1] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/basic-status");
        setApiData1(response.data.is_admin.toLowerCase());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleIncrement = () => {
    // const newValue = Math.min(apetiteValue + 1, 1);
    // handleInputChange(newValue);
    console.log("apt", apetiteValue);
    const newValue = parseInt(apetiteValue) + 1;
    if (max <= parseInt(newValue)) {
      return;
    }
    handleInputChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(apetiteValue - 1, 1);
    handleInputChange(newValue);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title level={4}>{t("Risk_Apatite.Risk_Apatite")}</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "12px",
            marginLeft: "5px",
          }}
        >
          <InputNumber
            readOnly={true}
            min={1}
            max={max()}
            onChange={handleInputChange}
            value={apetiteValue}
            style={{ width: "200px", marginRight: "5px" }}
          />
          {apiData !== "user" && (
            <>
              <Button
                onClick={handleIncrement}
                icon={<PlusOutlined />}
                style={{ marginRight: "5px" }}
                disabled={loading}
              />
              <Button
                onClick={handleDecrement}
                icon={<MinusOutlined />}
                disabled={loading}
              />
            </>
          )}
          {loading && <Spin style={{ marginLeft: "10px" }} />}
        </div>
      </div>

      <div style={{ marginTop: "8px" }}>
        <p style={{ fontSize: "14px", color: "#555" }}>
          Risk Appetite reflects your willingness to accept or tolerate risk in
          pursuit of objectives. Adjust the value above to indicate your current
          risk appetite level.
        </p>
      </div>
    </div>
  );
};

export default Risk_Apatite;
