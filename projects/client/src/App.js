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
import ResetPassword from "./pages/ResetPassword";
import InputResetPassword from "./pages/InputResetPassword";
import PropertyDetail from "./pages/PropertyDetail";

function App() {
  const [message, setMessage] = useState("");
  const { email, provider, isVerified, isDeleted, check } = useSelector(
    (state) => {
      return {
        email: state.userReducer.email,
        provider: state.userReducer.provider,
        isVerify: state.userReducer.isVerified,
        isDeleted: state.userReducer.isDeleted,
        check: state.userReducer.check,
      };
    }
  );
  const [loading, setLoading] = useState(true);
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
      console.log(isVerified, provider, isDeleted, email);
    }
  }, []);

  return (
    <div>
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
        <Route path="/signup" element={<SignupPanelPage />} />
        <Route path="/signin" element={<SigninPanelPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route
          path="/user/reset-password/new"
          element={<InputResetPassword />}
        />
        <Route path="/property" element={<PropertyDetail />} />

        <Route path="/*" />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
