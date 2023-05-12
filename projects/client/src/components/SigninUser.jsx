import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  ScaleFade,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { CiFacebook } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useFormik } from "formik";
import "../styles/login.css";
import { useEffect, useState } from "react";
import { auth, provider, providerFacebook } from "../config/firebase";
import { signInWithPopup, getAuth, deleteUser } from "firebase/auth";
import { loginSchema } from "../schemas/signinValidator";
import Axios from "axios";
import { loginAction } from "../actions/userAction";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

const SigninUserPage = (props) => {
  const navigate = useNavigate();
  const [alerts, setAlert] = useState("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useDispatch();
  const handleLoginGoogle = () => {
    setGoogleLoading(true);
    signInWithPopup(auth, provider)
      .then((data) => {
        Axios.post(process.env.REACT_APP_API_BASE_URL + "/signin", {
          login: data._tokenResponse.providerId,
          email: data._tokenResponse.email,
        }).then((res) => {
          if (res.data.success == true) {
            localStorage.setItem("renthaven1", res.data.token);
            loginAction(res.data.user);
            navigate(0)
            navigate("/", { replace: true });
            setGoogleLoading(false);
          } else if (res.data.success == false) {
            const authenticate = getAuth();
            const user = authenticate.currentUser;
            deleteUser(user).then(() => {
              setAlert(
                <p>
                  The account has not been registered, please register{" "}
                  <Link className="link" to="/signup">
                    here
                  </Link>
                </p>
              );
              onToggle();
              setGoogleLoading(false);
            });
          }
          setGoogleLoading(false);
        });
      })
      .catch((e) => {
        if(e.code === "auth/popup-closed-by-user"){
          setGoogleLoading(false)
        }else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
          setAlert("You registered the account with different method.")
          setGoogleLoading(false);
        }else if(e.response){
          setAlert(`${e.response.data.message}`)
          setGoogleLoading(false);
        }
        setGoogleLoading(false)
      });
  };
  const handleLoginFacebook = () => {
    setFacebookLoading(true);
    signInWithPopup(auth, providerFacebook)
      .then((data) => {
        Axios.post(process.env.REACT_APP_API_BASE_URL + "/signin", {
          login: data._tokenResponse.providerId,
          email: data._tokenResponse.email,
        }).then((res) => {
          if (res.data.success == true) {
            localStorage.setItem("renthaven1", res.data.token);
            loginAction(res.data.user);
            navigate(0)
            navigate("/", { replace: true });
            setFacebookLoading(false);
          } else if (res.data.success == false) {
            const authenticate = getAuth();
            const user = authenticate.currentUser;
            deleteUser(user).then(() => {
              setAlert(
                <p>
                  The account has not been registered, please register{" "}
                  <Link className="link" to="/signup">
                    here
                  </Link>
                </p>
              );
              onToggle();
              setFacebookLoading(false);
            });
          }
          setFacebookLoading(false);
        });
      })
      .catch((e) => {
        if(e.code === "auth/popup-closed-by-user"){
          setGoogleLoading(false)
        }else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
          setAlert("You registered the account with different method.")
          setFacebookLoading(false);
        }else if(e.response){
          setAlert(`${e.response.data.message}`)
          setGoogleLoading(false);
        }
        setGoogleLoading(false)
      });
  };
  const handleEmailLogin = () => {
    setLoginLoading(true);
    Axios.post(process.env.REACT_APP_API_BASE_URL + "/signin", {
      login: "common",
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        if (res.data.success == true) {
          localStorage.setItem("renthaven1", res.data.token);
          loginAction(res.data.user);
          navigate(0)
          navigate("/", { replace: true });
          setLoginLoading(false);
        } else if (res.data.success == false) {
          setAlert(
            <p>
              Incorrect password or the account has not been registered, please register{" "}
              <Link className="link" to="/signup">
                here
              </Link>
            </p>
          );
          onToggle();
          setLoginLoading(false);
        }
        setLoginLoading(false);
      })
      .catch((e) => {
        console.log(e)
        setAlert(`${e.response.data.message}`)
        setLoginLoading(false)});
  };
  const { errors, values, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: handleEmailLogin,
  });
  useEffect(() => {
    document.title = "RentHaven || Signin";
  }, [alerts]);
  return (
    <div>
      <Box>
        <Box
          rounded="md"
          style={{
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              textAlign: "left",
              margin: "0px 30px 0",
              paddingTop: "25px",
            }}
          >
            {alerts == "" ? (
              ""
            ) : (
                <Alert status="error" style={{ marginBottom: "20px" }}>
                  <AlertIcon />
                  {alerts}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <p>
                Email <span style={{ color: "red" }}>*</span>
              </p>
              <Input
                isInvalid={errors.email && touched.email ? true : false}
                id="email"
                onKeyPress={event => (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122)}
                value={values.email}
                style={{ marginTop: "5px" }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? (
                <p style={{ color: "red", marginBottom: "5px" }}>{errors.email}</p>
              ) : (
                ""
              )}
              <p style={{ marginTop: "10px" }}>
                Password <span style={{ color: "red" }}>*</span>
              </p>
              <InputGroup size="md" style={{ marginTop: "5px" }}>
                <Input
                  isInvalid={errors.password && touched.password ? true : false}
                  id="password"
                  value={values.password}
                  type={show ? "text" : "password"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InputRightElement width="3.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.password && touched.password ? (
                <p style={{ color: "red", marginBottom: "5px" }}>{errors.password}</p>
              ) : (
                ""
              )}
              <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <Link
                  className="link"
                  style={{
                    marginTop: "4px",
                    fontWeight: "600",
                  }}
                  to="/user/reset-password"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                isLoading={loginLoading}
                variant="solid"
                colorScheme="green"
                style={{
                  width: "100%",
                  marginTop: "15px",
                  marginBottom: "10px",
                }}
                type="submit"
              >
                Sign in
              </Button>
            </form>
            <p
              style={{
                width: "100%",
                textAlign: "center",
                borderBottom: "1px solid #000",
                lineHeight: "0.1em",
                margin: "10px 0 20px",
              }}
            >
              <span style={{ background: "#fff", padding: "0 10px" }}>OR</span>
            </p>
            <Button
              isLoading={googleLoading}
              leftIcon={<FcGoogle />}
              style={{ width: "100%", marginTop: "5px", marginBottom: "10px" }}
              onClick={handleLoginGoogle}
            >
              Sign in with Google
            </Button>
            <Button
              isLoading={facebookLoading}
              colorScheme="facebook"
              leftIcon={<CiFacebook size="21" />}
              style={{ width: "100%", marginTop: "5px", marginBottom: "10px" }}
              onClick={handleLoginFacebook}
            >
              Sign in with Facebook
            </Button>
            <div
              style={{
                fontSize: "14px",
                marginTop: "10px",
                paddingBottom: "30px",
              }}
            >
              <p style={{ marginTop: "10px" }}>
                Don't have an account yet?{" "}
                <Link className="link" style={{ fontWeight: "600" }} to="/signup">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default SigninUserPage;
