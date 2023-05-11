import { Heading, Box, Flex, Text, Button, Input, Divider } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { addDays, eachDayOfInterval, format, isSameDay, setDate, subDays } from "date-fns";
import { Select as Select2 } from "chakra-react-select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  SubTitle,
} from "chart.js";
import CalendarChartStart from "./CalendarChartStart";
import CalendarChartEnd from "./CalendarChartEnd";
import { clearChartDate } from "../actions/dateAction";

function LineChart(props) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    SubTitle
  );
  const dispatch = useDispatch();
  const { tenantId, chartStartDate, chartEndDate } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
      chartStartDate: state.dateReducer.chartStartDate,
      chartEndDate: state.dateReducer.chartEndDate,
    };
  });
  const [data, setData] = React.useState(null);
  const [sortByIncome, setSortByIncome] = React.useState(false);
  const [sortByDate, setSortByDate] = React.useState(false);
  const [dataType, setDataType] = React.useState("transaction");
  const [propData, setPropData] = React.useState(null);
  const [propId, setPropId] = React.useState(0);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [userList, setUserList] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState("");

  const getPropData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.get(
          process.env.REACT_APP_API_BASE_URL + "/rooms/prop-availability",
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        if (res.data.result.length > 0) {
          const optionData = res.data.result.map((val, idx) => {
            return { value: val.propertyId, label: val.name };
          });
          setPropData(optionData);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.get(process.env.REACT_APP_API_BASE_URL + "/orderlist/user", {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        });
        if (res.data.result.length > 0) {
          const optionData = res.data.result.map((val, idx) => {
            return { value: val.userId, label: val.name };
          });
          setUserList(optionData);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    let url = `/orderlist/chart?tenant=${tenantId}&type=${dataType}`;
    let query = "";
    if (propId) {
      query += `&property=${propId}`;
    }
    if (selectedUser) {
      query += `&user=${selectedUser}`;
    }
    if (startDate) {
      query += `&startDate=${startDate}`;
    }
    if (endDate) {
      query += `&endDate=${endDate}`;
    }
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + url + query);
      let chart = null;
      if (response.data.data.length === 0) {
        setData([]);
        return;
      }
      if (dataType === "property" && propId) {
        if (startDate || endDate) {
          let rangeStart = subDays(new Date(endDate), 30);
          let rangeEnd = addDays(new Date(startDate), 30);
          if (startDate) {
            rangeStart = new Date(startDate);
          }
          if (endDate) {
            rangeEnd = new Date(endDate);
          }

          let dates = {
            start: rangeStart,
            end: rangeEnd,
          };
          chart = eachDayOfInterval(dates).map((date, idx) => {
            const roomTotal = response.data.data[0].roomProp.reduce((acc, room) => {
              let total = room.order.reduce((acc, val) => {
                if (isSameDay(date, new Date(val.createdAt))) {
                  return acc + parseInt(val.price);
                } else {
                  return acc;
                }
              }, 0);
              return acc + total;
            }, 0);
            return { x: format(date, "d MMM yy"), y: roomTotal, month: idx };
          });
        } else {
          let startDate = setDate(new Date(), 1);
          let endDate = addDays(startDate, 30);
          let dates = {
            start: startDate,
            end: endDate,
          };
          chart = eachDayOfInterval(dates).map((date, idx) => {
            const roomTotal = response.data.data[0].roomProp.reduce((acc, room) => {
              let total = room.order.reduce((acc, val) => {
                if (isSameDay(date, new Date(val.createdAt))) {
                  return acc + parseInt(val.price);
                } else {
                  return acc;
                }
              }, 0);
              return acc + total;
            }, 0);
            return { x: format(date, "d MMM yy"), y: roomTotal, month: idx };
          });
        }
      } else if (dataType === "transaction") {
        if (startDate || endDate) {
          let rangeStart = subDays(new Date(endDate), 30);
          let rangeEnd = addDays(new Date(startDate), 30);
          if (startDate) {
            rangeStart = new Date(startDate);
          }
          if (endDate) {
            rangeEnd = new Date(endDate);
          }

          let dates = {
            start: rangeStart,
            end: rangeEnd,
          };
          chart = eachDayOfInterval(dates).map((date, idx) => {
            const total = response.data.data.reduce((acc, val) => {
              if (isSameDay(date, new Date(val.createdAt))) {
                return acc + parseInt(val.price);
              } else {
                return acc;
              }
            }, 0);
            return {
              x: format(date, "d MMM yy"),
              y: total,
              month: idx,
            };
          });
        } else {
          let startDate = setDate(new Date(), 1);
          let endDate = addDays(startDate, 30);
          let dates = {
            start: startDate,
            end: endDate,
          };
          chart = eachDayOfInterval(dates).map((date, idx) => {
            const total = response.data.data.reduce((acc, val) => {
              if (isSameDay(date, new Date(val.createdAt))) {
                return acc + parseInt(val.price);
              } else {
                return acc;
              }
            }, 0);
            return { x: format(date, "d MMM yy"), y: total, month: idx };
          });
        }
      } else if (dataType === "user" && selectedUser) {
        if (startDate || endDate) {
          let rangeStart = subDays(new Date(endDate), 30);
          let rangeEnd = addDays(new Date(startDate), 30);
          if (startDate) {
            rangeStart = new Date(startDate);
          }
          if (endDate) {
            rangeEnd = new Date(endDate);
          }

          let dates = {
            start: rangeStart,
            end: rangeEnd,
          };
          chart = eachDayOfInterval(dates).map((date, idx) => {
            const total = response.data.data.reduce((acc, val) => {
              if (isSameDay(date, new Date(val.createdAt))) {
                return acc + parseInt(val.price);
              } else {
                return acc;
              }
            }, 0);
            return {
              x: format(date, "d MMM yy"),
              y: total,
              month: idx,
            };
          });
        } else {
          let startDate = setDate(new Date(), 1);
          let endDate = addDays(startDate, 30);
          let dates = {
            start: startDate,
            end: endDate,
          };
          chart = eachDayOfInterval(dates).map((date, idx) => {
            const total = response.data.data.reduce((acc, val) => {
              if (isSameDay(date, new Date(val.createdAt))) {
                return acc + parseInt(val.price);
              } else {
                return acc;
              }
            }, 0);
            return { x: format(date, "d MMM yy"), y: total, month: idx };
          });
        }
      }

      setTotalIncome(
        chart.reduce((acc, val) => {
          return acc + parseInt(val.y);
        }, 0)
      );

      if (sortByIncome) {
        setData(chart.sort((a, b) => b.y - a.y));
      } else {
        setData(chart);
      }
      if (sortByDate) {
        setData(chart.sort((a, b) => b.month - a.month));
      } else {
        setData(chart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dataset = {
    datasets: [
      {
        label: "Income",
        data: data,
        borderColor: "rgb(72, 187, 120)",
        backgroundColor: "rgba(72, 187, 120, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
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

  //crosshair plugin
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
  // end of crosshair plugin

  // no data plugin
  const noData = {
    id: "noData",
    afterDatasetsDraw: (chart, args, plugins) => {
      const {
        ctx,
        data,
        chartArea: { top, left, width, height },
      } = chart;
      ctx.save();

      if (data.datasets[0].data.length === 0) {
        ctx.fillStyle = "#EDF2F7";
        ctx.fillRect(left, top, width, height);

        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#1A202C";
        ctx.textAlign = "center";
        ctx.fillText("No Data Available", left + width / 2, top + height / 2);
      }
    },
  };

  const plugins = [crosshairLabel, noData];

  const handleSort = (val) => {
    if (val === "income") {
      setSortByDate(false);
      setSortByIncome(!sortByIncome);
    }
    if (val === "date") {
      setSortByIncome(false);
      setSortByDate(!sortByDate);
    }
  };

  const handleSelectType = (e, action) => {
    if (action.action === "clear") {
      setDataType("transaction");
      setPropId("");
      onBtnReset();
      return;
    }
    setDataType(e.value);
  };

  const handleSelectProp = (e, action) => {
    if (action.action === "clear") {
      setPropId("");
      onBtnReset();
      return;
    }
    setPropId(e.value);
  };

  const handleSelectUser = (e, action) => {
    if (action.action === "clear") {
      setSelectedUser("");
      onBtnReset();
      return;
    }
    setSelectedUser(e.value);
  };

  const onBtnFilter = (e) => {
    e.preventDefault();
    setStartDate(chartStartDate);
    setEndDate(chartEndDate);
  };

  const onBtnReset = () => {
    dispatch(clearChartDate());
    setStartDate("");
    setEndDate("");
    setSortByDate(false);
    setSortByIncome(false);
    setDataType("transaction");
  };

  useEffect(() => {
    getData();
  }, [sortByIncome, sortByDate, dataType, propId, startDate, endDate, selectedUser]);

  useEffect(() => {
    getPropData();
    getUserData();
  }, []);

  return (
    <Box border="1px" width={"100%"} p={5} borderRadius={5} borderColor={"#ccc"}>
      <Heading mb={3} size={"sm"}>
        Income Report
      </Heading>
      <Flex direction={"column"} gap={1}>
        <Select2
          isSearchable
          isClearable
          options={[
            {
              value: "transaction",
              label: "Total Transaction",
            },
            {
              value: "property",
              label: "Property",
            },
            {
              value: "user",
              label: "User",
            },
          ]}
          onChange={(e, action) => handleSelectType(e, action)}
          placeholder="Choose Type"
        ></Select2>
        <Text fontSize={"xs"} color={"gray.500"}>
          Default is by Total Transaction
        </Text>
        {dataType === "property" ? (
          <Select2
            isSearchable
            isClearable
            options={propData}
            onChange={(e, action) => handleSelectProp(e, action)}
            placeholder="Choose Property"
          ></Select2>
        ) : dataType === "user" ? (
          <Select2
            isSearchable
            isClearable
            options={userList}
            onChange={(e, action) => handleSelectUser(e, action)}
            placeholder="Choose User"
          ></Select2>
        ) : null}
      </Flex>
      <Flex mb={1} mt={3} gap={3} direction={{ base: "column", md: "row" }}>
        <CalendarChartStart />
        <CalendarChartEnd />
        <Button colorScheme="green" onClick={onBtnFilter}>
          Filter
        </Button>
        <Button colorScheme="green" onClick={onBtnReset}>
          Reset
        </Button>
      </Flex>
      <Text fontSize={"xs"} color={"gray.500"}>
        Max range is 30 days
      </Text>
      <Flex mt={3} gap={3} align={"center"}>
        <Text>Sort by:</Text>
        <Button colorScheme="green" variant={"link"} onClick={() => handleSort("income")}>
          Total Income
        </Button>
        <Button colorScheme="green" variant={"link"} onClick={() => handleSort("date")}>
          Date
        </Button>
      </Flex>
      <Divider mt={3} mb={2} />
      <Flex justify={"center"} width={"100%"} height={"400px"}>
        <Line options={options} plugins={plugins} data={dataset} />
      </Flex>
    </Box>
  );
}

export default LineChart;
