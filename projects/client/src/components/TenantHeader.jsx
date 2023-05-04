import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
  Image,
  Heading,
  Container,
  Divider,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../actions/userAction";
import { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { VscCircleFilled } from "react-icons/vsc";
import { tenantLogout } from "../actions/tenantAction";

const Links = ["Home", "Contact"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: "gray.200",
    }}
    href={"/"}
  >
    {children}
  </Link>
);

function TenantHeader(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { email, name, profileImg, role } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      name: state.userReducer.name,
      profileImg: state.userReducer.profileImg,
      role: state.userReducer.role,
    };
  });
  const logoutHandler = () => {
    dispatch(logoutAction());
    dispatch(tenantLogout());
    localStorage.removeItem("renthaven1");
    navigate("/signin", { replace: true });
    window.location.reload();
  };
  useEffect(() => {}, [email]);
  return (
    //CLONE CODE DANIEL
    <Box
      w="100%"
      shadow="sm"
      backgroundColor="white"
      zIndex={1}
      position={props.isMobile ? "unset" : "fixed"}
    >
      <Container maxW={role === "tenant" ? "100%" : "container.lg"}>
        <Box px={4}>
          <Flex h={16} alignItems={"center"} justifyContent="space-between">
            <HStack spacing={8} alignItems={"center"}>
              <HStack
                _hover={{
                  cursor: "pointer",
                }}
                onClick={() => navigate("/tenant-dashboard", { replace: true })}
              >
                <Image boxSize="70px" src={logo} />
                <Heading size="md">Renthaven</Heading>
              </HStack>
              {/* <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </HStack> */}
            </HStack>
            {/* ini tampilan kalau sudah login */}
            {props.loading === true ? (
              <Spinner />
            ) : email ? (
              <Flex>
                {" "}
                <Menu>
                  <MenuButton
                    as={Button}
                    display={{ base: "none", md: "inline-flex" }}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <HStack>
                      <Avatar
                        bg="green.500"
                        size={"sm"}
                        src={process.env.REACT_APP_API_BASE_IMG_URL + profileImg}
                      />
                      <Heading size="xs" textTransform="capitalize">
                        {name.split(" ")[0]}
                      </Heading>
                    </HStack>
                  </MenuButton>
                  <MenuList zIndex="dropdown">
                    <MenuItem onClick={() => navigate("/profile", { replace: true })}>
                      My Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </MenuList>
                </Menu>{" "}
                <IconButton
                  size={"md"}
                  icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                  aria-label={"Open Menu"}
                  display={{ md: "none" }}
                  onClick={isOpen ? onClose : onOpen}
                />
              </Flex>
            ) : (
              <>
                <Flex alignItems={"center"} gap={6}>
                  {/* ini tampilan kalau belum login */}
                  <Button
                    display={{ base: "none", md: "inline-flex" }}
                    fontSize={"md"}
                    fontWeight={500}
                    variant={"link"}
                    colorScheme="gray"
                    onClick={() => navigate("/signin", { replace: true })}
                  >
                    Sign In
                  </Button>
                  <Button
                    display={{ base: "none", md: "inline-flex" }}
                    colorScheme="green"
                    onClick={() => navigate("/signup", { replace: true })}
                  >
                    Register
                  </Button>

                  <IconButton
                    size={"md"}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={"Open Menu"}
                    display={{ md: "none" }}
                    onClick={isOpen ? onClose : onOpen}
                  />
                </Flex>
              </>
            )}
          </Flex>

          {isOpen && !email ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
                <Flex justify="space-between" gap={3}>
                  <Button
                    minW="50%"
                    variant="outline"
                    colorScheme="green"
                    onClick={() => navigate("/signin", { replace: true })}
                  >
                    Sign In
                  </Button>
                  <Button
                    minW="50%"
                    variant="solid"
                    colorScheme="green"
                    onClick={() => navigate("/signup", { replace: true })}
                  >
                    Register
                  </Button>
                </Flex>
              </Stack>
            </Box>
          ) : null}
          {isOpen && email ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack>
                <HStack
                  w="100%"
                  display={"flex"}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{ cursor: "pointer" }}
                  onClick={() => navigate("/profile", { replace: true })}
                >
                  <Avatar
                    bg="green.500"
                    size={"xl"}
                    src={process.env.REACT_APP_API_BASE_IMG_URL + `${profileImg}`}
                  />
                  <Heading size="md" textTransform="capitalize" style={{ marginLeft: "0px" }}>
                    {name.split(" ")[0]}
                  </Heading>
                </HStack>
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
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  className="menu-list"
                  rounded="md"
                  w="100%"
                  onClick={setPropertyOpenHandler}
                >
                  <Text fontWeight="600" fontSize={"17px"}>
                    Property{" "}
                    {propertyIsOpen ? (
                      <ChevronDownIcon w="20px" h="20px" ml={3} />
                    ) : (
                      <ChevronRightIcon w="20px" h="20px" ml={3} />
                    )}{" "}
                  </Text>
                </Box>
                {propertyIsOpen ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      w="100%"
                      rounded="md"
                      h={5}
                      pl={2}
                      pr={2}
                      className="menu-list"
                      onClick={() => navigate("/property", { replace: true })}
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        Manage Properties
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      w="100%"
                      rounded="md"
                      h={5}
                      pl={2}
                      pr={2}
                      mt={1}
                      className="menu-list"
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                        onClick={() => navigate("/room", { replace: true })}
                      >
                        Manage Rooms
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      w="100%"
                      rounded="md"
                      h={5}
                      pl={2}
                      pr={2}
                      mt={1}
                      className="menu-list"
                      onClick={() => navigate("/manage-categories", { replace: true })}
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        Manage Categories
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      w="100%"
                      rounded="md"
                      h={5}
                      pl={2}
                      pr={2}
                      mt={1}
                      className="menu-list"
                      onClick={() => navigate("/property-list", { replace: true })}
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        Property List
                      </Text>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
                <Box
                  className="menu-list"
                  mt={1}
                  rounded="md"
                  w="100%"
                  onClick={setOrderOpenHandler}
                  justifyContent={"center"}
                  display={"flex"}
                >
                  <Text fontWeight="600" fontSize={"17px"}>
                    Order List{" "}
                    {orderIsOpen ? (
                      <ChevronDownIcon w="20px" h="20px" ml={1} />
                    ) : (
                      <ChevronRightIcon w="20px" h="20px" ml={1} />
                    )}{" "}
                  </Text>
                </Box>
                {orderIsOpen ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      w="100%"
                      rounded="md"
                      h={5}
                      pl={2}
                      pr={2}
                      mt={1}
                      className="menu-list"
                      onClick={() => navigate("/orderlist", { replace: true })}
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        History & Status
                      </Text>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
                <Box
                  display={"flex"}
                  className="menu-list"
                  mt={1}
                  rounded="md"
                  w="100%"
                  onClick={setReportOpenHandler}
                  justifyContent={"center"}
                >
                  <Text fontWeight="600" fontSize={"17px"}>
                    Report{" "}
                    {reportIsOpen ? (
                      <ChevronDownIcon w="20px" h="20px" ml={6} />
                    ) : (
                      <ChevronRightIcon w="20px" h="20px" ml={6} />
                    )}{" "}
                  </Text>
                </Box>
                {reportIsOpen ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      w="100%"
                      rounded="md"
                      h={5}
                      pl={2}
                      pr={"40px"}
                      mt={1}
                      className="menu-list"
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        View Reports
                      </Text>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
                <Flex justify="space-between" gap={3}>
                  <Button minW="100%" variant="outline" colorScheme="green" onClick={logoutHandler}>
                    Logout
                  </Button>
                </Flex>
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Container>
      <Divider />
    </Box>
  );
}

export default TenantHeader;
