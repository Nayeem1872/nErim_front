"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import "@amcharts/amcharts5/xy";
import { Button, Table, Typography, Breadcrumb, Divider, Result, Row, Col } from "antd";
import { useRouter } from "next/navigation";
const { Text } = Typography;
import { LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Heatmap() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const router = useRouter();
  const [apiData, setApiData] = useState(null);
  const [impactId,setImpactId] = useState('')
  const [LikelihoodId,setLikelihoodId] = useState('')


  const handleSettingsClick = () => {
    router.push("/dashboard/settings"); // Navigate to settings page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data);
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


  useEffect(() => {
    let root = am5.Root.new("chartdiv15");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 0,
        layout: root.verticalLayout,
      })
    );

    let yRenderer = am5xy.AxisRendererY.new(root, {
      visible: false,
      minGridDistance: 20,
      inversed: true,
      minorGridEnabled: true,
    });
    yRenderer.grid.template.set("visible", false);
    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: yRenderer,
        categoryField: "category",
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root, {
      visible: false,
      minGridDistance: 30,
      inversed: true,
      minorGridEnabled: true,
    });
    xRenderer.grid.template.set("visible", false);
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: xRenderer,
        categoryField: "category",
      })
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        calculateAggregates: true,
        stroke: am5.color(0xffffff),
        clustered: false,
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: "x",
        categoryYField: "y",
        valueField: "value",
      })
    );

    series.columns.template.setAll({
      tooltipText: "{value}",
      strokeOpacity: 1,
      strokeWidth: 2,
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      cornerRadiusBL: 5,
      cornerRadiusBR: 5,
      width: am5.percent(100),
      height: am5.percent(100),
      templateField: "columnSettings",
    });

    let circleTemplate = am5.Template.new({});
    series.set("heatRules", [
      {
        target: circleTemplate,
        min: 10,
        max: 35,
        dataField: "value",
        key: "radius",
      },
    ]);

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(
          root,
          {
            fill: am5.color(0x000000),
            fillOpacity: 0.5,
            strokeOpacity: 0,
          },
          circleTemplate
        ),
      });
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          fill: am5.color(0xffffff),
          populateText: true,
          centerX: am5.p50,
          centerY: am5.p50,
          fontSize: 10,
          text: "{value}",
        }),
      });
    });

    series.columns.template.events.on("hit", function (ev) {
   
    });

    async function fetchData() {
      try {
        const response = await axios.get("/api/get-heatmap");

        const data = response.data.data;
        // setImpactId(data.impact_id)
        console.log("Data",data);

        // Extract categories for yAxis (likelihood_critical) and xAxis (impact_critical)
        const yAxisCategories = [];
        data.map((item) => {
          if (
            yAxisCategories?.findIndex(
              (y) => y.category === item.impact_critical
            ) === -1
          ) {
            yAxisCategories.push({ category: item.impact_critical });
          }
        });

        const xAxisCategories = [];
        data.map((item) => {
          if (
            xAxisCategories?.findIndex(
              (x) => x.category === item.likelihood_critical
            ) === -1
          ) {
            xAxisCategories.push({ category: item.likelihood_critical });
          }
        });
        const finalData = data?.map((d) => {
          return {
            x: d.likelihood_critical,
            y: d.impact_critical,
            columnSettings: {
              fill: d.color.startsWith("#") ? d.color : "#" + d.color,
            },
            value: d.registersCount,
            custom: d.score,
            impactId: d.impact_id,
            LikelihoodId:d.likelihood_id
          };
        });

        series.columns.template.events.on("click", async function (ev) {
          const clickedCustom = ev.target.dataItem.dataContext.custom;
        
          const impact = ev.target.dataItem.dataContext.impactId;
          const likelihood = ev.target.dataItem.dataContext.LikelihoodId

          try {
            const response = await axios.get(
              `/api/get-heatmap/${impact}/${likelihood}`
            );
            setData(response.data.scoreData);
          } catch (error) {
        
          }
        });

        series.data.setAll(finalData);
        yAxis.data.setAll(yAxisCategories);
       
        xAxis.data.setAll(xAxisCategories);
    

        chart.appear(1000, 100);
      } catch (error) {
  
      }
    }

    fetchData();

    return () => {
      root.dispose();
    };
  }, []);



  const columns = [
    {
      title: t("heatmap.ID"),
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: t("heatmap.Risk_Identified"),
      dataIndex: "risk_identified",
      key: "risk_identified",
    },
    {
      title: t("heatmap.Potential_Impact"),
      dataIndex: "potential_impact",
      key: "potential_impact",
    },
    {
      title: t("heatmap.Financial_Impact"),
      dataIndex: "financial_impact",
      key: "financial_impact",
    },
    {
      title: t("heatmap.Criticality_Score"),
      key: "criticality_score",
      render: (text, record) => {
        const criticalityScore = record.risk_consequence_id * record.risk_likelihood_id;
        return <div>{criticalityScore}</div>;
      },
    },
    {
      title: t("register.risk_criticality"),
      dataIndex: "risk_criticality",
      align: "center",
      render: (text, record) => {
        const color = record.risk_matrix.color.startsWith("#")
        ? record.risk_matrix.color
        : `#${record.risk_matrix.color}`;
      const isCriticalStepDefined =
        record.risk_matrix.critical_step !== undefined &&
        record.risk_matrix.critical_step !== "";

        return (
          <div
            style={{
              backgroundColor: color,
              borderRadius: "8px",
              padding: "5px 10px",
              color: isCriticalStepDefined ? "#000" : "#fff",
              textAlign: "center",
            }}
          >
            {record.risk_matrix.critical_step}
          </div>
        )
      }
    },
    {
      title: t("heatmap.Action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            type="primary"
            onClick={() => {
              router.push(`/dashboard/register/view/${record?.id}`);
            }}
          >
            {t("heatmap.View")}
          </Button>
        </div>
      ),
    },
  ];


  const breadcrumbItems = [
    {
      key: 'dashboard',
      title: (
        <a
          onClick={() => {
            router.push(`/dashboard`);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <LayoutDashboard style={{ fontSize: '20px', marginBottom: '2px' }} color="#0D85D8" />
        </a>
      ),
    },
    {
      key: 'heatmap',
      title: (
        <div>
          <span style={{ fontSize: '15px', color: 'gray' }}>{t("heatmap.heat_map")}</span>
        </div>
      ),
      style: { marginBottom: '20px' },
    },
  ];
  const textStyle = {
    color: 'gray',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.5',
    width: '90%',
    maxWidth: '600px',
    margin: '40px auto'
  };
  return (
    <>
       <Breadcrumb style={{ padding: '10px' }} items={breadcrumbItems} />
      <Divider />
      
      <Text style={textStyle}>
      {t("A heat map is a graphical representation of data where the individual values contained in a matrix are represented as colors.\n\nThe impact is represented as rows, and the likelihood is represented as columns.")}
    </Text>
          
          
       
    {isError ? (
      <Row justify="center" align="middle" style={{ minHeight: '300px' }}>
        <Col>
          <Result
            status="warning"
            title={
              apiData?.impactStatus === false
                ? t("There are some problems with your Risk Impact!")
                : apiData?.likelihoodStatus === false
                ? t("Something wrong in your risk Likelihood")
                : t("Something wrong in your risk valuation")
            }
            subTitle={t("Please check your settings.")}
            extra={
              <Button type="primary" onClick={handleSettingsClick}>
                {t("Go Settings")}
              </Button>
            }
          />
        </Col>
      </Row>
    ) : (
      <div>
        <Row justify="center">
          <Col span={24}>
            <div id="chartdiv15" style={{ width: '100%', height: '500px', marginTop: '20px'}} />
          </Col>
        </Row>
        {data && data.length > 0 && (
          <Row justify="center" style={{ marginTop: '20px' }}>
            <Col xs={24} md={20} lg={16}>
              <Table dataSource={data} columns={columns} rowKey={() => Math.random().toString(12).substr(2, 9)} />
            </Col>
          </Row>
        )}
      </div>
    )}
  </>
  );
}
