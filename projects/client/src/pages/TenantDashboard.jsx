import Axios from "axios";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
const {
  Box,
  Input,
  Container,
  Text,
  Flex,
  Table,
  Thead,
  Th,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Button,
  Link,
  textDecoration,
  TableCaption,
  useMediaQuery,
  Divider,
} = require("@chakra-ui/react");

const TenantDashboardPage = ({ isMobile }) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const [data, setData] = useState(null)
  const [propertyData, setProperty] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const getData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if(getLocalStorage){
        const res = await Axios.get(process.env.REACT_APP_API_BASE_URL + "/orderlist/tenant-chart", {
          headers: {
            "Authorization": `Bearer ${getLocalStorage}`
          }
        })
        console.log(res.data.data)
        const days = res.data.data.map(val =>{
          return new Date(val.createdAt).getDay() === 0 ? 6 : new Date(val.createdAt).getDay() - 1;
        })
        const currentIncome = [0,0,0,0,0,0,0];
        const days2 = days.map((val, idx) =>{
          return currentIncome[val] = res.data.data[idx].price
        })
        const income = res.data.data.map(val =>{
          return val.price
        })
        setData(currentIncome)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      subtitle: {
        display: totalIncome,
        text: `Total Income: ${totalIncome.toLocaleString("id", {
          style: "currency",
          currency: "IDR",
        })}`,
        align: "start",
        font: { weight: "bold" },
        color: "#3182ce",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("id", {
                style: "currency",
                currency: "IDR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            return value.toLocaleString("id", { style: "currency", currency: "IDR" });
          },
        },
      },
    },
  };
  const dataset = {
    labels,
    datasets: [
      {
        label: "Income",
        data: data,
        borderColor: "rgb(72, 187, 120)",
        backgroundColor: "rgba(72, 187, 120, 0.5)",
      },
    ],
  };
  let crosshair;
  const crosshairLabel = {
    id: "crosshairLabel",
    //draw lines
    afterDatasetsDraw(chart, args) {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
        scales: { x, y },
      } = chart;
      if (crosshair) {
        ctx.save();
        ctx.beginPath();
        crosshair.forEach((line, index) => {
          ctx.moveTo(line.startX, line.startY);
          ctx.lineTo(line.endX, line.endY);
          ctx.stroke();
        });
        // draw rectangle
        ctx.fillStyle = "grey";
        ctx.fillRect(0, crosshair[0].startY - 10, left, 20);

        ctx.font = "bold 12px sans-serif";
        // font options
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        // draw text
        ctx.fillText(
          y
            .getValueForPixel(crosshair[0].startY)
            .toLocaleString("id", { style: "currency", currency: "IDR" }),
          left / 2,
          crosshair[0].startY
        );
      }
    },
    //detect mouse movement
    afterEvent(chart, args) {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
      } = chart;
      const xCoor = args.event.x;
      const yCoor = args.event.y;

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgb(108, 122, 137)";

      if (!args.inChartArea && crosshair) {
        crosshair = undefined;
        args.changed = true;
      } else if (args.inChartArea) {
        crosshair = [
          {
            startX: left,
            startY: yCoor,
            endX: right,
            endY: yCoor,
          },
          {
            startX: xCoor,
            startY: top,
            endX: xCoor,
            endY: bottom,
          },
        ];

        args.changed = true;
      }
    },
  };
  
  const plugins = [crosshairLabel];
  const getPropertiesData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/tenant/properties",
          {},
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        setProperty(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTransactionData = async() =>{
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
      const res = await Axios.post(process.env.REACT_APP_API_BASE_URL + "/tenant/transaction", {},{
        headers:{
          Authorization: `Bearer ${getLocalStorage}`
        }
      })
      setTransactionData(res.data.result)
    }
    } catch (error) {
      console.log(error)
    }
  }
  

  useEffect(() => {
    document.title = "Renthaven || Tenant Dashboard";
    getPropertiesData();
    getTransactionData();
    getData();
  }, []);
  return (
    <Box w="100%" display={"flex"} flexDirection={"column"}>
      <Box shadow="md" style={{ margin: isMobile ? "-44px 0 0" : "15px 80px 50px 80px" }}>
        <Flex m="10px" direction="column">
          <Box shadow={"sm"}>
            <Text fontWeight="600" textAlign="center">
              BOOKING REQUEST
            </Text>
            <TableContainer maxW="100%">
              <Table variant="striped">
                <TableCaption>
                  <Link href="/orderlist">See more...</Link>
                </TableCaption>
                <Thead>
                  <Th textAlign="center">BOOKING ID</Th>
                  <Th textAlign="center">GUEST NAME</Th>
                  <Th textAlign="center">TYPE</Th>
                  <Th textAlign="center">PAYMENT PROOF</Th>
                  <Th textAlign="center">STATUS</Th>
                </Thead>
                <Tbody>
                  {transactionData.map((val, idx)=>{
                    return <Tr key={idx}>
                    <Td textAlign="center">
                      <Link _hover={{ color: "blue", textDecoration: "none" }}>{val.transactionId}</Link>
                    </Td>
                    <Td textAlign="center">{val.guestName}</Td>
                    <Td textAlign="center">{val.name}</Td>
                    <Td textAlign="center">{val.payProofImg ? "See now" : "No proof Yet"}</Td>
                    <Td textAlign="center">{val.status}</Td>
                  </Tr>
                  })}
                  
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Divider orientation="vertical" />
          <Flex mt={2} direction={isMobile ? "column" : "row"}>
            <Box w={isMobile ? "100%" : "50%"}>
              <Flex justifyContent={"center"}>
                <Text fontWeight="600">WEEKLY REPORT</Text>{" "}
              </Flex>
              <Box>
                <Line options={options} plugins={plugins} data={dataset} />
              </Box>
            </Box>
            <Divider orientation="vertical" />
            <Box w={isMobile ? "100%" : "50%"}>
              <Text fontWeight="600" display={"flex"} justifyContent={"center"}>
                YOUR PROPERTIES
              </Text>
              <TableContainer maxW="100%">
                <Table variant="striped">
                  <TableCaption>
                    <Link href="/property">See more...</Link>
                  </TableCaption>
                  <Thead>
                    <Th textAlign="center">NO.</Th>
                    <Th textAlign="center">PROPERTIES NAME</Th>
                    <Th textAlign="center">STATUS</Th>
                  </Thead>
                  <Tbody>
                    {propertyData.map((val, idx) => {
                      if (idx <= 2) {
                        return <Tr key={idx}>
                          <Td textAlign="center">{idx + 1}</Td>
                          <Td textAlign="center">{val.name}</Td>
                          <Td textAlign="center">{!val.isDeleted ? "Active" : "Deactivated"}</Td>
                        </Tr>;
                      }
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default TenantDashboardPage;
