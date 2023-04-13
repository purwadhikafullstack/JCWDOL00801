import "./App.css";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import SignupPanelPage from "./pages/SignupPanel";
import SigninPanelPage from "./pages/SigninPanel";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { loginAction } from "./actions/userAction";
import { Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VerifyChecker from "./privateRoutes/phoneAndOtpRoute";
import VerifyPage from "./pages/VerifyPage";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TenantDashboardPage from "./pages/TenantDashboard";
import TenantHeader from "./components/TenantHeader";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import NotFoundPage from "./pages/NotFound";
import BookingDetail from "./components/BookingDetail";
import GuestBookingForm from "./components/GuestBookingForm";
import SpecialReq from "./components/SpecialReqForm";
import PaymentMethod from "./components/PaymentMethod";
import PaymentDetail from "./components/PaymentDetail";
import PropertyDetail from "./pages/PropertyDetail";
import { clearAllDate } from "./actions/dateAction";
import PaymentProofPage from "./pages/PaymentProof";
import Property from "./pages/Property";
import { setTenantAction } from "./actions/tenantAction";
import PropertyCreateMenu from "./pages/PropertyCreateMenu";
import AddProperty from "./pages/AddProperty";
import AddPropertyRoom from "./pages/AddPropertyRoom";
import PropertyFormEdit from "./components/PropertyFormEdit";
import ManageCategories from "./pages/ManageCategories";
import OrderHistory from "./pages/OrderHistory";
import RoomList from "./components/RoomList";
import RoomListPage from "./pages/Room";
import RoomCreateMenu from "./pages/RoomCreateMenu";
import RoomForm from "./components/RoomForm";
import RoomFormEdit from "./components/RoomFormEdit";
import RoomPhoto from "./components/RoomPhoto";
import UserOrder from "./pages/UserOrder";
import SearchProperty from "./components/SearchPropertyCard";
import SearchCard from "./components/SearchCard";
import SearchPage from "./pages/SearchPage";

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
        if (res.data.tenant) {
          dispatch(setTenantAction(res.data.tenant));
          dispatch(setTenantAction(res.data.bank));
        }
        dispatch(loginAction(res.data.user));
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

  useEffect(() => {
    keepLogin();
    if (window.location.pathname != "/payment") {
      dispatch(clearAllDate());
    }
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

          {isMobile ? (
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
              <Route path="/orderlist" element={<OrderHistory />} />
              <Route path="/room" element={<RoomListPage />} />
              <Route path="/room/edit" element={<RoomFormEdit />} />
              <Route path="/room/new" element={<RoomCreateMenu />} />
              <Route path="/room/new/type" element={<RoomForm />} />
              <Route path="/room/photos" element={<RoomPhoto />} />
              <Route path="/*" />
            </Routes>
          </div>
        </>
      ) : //USER
      loading ? (
        <Flex w={"100vw"} h={"100vh"} justifyContent="center" alignItems="center">
          {" "}
          <Spinner />{" "}
        </Flex>
      ) : (
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
            {/* <Route
              path="/tenant-dashboard"
              element={
                <VerifyChecker loading={loading}>
                  <TenantDashboardPage />
                </VerifyChecker>
              }
            /> */}
            <Route path="/*" element={<NotFoundPage />} />
            <Route path="/detail" element={<PropertyDetail />} isMobile={isMobile} />
            <Route path="/payment" element={<PaymentDetail />} isMobile={isMobile} />
            <Route path="/payment-proof" element={<PaymentProofPage />} isMobile={isMobile} />
            <Route path="/my-orders" element={<UserOrder />} isMobile={isMobile} />
            <Route path="/search" element={<SearchPage />} isMobile={isMobile} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
