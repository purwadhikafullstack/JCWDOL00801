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
import LineChart from "../components/LineChart";
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
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },

    maintainAspectRatio: false,
  };
  const [propertyData, setProperty] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
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
  const getTransactionData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/tenant/transaction",
          {},
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        setTransactionData(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: labels.map(() => faker.datatype.number({ min: -10000000, max: 100000000 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  useEffect(() => {
    document.title = "Renthaven || Tenant Dashboard";
    getPropertiesData();
    getTransactionData();
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
                  <Link>See more...</Link>
                </TableCaption>
                <Thead>
                  <Th textAlign="center">BOOKING ID</Th>
                  <Th textAlign="center">GUEST NAME</Th>
                  <Th textAlign="center">TYPE</Th>
                  <Th textAlign="center">PAYMENT PROOF</Th>
                  <Th textAlign="center">STATUS</Th>
                </Thead>
                <Tbody>
                  {transactionData.map((val, idx) => {
                    return (
                      <Tr>
                        <Td textAlign="center">
                          <Link _hover={{ color: "blue", textDecoration: "none" }}>
                            {val.transactionId}
                          </Link>
                        </Td>
                        <Td textAlign="center">{val.guestName}</Td>
                        <Td textAlign="center">{val.name}</Td>
                        <Td textAlign="center">{val.payProofImg ? "See now" : "No proof Yet"}</Td>
                        <Td textAlign="center">{val.status}</Td>
                      </Tr>
                    );
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
                <Line options={options} data={data} height="200px" />
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
                    <Link>See more...</Link>
                  </TableCaption>
                  <Thead>
                    <Th textAlign="center">NO.</Th>
                    <Th textAlign="center">PROPERTIES NAME</Th>
                    <Th textAlign="center">STATUS</Th>
                  </Thead>
                  <Tbody>
                    {propertyData.map((val, idx) => {
                      if (idx <= 2) {
                        return (
                          <Tr>
                            <Td textAlign="center">{idx + 1}</Td>
                            <Td textAlign="center">{val.name}</Td>
                            <Td textAlign="center">{!val.isDeleted ? "Active" : "Deactivated"}</Td>
                          </Tr>
                        );
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
