import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  ScaleFade,
  useDisclosure,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { CiFacebook } from "react-icons/ci";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { auth, provider, providerFacebook } from "../config/firebase";
import { signInWithPopup, getAuth, deleteUser } from "firebase/auth";
import Axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { loginAction } from "../actions/userAction";
import { basicSchema } from "../schemas/signupValidator";

const SignupUserPage = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [alerts, setAlert] = useState("");
  const [normalReg, setReg] = useState("common");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [infoIcon, setInfoIcon] = useState(false);
  const handleClick = () => setShow(!show);
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  //signup handle section
  const handleSignupGoogle = () => {
    setGoogleLoading(true);
    signInWithPopup(auth, provider)
      .then((data) => {
        Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/new-user", {
          name: data._tokenResponse.displayName,
          email: data._tokenResponse.email,
          phone: "-",
          provider: data._tokenResponse.providerId,
        })
          .then((res) => {
            Axios.post(process.env.REACT_APP_API_BASE_URL + "/signin", {
              login: data._tokenResponse.providerId,
              email: data._tokenResponse.email,
            })
              .then((result) => {
                localStorage.setItem("renthaven1", result.data.token);
                loginAction(result.data.result);
                Swal.fire({
                  title: "Registration Success!",
                  icon: "success",
                  confirmButtonText: "Confirm",
                  confirmButtonColor: "#48BB78",
                })
                  .then((res) => {
                    navigate("/verify", { replace: true });
                    localStorage.setItem("renthaven1", result.data.token);
                    window.location.reload();
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => {
                if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
                  setGoogleLoading(false);
                } else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
                  onToggle();
                  setInfoIcon(false);
                  setAlert("Account has already been registered")
                  setGoogleLoading(false);
                }else{
                  onToggle();
                  setInfoIcon(false);
                  setAlert(e.response.data.message);
                  setGoogleLoading(false);
                }
              });
            setGoogleLoading(false);
          })
          .catch((e) => {
            if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
              setGoogleLoading(false);
            } else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
              onToggle();
              setInfoIcon(false);
              setAlert("Account has already been registered")
              setGoogleLoading(false);
            }else{
              onToggle();
              setInfoIcon(false);
              setAlert(e.response.data.message);
              setGoogleLoading(false);
            }
          }).catch((e) => {
            if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
              setGoogleLoading(false);
            } else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
              onToggle();
              setInfoIcon(false);
              setAlert("Account has already been registered")
              setGoogleLoading(false);
            }else {
              setAlert(e.response.data.message);
              setInfoIcon(false);
              setGoogleLoading(false);
            };
          })
      })
      .catch((e) => {
        if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
          setGoogleLoading(false);
        }else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
          onToggle();
          setInfoIcon(false);
          setAlert("Account has already been registered")
          setGoogleLoading(false);
        } 
        else if (e.response.status == 409) {
          onToggle();
          setInfoIcon(false);
          setAlert(e.response.data.message);
          setGoogleLoading(false);
        }
        setGoogleLoading(false);
      });
  };
  const onInputChange = e => {
    const { value } = e.target;
    const re = /^[A-Za-z]+$/;
    if (value === "" || re.test(value)) {
      handleChange(e)
    }
  }
  const handleSignupFacebook = () => {
    setFacebookLoading(true);
    signInWithPopup(auth, providerFacebook)
      .then((data) => {
        Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/new-user", {
          name: data._tokenResponse.displayName,
          email: data._tokenResponse.email,
          phone: "-",
          provider: data._tokenResponse.providerId,
        }).then((res) => {
          Axios.post(process.env.REACT_APP_API_BASE_URL + "/signin", {
            login: data._tokenResponse.providerId,
            email: data._tokenResponse.email,
          })
            .then((result) => {
              localStorage.setItem("renthaven1", result.data.token);
              loginAction(result.data.result);
              Swal.fire({
                title: "Registration Success!",
                icon: "success",
                confirmButtonText: "Confirm",
                confirmButtonColor: "#48BB78",
              })
                .then((res) => {
                  localStorage.setItem("renthaven1", result.data.token);
                  window.location.reload();
                  navigate("/verify", { replace: true });
                })
                .catch((e) => {
                  if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
                    setFacebookLoading(false);
                  } else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
                    onToggle();
                    setInfoIcon(false);
                    setAlert("Account has already been registered")
                    setFacebookLoading(false);
                  } else{
                    onToggle();
                    setInfoIcon(false);
                    setAlert(e.response.data.message);
                    setInfoIcon(false);
                    setFacebookLoading(false);
                  };
                });
            })
            .catch((e) => {
              if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
                setFacebookLoading(false);
              } else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
                onToggle();
                setInfoIcon(false);
                setAlert("Account has already been registered")
                setFacebookLoading(false);
              }else{
                onToggle();
                setInfoIcon(false);
                setAlert(e.response.data.message);
                setFacebookLoading(false);
              }
            });
          setFacebookLoading(false);
        }).catch((e) => {
          console.log(e)
          if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
            setFacebookLoading(false);
          }else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
            onToggle();
            setInfoIcon(false);
            setAlert("Account has already been registered")
            setFacebookLoading(false);
          } else {
            console.log(e)
            setAlert(e.response.data.message);
            setInfoIcon(false);
            setFacebookLoading(false);
          };
        })
      })
      .catch((e) => {
        if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
          setFacebookLoading(false);
        }else if (e.message =="Firebase: Error (auth/account-exists-with-different-credential)."){
          onToggle();
          setInfoIcon(false);
          setAlert("Account has already been registered")
          setFacebookLoading(false);
        } else {
          console.log(e)
          setAlert(e.response.data.message);
          setInfoIcon(false);
          setFacebookLoading(false);
        }
      });
  };
  const registerHandler = () => {
    setSignupLoading(true);
    if (normalReg == "common") {
      Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/new-user", {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        provider: "common",
      })
        .then((res) => {
          if (res.data.success === true)
            Swal.fire({
              title: "Registration Success!",
              icon: "success",
              confirmButtonText: "Confirm",
              confirmButtonColor: "#48BB78",
            }).then((res) => {
              Axios.post(process.env.REACT_APP_API_BASE_URL + "/signin", {
                login: normalReg,
                email: values.email,
                password: values.password,
              }).then((res) => {
                if (res.data.success == true) {
                  localStorage.setItem("renthaven1", res.data.token);
                  loginAction(res.data.result);
                  window.location.reload();
                  navigate("/verify", { replace: true });
                }
              });
            });
          else if (res.data.success === false) {
            setAlert("The email had already been registered");
            onToggle();
            setSignupLoading(false);
          }
          setSignupLoading(false);
        })
        .catch((e) => {
          if (e.response.status == 403) {
            setAlert(e.response.data.message);
            onToggle();
            return setSignupLoading(false);
          }
          console.log(e);
          setAlert(e.response.data.message);
          setSignupLoading(false);
        });
    }
  };
  const passwordRules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  //password must contains 8 chars, one uppercase, one lowercase, one number and one special characters

  //Formik configuration
  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      },
      validationSchema: basicSchema,
      onSubmit: registerHandler,
    });
  useEffect(() => {
    document.title = "Signup RentHaven";
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
              <Alert status={infoIcon ? "info" : "error"} style={{ marginBottom: "20px" }}>
                <AlertIcon />
                {alerts}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <p>
                Name <span style={{ color: "red" }}>*</span>
              </p>
              <FormControl isRequired>
                <Input
                  isInvalid={errors.name && touched.name ? true : false}
                  id="name"
                  style={{ marginTop: "5px" }}
                  value={values.name}
                  onChange={onInputChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              {errors.name && touched.name ? (
                <p style={{ color: "red", marginBottom: "5px" }}>{errors.name}</p>
              ) : (
                ""
              )}
              <p>
                Email <span style={{ color: "red" }}>*</span>
              </p>
              <FormControl isRequired>
                <Input
                  isInvalid={errors.email && touched.email ? true : false}
                  id="email"
                  style={{ marginTop: "5px" }}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              {errors.email && touched.email ? (
                <p style={{ color: "red", marginBottom: "5px" }}>{errors.email}</p>
              ) : (
                ""
              )}
              <p>
                Phone <span style={{ color: "red" }}>*</span>
              </p>
              <FormControl isRequired>
                <Input
                  isInvalid={errors.phone && touched.phone ? true : false}
                  id="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              {errors.phone && touched.phone ? (
                <p style={{ color: "red", marginBottom: "5px" }}>{errors.phone}</p>
              ) : (
                ""
              )}
              {normalReg === "common" ? (
                <div>
                  <p style={{ marginTop: "10px" }}>
                    Password <span style={{ color: "red" }}>*</span>
                  </p>
                  <FormControl isRequired>
                    <InputGroup size="md" style={{ marginTop: "5px" }}>
                      <Input
                        focusBorderColor="green.400"
                        isInvalid={errors.password && touched.password ? true : false}
                        id="password"
                        type={show ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <InputRightElement width="3.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  {errors.password && touched.password ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>{errors.password}</p>
                  ) : (
                    ""
                  )}
                  <p style={{ marginTop: "10px" }}>
                    Confirm password <span style={{ color: "red" }}>*</span>
                  </p>
                  <FormControl isRequired>
                    <InputGroup size="md" style={{ marginTop: "5px" }}>
                      <Input
                        focusBorderColor="green.400"
                        isInvalid={errors.confirmPassword && touched.confirmPassword ? true : false}
                        id="confirmPassword"
                        type={show ? "text" : "password"}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <InputRightElement width="3.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>{errors.confirmPassword}</p>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              <Button
                isLoading={signupLoading}
                variant="solid"
                colorScheme="green"
                style={{
                  width: "100%",
                  marginTop: "15px",
                  marginBottom: "10px",
                }}
                type="submit"
                onSubmit={handleSubmit}
              >
                Sign up
              </Button>
            </form>
            <div>
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
                style={{
                  width: "100%",
                  marginTop: "5px",
                  marginBottom: "10px",
                }}
                onClick={handleSignupGoogle}
              >
                Sign up with Google
              </Button>
              <Button
                isLoading={facebookLoading}
                colorScheme="facebook"
                leftIcon={<CiFacebook size="21" />}
                style={{
                  width: "100%",
                  marginTop: "5px",
                  marginBottom: "10px",
                }}
                onClick={handleSignupFacebook}
              >
                Sign up with Facebook
              </Button>
            </div>
            <div
              style={{
                fontSize: "14px",
                marginTop: "10px",
                paddingBottom: "30px",
              }}
            >
              <p style={{ marginTop: "10px" }}>
                Already have an account?{" "}
                <Link to="/signin" style={{ fontWeight: "600" }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default SignupUserPage;
