import "./App.css";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import SignupPanelPage from "./pages/SignupPanel";
import SigninPanelPage from "./pages/SigninPanel";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { loginAction } from "./actions/userAction";
import { Box, Container, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VerifyChecker from "./privateRoutes/phoneAndOtpRoute";
import VerifyPage from "./pages/VerifyPage";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TenantDashboardPage from "./pages/TenantDashboard";
import TenantHeader from "./components/TenantHeader";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import Property from "./pages/Property";
import { setTenantAction } from "./actions/tenantAction";
import PropertyCreateMenu from "./pages/PropertyCreateMenu";
import AddProperty from "./pages/AddProperty";
import AddPropertyRoom from "./pages/AddPropertyRoom";
import PropertyFormEdit from "./components/PropertyFormEdit";
import ManageCategories from "./pages/ManageCategories";

function App() {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile] = useMediaQuery("(max-width: 760px)");
  const { role, isVerified } = useSelector((state) => {
    return {
      isVerified: state.userReducer.isVerified,
      role: state.userReducer.role,
    };
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const setAppWidth = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  const keepLogin = async () => {
    try {
      let getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        let res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + `/signin/keep-login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        console.log(res.data.result);
        if (res.data.tenant !== undefined) {
          dispatch(setTenantAction(res.data.tenant));
          dispatch(setTenantAction(res.data.tenant.bank));
        }
        dispatch(loginAction(res.data.result));
        localStorage.setItem("renthaven1", res.data.token);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      localStorage.removeItem("renthaven1");
    }
  };
  // const [message, setMessage] = useState("");

  useEffect(() => {
    keepLogin();
    console.log(isOpen);
  }, [isOpen]);

  return (
    <div>
      {loading ? (
        <Flex w={"100vw"} h={"100vh"} justifyContent="center" alignItems="center">
          {" "}
          <Spinner />{" "}
        </Flex>
      ) : role === "tenant" ? (
        //TENANT
        <>
          <TenantHeader loading={loading} isMobile={isMobile} />

          {!isVerified || isMobile ? (
            ""
          ) : (
            <div style={{ display: "flex" }}>
              <Sidebar propW={isOpen ? 230 : 0} setAppWidth={() => setAppWidth()} />
            </div>
          )}
          <div
            style={{
              marginLeft: isOpen && !isMobile && isVerified ? `230px` : "0px",
              marginTop: isMobile ? "50px" : "80px",
              display: "",
              transition: "ease-in-out all .2s",
            }}
            className="sidebar-open-icon"
          >
            {!isVerified || isMobile ? (
              ""
            ) : isOpen ? (
              <div style={{ position: "fixed", marginTop: "20px", marginLeft: "-13px" }}>
                <ChevronLeftIcon
                  _hover={{
                    color: "#38A169",
                    background: "white",
                    cursor: "pointer",
                    border: "solid 1px",
                  }}
                  backgroundColor="#38A169"
                  zIndex={999}
                  color="white"
                  onClick={setAppWidth}
                  border="solid 1px"
                  borderRadius="50%"
                  w={"30px"}
                  h={"30px"}
                  transition="all ease-in-out 0.3s"
                />
              </div>
            ) : (
              <div
                style={{
                  position: "fixed",
                  marginTop: "20px",
                  marginLeft: isOpen ? "-13px" : "10px",
                }}
              >
                <ChevronRightIcon
                  _hover={{
                    color: "#38A169",
                    background: "white",
                    cursor: "pointer",
                    border: "solid 1px",
                  }}
                  background="#38A169"
                  zIndex={999}
                  color="white"
                  border="#48BB78 solid 1px"
                  onClick={setAppWidth}
                  borderRadius="50%"
                  w={"30px"}
                  h={"30px"}
                  transition="all ease-in-out 0.3s"
                />
              </div>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <VerifyChecker loading={loading}>
                    <Landing />
                  </VerifyChecker>
                }
              />
              <Route
                path="/signup"
                element={
                  <VerifyChecker loading={loading}>
                    <SignupPanelPage />
                  </VerifyChecker>
                }
              />
              <Route
                path="/signin"
                element={
                  <VerifyChecker loading={loading}>
                    <SigninPanelPage />
                  </VerifyChecker>
                }
              />
              <Route
                path="/profile"
                element={
                  <VerifyChecker loading={loading}>
                    <Profile />
                  </VerifyChecker>
                }
              />
              <Route
                path="/verify"
                element={
                  <VerifyChecker loading={loading}>
                    <VerifyPage />
                  </VerifyChecker>
                }
              />
              <Route
                path="/tenant-dashboard"
                element={
                  <VerifyChecker loading={loading}>
                    <TenantDashboardPage isMobile={isMobile} />
                  </VerifyChecker>
                }
              />
              <Route
                path="/property"
                element={
                  <VerifyChecker loading={loading}>
                    <Property />
                  </VerifyChecker>
                }
              />
              <Route
                path="/property/new"
                element={
                  <VerifyChecker loading={loading}>
                    <PropertyCreateMenu />
                  </VerifyChecker>
                }
              />
              <Route
                path="/property/new/building"
                element={
                  <VerifyChecker loading={loading}>
                    <AddProperty />
                  </VerifyChecker>
                }
              />
              <Route
                path="/property/new/building-room"
                element={
                  <VerifyChecker loading={loading}>
                    <AddPropertyRoom />
                  </VerifyChecker>
                }
              />
              <Route
                path="/property/edit"
                element={
                  <VerifyChecker loading={loading}>
                    <PropertyFormEdit />
                  </VerifyChecker>
                }
              />
              <Route path="/manage-categories" element={<ManageCategories />} />
              <Route path="/*" />
            </Routes>
          </div>
        </>
      ) : (
        //USER
        <>
          <Header loading={loading} />
          <Routes>
            <Route
              path="/"
              element={
                <VerifyChecker loading={loading}>
                  <Landing />
                </VerifyChecker>
              }
            />
            <Route
              path="/signup"
              element={
                <VerifyChecker loading={loading}>
                  <SignupPanelPage />
                </VerifyChecker>
              }
            />
            <Route
              path="/signin"
              element={
                <VerifyChecker loading={loading}>
                  <SigninPanelPage />
                </VerifyChecker>
              }
            />
            <Route
              path="/profile"
              element={
                <VerifyChecker loading={loading}>
                  <Profile />
                </VerifyChecker>
              }
            />
            <Route
              path="/verify"
              element={
                <VerifyChecker loading={loading}>
                  <VerifyPage />
                </VerifyChecker>
              }
            />
            <Route
              path="/tenant-dashboard"
              element={
                <VerifyChecker loading={loading}>
                  <TenantDashboardPage />
                </VerifyChecker>
              }
            />
            <Route path="/*" />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
