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
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useFormik } from "formik";
import "../styles/login.css";
import { useEffect, useState } from "react";
import { loginSchema } from "../schemas/signinValidator";
import Axios from "axios";
import { loginAction } from "../actions/userAction";
import { useDispatch } from "react-redux";
import { setTenantAction } from "../actions/tenantAction";

const SigninTenantPage = (props) => {
  const navigate = useNavigate();
  const [alerts, setAlert] = useState("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useDispatch();
  const handleEmailLogin = () => {
    setLoginLoading(true);
    Axios.post(process.env.REACT_APP_API_BASE_URL + "/signin/tenant", {
      login: "common",
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        if (res.data.success == true) {
          localStorage.setItem("renthaven1", res.data.token);
          loginAction(res.data.user);
          setTenantAction(res.data.tenant);
          setTenantAction(res.data.bank);
          window.location.reload();
          setLoginLoading(false);
          navigate("/tenant-dashboard", { replace: true });
          setTenantAction(res.data.tenant);      
        } else if (res.data.success == false) {
          setAlert(
            <p>
              The account has not been registered, please register{" "}
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
        setAlert(`${e.response.data.message}`);
        setLoginLoading(false);
        console.log(e)
      });
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
                value={values.email}
                style={{ marginTop: "5px" }}
                onChange={(e) => {
                  handleChange(e)
                }
                }
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

export default SigninTenantPage;
