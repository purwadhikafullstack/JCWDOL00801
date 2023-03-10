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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../actions/userAction";
import { useEffect } from "react";

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

function Header(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { email, name } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      name: state.userReducer.name,
    };
  });
  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("renthaven1");
    navigate("/signin", { replace: true });
    window.location.reload();
  };
  useEffect(() => {}, [email]);
  return (
    <Box shadow="sm">
      <Container maxW="container.xl">
        <Box px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8} alignItems={"center"}>
              <HStack
                _hover={{
                  cursor: "pointer",
                }}
                onClick={() => navigate("/", { replace: true })}
              >
                <Image boxSize="70px" src={logo} />
                <Heading size="md">Renthaven</Heading>
              </HStack>
              <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
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
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <HStack>
                      <Avatar
                        size={"sm"}
                        src={
                          "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                        }
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
                    <MenuItem>My Orders</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </MenuList>
                </Menu>{" "}
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

          {isOpen ? (
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
        </Box>
      </Container>
      <Divider />
    </Box>
  );
}

export default Header;
