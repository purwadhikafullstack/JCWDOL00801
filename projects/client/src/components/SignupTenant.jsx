import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  ScaleFade,
  Spinner,
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
import { createWorker } from "tesseract.js";

const SignupTenantPage = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState();
  const [selectedFile, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const [ktpValid, setKtpValid] = useState(false);
  const [ktpImage, setKtpImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [ktpAlert, setKtpAlert] = useState("");
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
  // This function will be triggered when the file field change
  const recognizing = async (image) => {
    try {
      console.log(image);
      const worker = await createWorker({
        logger: (m) => {
          setProgress(m.progress);
          console.log(m);
        },
      });
      await worker.loadLanguage("ind");
      console.log("1");
      await worker.initialize("ind");
      console.log("2");
      const {
        data: { text },
      } = await worker.recognize(image);
      const arr = text.split("\n");
      const convertNumber = arr[2].replace(/[^\d.]/g, "");
      if (convertNumber === "" || convertNumber === null) {
        setDone(false);
        setFile(null);
        setKtpValid(false);
        setKtpAlert("KTP is not recognized, please try again.");
        setFieldValue("ktp", "");
      }
      console.log("convert number =>", convertNumber);
      setFieldValue("ktp", convertNumber);
      setDone(true);
      setKtpValid(true);
      worker.terminate();
    } catch (error) {
      console.log(error);
      setFieldValue("ktp", "");
      setDone(false);
      setFile(null);
      setKtpValid(false);
      setKtpAlert("KTP is not recognized, please try again.");
    }
  };
  const removeSelectedImage = () => {
    setSelectedImage();
    setFile(null);
    setDone(false);
    setKtpValid(false);
    setFieldValue("ktp", "");
  };
  const onFileChange = (e) => {
    setFile();
    setDone(false);
    setKtpValid(false);
    setKtpAlert("");
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log(e.target.files);
      recognizing(e.target.files[0]);
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  const onInputChange = e => {
    const { value } = e.target;
    const re = /^[A-Za-z]+$/;
    if (value === "" || re.test(value)) {
      handleChange(e)
    }
  }
  const registerHandler = () => {
    setSignupLoading(true);
    let data = new FormData();
    data.append("name", values.name)
    data.append("email", values.email)
    data.append("password", values.password)
    data.append("phone", values.phone)
    data.append("noKtp", values.ktp)
    data.append("images", selectedFile)
      Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/new-tenant", data)
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
          console.log(e);
          alert(e.response.data.message)
          setAlert(`${e.response.data.message}`)
          setSignupLoading(false);
        });
  };
  const passwordRules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  //password must contains 8 chars, one uppercase, one lowercase, one number and one special characters

  const basicSchema = yup.object().shape({
    name: yup.string().required("Please input your name"),
    email: yup.string().email("Please enter the correct email").required("Required"),
    phone: yup
      .string()
      .matches(/^[\d +]+$/, { message: "Please input the valid phone number" })
      .required("Please input your phone number"),
    password: yup
      .string()
      .min(8)
      .matches(passwordRules, {
        message:
          "Password must contains 8 chars, one uppercase, one lowercase, one number and one special characters",
      })
      .required("Required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Password must match!"),
    ktp: yup
      .string().min(10, "Invalid KTP / ID number").max(20, "Invalid KTP / ID number")
      .matches(/^[\d]+$/, { message: "Only number allowed" })
      .required("Please upload and input your ID number"),
  });

  // const formName = useFormik({
  //   initialValues: {
  //     name: '' || props.name,
  //   },
  // });
  
  // const { values, setFieldValue, onSubmit } = formName;

  //Formik configuration
  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        ktp: "",
      },
      validationSchema: basicSchema,
      onSubmit: registerHandler,
    });
  useEffect(() => {
    document.title = "RentHaven || Signup";
    console.log(selectedFile)
  }, [selectedFile]);
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
              <Alert status={"error"} style={{ marginBottom: "20px" }}>
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
              <div>
                <p>KTP:</p>
                <Input
                  type="file"
                  _hover={{
                    cursor: "pointer",
                  }}
                  p="0"
                  sx={{
                    "::file-selector-button": {
                      cursor: "pointer",
                      height: 10,
                      padding: 2,
                      mr: 4,
                      border: "none",
                      background: "gray.100",
                      fontSize: "md",
                      fontFamily: "Inter, sans-serif",
                      color: "gray.700",
                    },
                  }}
                  name="image"
                  w="50%"
                  onChange={onFileChange}
                  mt={3.5}
                  mb={3.5}
                  accept={"image/*"}
                />

                {selectedFile != null && done ? (
                  <Box>
                    <Flex direction="column">
                      <Flex justifyContent="flex-end">
                        <p onClick={removeSelectedImage} style={{cursor: "pointer"}}>❌</p>
                      </Flex>
                      <Flex direction="column" justifyContent="center" alignItems="center">
                        <img src={selectedImage} alt="Thumb" width="300px" height="200px" />
                      </Flex>
                    </Flex>
                  </Box>
                ) : selectedFile ? (
                  <Box>
                    <Flex direction="column" justifyContent="center" alignItems="center">
                      <Spinner />
                      <Progress mt={1.5} colorScheme="green" value={progress} max={1} w="50%" />
                    </Flex>
                  </Box>
                ) : ktpAlert != "" ? (
                  <Alert status="error">{ktpAlert}</Alert>
                ) : (
                  ""
                )}
                <FormControl isRequired>
                  <Input
                    id="ktp"
                    disabled={values.ktp == "" && !selectedFile ? true : false}
                    isInvalid={errors.ktp && touched.ktp ? true : false}
                    placeholder={!selectedFile ? "Please upload your KTP/ID image" : "Please input your KTP / ID number"}
                    value={values.ktp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    mt={3.5}
                  />
                  {errors.ktp && touched.ktp ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>{errors.ktp}</p>
                  ) : (
                    ""
                  )}
                </FormControl>
              </div>
              <div>
                <p style={{ marginTop: "10px" }}>
                  Password <span style={{ color: "red" }}>*</span>
                </p>
                <FormControl isRequired>
                  <InputGroup size="md" style={{ marginTop: "5px" }}>
                    <Input
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

export default SignupTenantPage;
