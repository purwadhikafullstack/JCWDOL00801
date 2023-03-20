import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import SignupPanelPage from "./pages/SignupPanel";
import SigninPanelPage from "./pages/SigninPanel";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { loginAction } from "./actions/userAction";
import { Spinner } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VerifyChecker from "./privateRoutes/phoneAndOtpRoute";
import VerifyPage from "./pages/VerifyPage";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TenantDashboardPage from "./pages/TenantDashboard";
import {
  Flexboard,
  FlexboardProvider,
  FlexboardFrame,
  ResizerType,
  Position,
} from "@dorbus/flexboard";
import Property from "./pages/Property";
import PropertyDetail from "./pages/PropertyDetail";

function App() {
  const [message, setMessage] = useState("");

  const { email, provider, isVerified, isDeleted, check } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      provider: state.userReducer.provider,
      isVerify: state.userReducer.isVerified,
      isDeleted: state.userReducer.isDeleted,
      check: state.userReducer.check,
    };
  });
  const [loading, setLoading] = useState(true);
  const currentPath = window.location.pathname;
  const dispatch = useDispatch();

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
    {
      console.log(window.innerWidth);
      console.log(isVerified, provider, isDeleted, email);
    }
  }, [window.innerWidth]);

  return (
    <div>
      <Header loading={loading} />

      {/* <FlexboardProvider>
            <Flexboard
            direction={Position.left}
            draggable={true}
            width={400}
            minWidth={50}
            maxWidth={300}
            flexboardStyle={{ backgroundColor: "#f2f3f4" }}
            resizerStyle={{ backgroundColor: "#ccc", width: "2px" }}
            resizerType={ResizerType.gutterlane}
            >
                <div>Flexboard Content</div>
            </Flexboard> */}
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
        <Route path="/tenant-dashboard" element={<TenantDashboardPage />} />
        <Route path="/property" element={<Property />} />
        <Route path="/*" />
      </Routes>
      {/* </FlexboardProvider> */}
      <Footer />
    </div>
  );
}

export default App;
