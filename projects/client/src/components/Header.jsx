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
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../actions/userAction";
import { tenantLogout } from "../actions/tenantAction";
import { clearAllDate, clearAllDateBook } from "../actions/dateAction";

const Links = ["Home", "My Profile", "My Orders"];

function Header(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { email, name, profileImg } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      name: state.userReducer.name,
      profileImg: state.userReducer.profileImg,
    };
  });
  const logoutHandler = () => {
    dispatch(logoutAction());
    dispatch(tenantLogout());
    localStorage.removeItem("renthaven1");
    navigate("/signin", { replace: true });
    window.location.reload();
    window.scrollTo(0, 0);
  };
  return (
    <Box shadow="sm" >
      <Container p={0} maxW={{ md: "container.xl" }}>
        <Box px={4}>
          <Flex h={16} alignItems={"center"} justifyContent="space-between">
            <HStack spacing={8} alignItems={"center"}>
              <HStack
                _hover={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  clearAllDate();
                  clearAllDateBook();
                  navigate("/", { replace: true });
                  navigate(0);
                  window.scrollTo(0, 0);
                }}
              >
                <Image boxSize="70px" src={logo} />
                <Heading size="md">Renthaven</Heading>
              </HStack>
              <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                <Link
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: "gray.200",
                  }}
                  href="/"
                >
                  Home
                </Link>
              </HStack>
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
                        src={process.env.REACT_APP_BASE_IMG_URL + profileImg}
                      />
                      <Heading size="xs" textTransform="capitalize">
                        {name.split(" ")[0]}
                      </Heading>
                    </HStack>
                  </MenuButton>
                  <MenuList zIndex="dropdown">
                    <MenuItem
                      onClick={() => {
                        navigate("/profile", { replace: true });
                        window.scrollTo(0, 0);
                      }}
                    >
                      My Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/my-orders", { replace: true });
                        window.scrollTo(0, 0);
                      }}
                    >
                      My Orders
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
                    onClick={() => {
                      navigate("/signin", { replace: true });
                      window.scrollTo(0, 0);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    display={{ base: "none", md: "inline-flex" }}
                    colorScheme="green"
                    onClick={() => {
                      navigate("/signup", { replace: true });
                      window.scrollTo(0, 0);
                    }}
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
                <Link
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: "gray.200",
                  }}
                  href="/"
                >
                  Home
                </Link>
                <Flex justify="space-between" gap={3}>
                  <Button
                    minW="50%"
                    variant="outline"
                    colorScheme="green"
                    onClick={() => {
                      navigate("/signin", { replace: true });
                      window.scrollTo(0, 0);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    minW="50%"
                    variant="solid"
                    colorScheme="green"
                    onClick={() => {
                      navigate("/signup", { replace: true });
                      window.scrollTo(0, 0);
                    }}
                  >
                    Register
                  </Button>
                </Flex>
              </Stack>
            </Box>
          ) : null}
          {isOpen && email ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                <HStack
                  spacing={7}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/profile", { replace: true });
                    window.scrollTo(0, 0);
                  }}
                >
                  <Avatar
                    bg="green.500"
                    size={"lg"}
                    src={process.env.REACT_APP_BASE_IMG_URL + profileImg}
                  />
                  <Heading size="md" textTransform="capitalize">
                    {name.split(" ")[0]}
                  </Heading>
                </HStack>
                {Links.map((link) => (
                  <Link
                    px={2}
                    py={1}
                    rounded={"md"}
                    _hover={{
                      textDecoration: "none",
                      bg: "gray.200",
                    }}
                    href={
                      link === "Home"
                        ? "/"
                        : link === "My Profile"
                        ? "/profile"
                        : link === "My Orders"
                        ? "/my-orders"
                        : "/"
                    }
                    key={link}
                  >
                    {link}
                  </Link>
                ))}
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

export default Header;
