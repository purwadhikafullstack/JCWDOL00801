import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Text,
  Container,
  Box,
  Flex,
  CloseButton,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { MdOutlineDashboard } from "react-icons/md";
import { useState } from "react";
import { VscCircleFilled } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ propW, setAppWidth }) => {
  const { name } = useSelector((state) => {
    return {
      name: state.userReducer.name,
    };
  });
  const navigate = useNavigate();
  const [propertyIsOpen, setPropertyIsOpen] = useState(false);
  const [orderIsOpen, setOrderIsOpen] = useState(false);
  const [reportIsOpen, setReportIsOpen] = useState(false);
  const setPropertyOpenHandler = () => {
    propertyIsOpen ? setPropertyIsOpen(false) : setPropertyIsOpen(true);
  };
  const setOrderOpenHandler = () => {
    orderIsOpen ? setOrderIsOpen(false) : setOrderIsOpen(true);
  };
  const setReportOpenHandler = () => {
    reportIsOpen ? setReportIsOpen(false) : setReportIsOpen(true);
  };
  return (
    <Box
      w={propW}
      shadow="md"
      position="fixed"
      mt="62px"
      top={0}
      left={0}
      zIndex={2}
      overflowX="hidden"
      overFlowY="scroll"
      transition="ease-in-out width .2s"
      style={{ top: 0, bottom: 0 }}
    >
      <Container mt={4} display="flex" alignItems="center" flexDirection="column">
        {/* <Button variant="ghost" colorScheme="green" w="100%" leftIcon={<IoCloseOutline />} onClick={setAppWidth}>Close Sidebar</Button> */}
        {/* <Avatar size="lg" mt={4} /> */}
        <Text color="gray" mt={2} fontWeight="600" fontSize={17} textAlign="center">
          {name.split(" ")[0]}'s <tr />
          Dashboard
        </Text>
        <Divider mt={4} />
        <Button
          fontSize={"17px"}
          variant="ghost"
          color={"gray"}
          colorScheme="green"
          w="100%"
          leftIcon={<MdOutlineDashboard />}
          mt={3}
          onClick={() => navigate("/tenant-dashboard", { replace: true })}
        >
          Dashboard
        </Button>
        <Box className="menu-list" rounded="md" w="100%" onClick={setPropertyOpenHandler}>
          <Text ml={"50px"} fontWeight="600" fontSize={"17px"}>
            Property{" "}
            {propertyIsOpen ? (
              <ChevronDownIcon w="20px" h="20px" ml={3} />
            ) : (
              <ChevronRightIcon w="20px" h="20px" ml={3} />
            )}{" "}
          </Text>
        </Box>
        {propertyIsOpen ? (
          <div>
            <Box rounded="md" h={5} pl={2} pr={2} ml={"40px"} className="menu-list">
              <Text
                fontSize={"13px"}
                fontWeight={"600"}
                color="gray"
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
                onClick={() => navigate("/property", { replace: true })}
              >
                <VscCircleFilled style={{ marginRight: "10px" }} />
                Manage Properties
              </Text>
            </Box>
            <Box
              rounded="md"
              h={5}
              pl={2}
              pr={2}
              mt={1}
              ml={"40px"}
              className="menu-list"
              onClick={() => navigate("/room", { replace: true })}
            >
              <Text
                fontSize={"13px"}
                fontWeight={"600"}
                color="gray"
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
              >
                <VscCircleFilled style={{ marginRight: "10px" }} />
                Manage Rooms
              </Text>
            </Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list">
              <Text
                fontSize={"13px"}
                fontWeight={"600"}
                color="gray"
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
                onClick={() => navigate("/manage-categories", { replace: true })}
              >
                <VscCircleFilled fontSize="13px" style={{ marginRight: "10px" }} />
                Manage Categories
              </Text>
            </Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list">
              <Text
                fontSize={"13px"}
                fontWeight={"600"}
                color="gray"
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
                onClick={() => navigate("/property-list", { replace: true })}
              >
                <VscCircleFilled fontSize="13px" style={{ marginRight: "10px" }} />
                Property List
              </Text>
            </Box>
          </div>
        ) : (
          ""
        )}
        <Box className="menu-list" mt={1} rounded="md" w="100%" onClick={setOrderOpenHandler}>
          <Text ml={"50px"} fontWeight="600" fontSize={"17px"}>
            Order List{" "}
            {orderIsOpen ? (
              <ChevronDownIcon w="20px" h="20px" ml={1} />
            ) : (
              <ChevronRightIcon w="20px" h="20px" ml={1} />
            )}{" "}
          </Text>
        </Box>
        {orderIsOpen ? (
          <div>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"30px"} className="menu-list">
              <Text
                fontSize={"13px"}
                fontWeight={"600"}
                color="gray"
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
                onClick={() => navigate("/orderlist", { replace: true })}
              >
                <VscCircleFilled fontSize="13px" style={{ marginRight: "10px" }} />
                History & Status
              </Text>
            </Box>
          </div>
        ) : (
          ""
        )}
        <Box className="menu-list" mt={1} rounded="md" w="100%" onClick={setReportOpenHandler}>
          <Text ml={"50px"} fontWeight="600" fontSize={"17px"}>
            Report{" "}
            {reportIsOpen ? (
              <ChevronDownIcon w="20px" h="20px" ml={6} />
            ) : (
              <ChevronRightIcon w="20px" h="20px" ml={6} />
            )}{" "}
          </Text>
        </Box>
        {reportIsOpen ? (
          <div>
            <Box rounded="md" h={5} pl={2} pr={"40px"} mt={1} ml={"35px"} className="menu-list">
              <Text
                fontSize={"13px"}
                fontWeight={"600"}
                color="gray"
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
              >
                <VscCircleFilled fontSize="13px" style={{ marginRight: "10px" }} />
                View Reports
              </Text>
            </Box>
          </div>
        ) : (
          ""
        )}
      </Container>
    </Box>
  );
};

export default Sidebar;
