import {
  Container,
  FormHelperText,
  FormLabel,
  Input,
  FormControl,
  Flex,
  Button,
  Select,
  FormErrorMessage,
  Textarea,
  Image,
  Text,
  Box,
  Heading,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useFormik } from "formik";
import { propertySchema } from "../schemas/propertyValidator";
import { useLocation, useNavigate } from "react-router-dom";
import { AddIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  AsyncCreatableSelect,
  AsyncSelect,
  CreatableSelect,
  Select as Select2,
} from "chakra-react-select";
import * as yup from "yup";

function RoomFormEdit(props) {
  const location = useLocation();
  const [defaultType, setDefaultType] = useState(null);
  const [isPropAvail, setIsPropAvail] = useState(true);
  const [isTypeUpdate, setIsTypeUpdate] = useState(false);
  const [preview, setPreview] = React.useState();
  const [propData, setPropData] = useState(null);
  const [category, setCategory] = useState(null);
  const [defaultImage, setDefaultImage] = useState("");
  const [chosenImage, setChosenImage] = useState("");
  const [propCity, setPropCity] = useState(null);
  const [types, setTypes] = useState([]);
  const [addType, setAddTypes] = useState(false);
  const [chosenType, setChosenType] = useState(null);
  const [typesOption, setTypesOption] = useState([]);
  const [chosenPropData, setChosenPropData] = useState(null);
  const [guest, setGuest] = useState(2);
  const navigate = useNavigate();
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });

  const getPropData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.get(
          process.env.REACT_APP_API_BASE_URL + `/rooms/current-prop?id=${location.state.roomId}`,
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        if (res.data.property) {
          getTypeData(res.data.property.propertyId);
          setPropData(res.data.property);
          setChosenType(res.data.type);
          setDefaultType(res.data.type);
          setCategory(res.data.category);
          setFieldValue("image", res.data.type.typeImg);
          setDefaultImage(res.data.type.typeImg);
          setChosenImage(res.data.type.typeImg);
        } else {
          Swal.fire({
            icon: "error",
            title: `You have not create a property, please create it first`,
            confirmButtonText: "OK",
            confirmButtonColor: "#48BB78",
            timer: 3000,
          }).then((res) => {
            navigate("/property/new", { replace: true, state: { data: propData } });
            window.scrollTo(0, 0);
          });
        }
      }
    } catch (e) {
      console.log(e);
      setIsPropAvail(false);
    }
  };
  const getTypeData = async (propId) => {
    try {
      const res = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/rooms/prop-availability/find/type?id=${propId}`
      );
      const typeOpt = res.data.result.map((val) => {
        return { value: val.typeId, label: val.name };
      });
      setTypesOption(typeOpt);
    } catch (error) {
      console.log(error);
    }
  };
  const getTypeChosenData = async (e, triggeredAction) => {
    try {
      if (triggeredAction.action === "clear") {
        setChosenImage(defaultImage);
        return setChosenType(defaultType);
      }
      const typeId = e.value;
      const res = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/rooms/prop-availability/find/type-one?id=${typeId}`
      );
      setAddTypes(false);
      setChosenType(res.data.result);
      setChosenImage(res.data.result.typeImg);
    } catch (error) {
      console.log(error);
    }
  };

  const onBtnUpdate = async () => {
    //onBtnSubmit
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        if (isTypeUpdate) {
          const formData = new FormData();
          if (typeof values.image === "string") {
            formData.append("filename", values.image);
          } else {
            formData.append("images", values.image);
            formData.append("filename", "");
          }
          formData.append("roomId", parseInt(location.state.roomId));
          formData.append("typeId", parseInt(chosenType.typeId));
          formData.append("price", parseInt(values.price));
          formData.append("capacity", parseInt(guest));
          formData.append("name", values.name);
          formData.append("desc", values.description);
          formData.append("isTypeUpdate", isTypeUpdate);
          const res = await Axios.post(
            process.env.REACT_APP_API_BASE_URL + "/rooms/update",
            formData,
            {
              headers: {
                Authorization: `Bearer ${getLocalStorage}`,
              },
            }
          );
          if (res.data.success) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              confirmButtonText: "OK",
              confirmButtonColor: "#48BB78",
            }).then(() => {
              setFieldValue("description", "");
              setFieldValue("name", "");
              setFieldValue("price", "");
              setFieldValue("image", undefined);
              setFieldValue("desc", "");
              navigate("/room", { replace: true });
            });
          }
        } else if (!addType) {
          const res = await Axios.post(
            process.env.REACT_APP_API_BASE_URL + "/rooms/update",
            {
              typeId: chosenType.typeId,
              roomId: location.state.roomId,
            },
            {
              headers: {
                Authorization: `Bearer ${getLocalStorage}`,
              },
            }
          );
          if (res.data.success) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              confirmButtonText: "OK",
              confirmButtonColor: "#48BB78",
            }).then(() => {
              setFieldValue("description", "");
              setFieldValue("name", "");
              setFieldValue("price", "");
              setFieldValue("image", undefined);
              setFieldValue("desc", "");
              navigate("/room", { replace: true });
            });
          }
        } else {
          const formData = new FormData();
          formData.append("roomId", parseInt(location.state.roomId));
          formData.append("price", parseInt(values.price));
          formData.append("capacity", parseInt(guest));
          formData.append("name", values.name);
          formData.append("desc", values.description);
          formData.append("images", values.image);
          formData.append("addType", true);
          const response = await Axios.post(
            process.env.REACT_APP_API_BASE_URL + "/rooms/update",
            formData,
            {
              headers: {
                Authorization: `Bearer ${getLocalStorage}`,
              },
            }
          );
          if (response.data.success) {
            Swal.fire({
              icon: "success",
              title: response.data.message,
              confirmButtonText: "OK",
              confirmButtonColor: "#48BB78",
            }).then(() => {
              setFieldValue("city", "");
              setFieldValue("name", "");
              setFieldValue("phone", "");
              setFieldValue("address", "");
              setFieldValue("image", undefined);
              setFieldValue("desc", "");
              navigate("/room", { replace: true });
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const FILE_SIZE = 1000000;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

  const roomSchema = yup.object().shape({
    image: addType
      ? yup
          .mixed()
          .required("A file is required")
          .test("fileSize", "File size is too large", (value) => value && value.size < FILE_SIZE)
          .test(
            "fileFormat",
            "File extension is not supported",
            (value) => value && SUPPORTED_FORMATS.includes(value.type)
          )
      : yup.string(),
    name: addType ? yup.string().required("Please input your type name") : yup.string(),
    price: addType
      ? yup
          .string()
          .matches(/^[\d +]+$/, { message: "Please input the valid price" })
          .required("Please input the type price")
      : yup.string(),
    description: yup.string(),
  });

  //Formik configuration
  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        image: undefined,
        name: "",
        price: "",
        description: "",
      },
      validationSchema: roomSchema,
      enableReinitialize: true,
      onSubmit: onBtnUpdate,
    });
  useEffect(() => {
    getPropData();
    document.title = "Renthaven || Create Room";
  }, [types]);

  useEffect(() => {
    if (!values.image) {
      setPreview(undefined);
      return;
    }
    if (typeof values.image !== "string") {
      const objectUrl = URL.createObjectURL(values.image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(process.env.REACT_APP_BASE_IMG_URL + `${values.image}`);
    }
  }, [values.image, addType]);
  useEffect(() =>{
    if(!location.state){
      Swal.fire({
        icon: "error",
        title: `Something went wrong.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#48BB78",
        timer: 3000,
      }).then(resp =>{
        navigate("/room", {replace: true})
      })
    }
  }, [])
  return (
    <Box px={{ base: "0", md: "20" }} pb={5} m={{ base: "15px", md: "" }}>
      <Heading mb={{ base: "30px", md: "5" }} textAlign={{ base: "center", md: "left" }}>
        Edit Your Room
      </Heading>
      <form>
        <Flex direction="column" align="center" justify="center" gap={6}>
          <Divider />
          {propData ? (
            <>
              <FormControl>
                <Text fontSize="24px" mb={3} fontWeight="600">
                  Property Detail
                </Text>
                <Flex>
                  <Flex direction={"column"} w="50%">
                    <Text>Property Name :</Text>
                    <Text mb={2}>{propData.name}</Text>
                    <Text>Address :</Text>
                    <Text mb={2}>{propData.address}</Text>
                  </Flex>
                  <Flex direction={"column"} w="50%">
                    <Text>City :</Text>
                    <Text mb={2}>{category.city}</Text>
                    <Text>Created at :</Text>
                    <Text mb={2}>{new Date(propData.createdAt).toLocaleDateString()}</Text>
                  </Flex>
                </Flex>
              </FormControl>
              <Divider />
            </>
          ) : (
            ""
          )}
          {typesOption.length > 0 && !addType && !isTypeUpdate ? (
            <>
              <FormControl>
                <Text fontSize="24px" fontWeight="600" mb={5}>
                  Choose Type
                </Text>
                <Select2
                  isSearchable
                  isClearable
                  options={typesOption}
                  placeholder="Choose Type"
                  onChange={getTypeChosenData}
                ></Select2>
              </FormControl>
              <FormControl>
                <Button
                  colorScheme="green"
                  variant="outline"
                  leftIcon={<AddIcon />}
                  size="sm"
                  onClick={() => {
                    setAddTypes(true);
                    setChosenType(null);
                  }}
                >
                  Add Type
                </Button>
              </FormControl>
            </>
          ) : chosenPropData &&
            (typesOption.length < 1 || typesOption != null) &&
            !addType &&
            !isTypeUpdate ? (
            <>
              <FormControl>
                <Button
                  colorScheme="green"
                  variant="outline"
                  leftIcon={<AddIcon />}
                  size="sm"
                  onClick={() => {
                    setAddTypes(true);
                    setChosenType(null);
                  }}
                >
                  Add Type
                </Button>
              </FormControl>
            </>
          ) : (
            ""
          )}
          {chosenType && !addType && !isTypeUpdate ? (
            <>
              <FormControl>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text fontSize="20px" mb={3} fontWeight="600">
                    Type Detail
                  </Text>
                  {chosenType.typeId == defaultType.typeId ? (
                    <Text
                      _hover={{ cursor: "pointer", color: "blue", textDecor: "underline" }}
                      onClick={() => {
                        setFieldValue("name", defaultType.name);
                        setFieldValue("price", defaultType.price);
                        setFieldValue("description", defaultType.desc);
                        setIsTypeUpdate(true);
                      }}
                    >
                      {" "}
                      Edit
                    </Text>
                  ) : (
                    ""
                  )}
                </Flex>
                <Image
                  src={process.env.REACT_APP_BASE_IMG_URL + chosenImage}
                  w="300px"
                  h="150px"
                  objectFit={"cover"}
                  mb={2}
                ></Image>
                <FormLabel>Type Name</FormLabel>
                <Text>{chosenType.name}</Text>
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Text>{chosenType.price}</Text>
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Text>{chosenType.desc}</Text>
              </FormControl>
            </>
          ) : addType && !isTypeUpdate ? (
            <>
              <FormControl isRequired isInvalid={errors.image && touched.image ? true : false}>
                <Text fontSize="20px" mb={3} fontWeight="600">
                  Add Type
                </Text>
                <FormLabel>Picture</FormLabel>
                <Input
                  type="file"
                  _hover={{
                    cursor: "pointer",
                  }}
                  p="0"
                  sx={{
                    "::file-selector-button": {
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
                  onChange={(e) => setFieldValue("image", e.target.files[0])}
                  onBlur={handleBlur}
                  accept=".png,.jpg,.jpeg"
                />
                <FormHelperText>
                  File Size: 1MB (Megabyte) maximum. File extension that are accepted: .JPG .JPEG
                  .PNG
                </FormHelperText>
                <FormErrorMessage>{errors.image}</FormErrorMessage>
                {values.image && typeof values.image !== "string" && (
                  <Flex mt={3} direction="column" gap={3}>
                    <Text>Preview:</Text>
                    <Image width="280px" height="187px" src={preview} />
                  </Flex>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={errors.name && touched.name ? true : false}>
                <FormLabel>Type Name</FormLabel>
                <Input name="name" onBlur={handleBlur} onChange={handleChange} />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.price && touched.price ? true : false}>
                <FormLabel>Price</FormLabel>
                <Input name="price" onBlur={handleBlur} onChange={handleChange} />
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.description && touched.description ? true : false}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  focusBorderColor="green.400"
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Capacity </FormLabel>
                <NumberInput
                  defaultValue={2}
                  min={2}
                  max={10}
                  w={"100px"}
                  focusBorderColor="#48BB78"
                  onChange={(e) => setGuest(e.target.value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Button
                colorScheme="green"
                variant={"outline"}
                onClick={() => {
                  setAddTypes(false);
                  getPropData();
                  setPreview(null);
                }}
              >
                Cancel
              </Button>
            </>
          ) : chosenType && !addType && isTypeUpdate ? (
            <>
              <FormControl isRequired isInvalid={errors.image && touched.image ? true : false}>
                <Text fontSize="20px" mb={1} fontWeight="600">
                  Edit Type
                </Text>
                <Text mb={3}>
                  <span style={{ color: "red" }}>*</span>
                  <span style={{ fontWeight: "600" }}>DESCLAIMER: </span>Please note that by editing
                  this type data will affect every room with this type room.
                </Text>
                <FormLabel>Picture</FormLabel>
                <Input
                  type="file"
                  _hover={{
                    cursor: "pointer",
                  }}
                  p="0"
                  sx={{
                    "::file-selector-button": {
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
                  onChange={(e) => setFieldValue("image", e.target.files[0])}
                  onBlur={handleBlur}
                  accept=".png,.jpg,.jpeg"
                />
                <FormHelperText>
                  File Size: 1MB (Megabyte) maximum. File extension that are accepted: .JPG .JPEG
                  .PNG
                </FormHelperText>
                <FormErrorMessage>{errors.image}</FormErrorMessage>
                {values.image && (
                  <Flex mt={3} direction="column" gap={3}>
                    <Text>Preview:</Text>
                    <Image width="280px" height="187px" src={preview} />
                  </Flex>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={errors.name && touched.name ? true : false}>
                <FormLabel>Type Name</FormLabel>
                <Input
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.price && touched.price ? true : false}>
                <FormLabel>Price</FormLabel>
                <Input
                  name="price"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={parseInt(values.price)}
                />
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.description && touched.description ? true : false}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  focusBorderColor="green.400"
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Capacity </FormLabel>
                <NumberInput
                  defaultValue={defaultType.capacity}
                  min={2}
                  max={10}
                  w={"100px"}
                  focusBorderColor="#48BB78"
                  onChange={(e) => setGuest(e.target.value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Button
                colorScheme="green"
                variant={"outline"}
                onClick={() => {
                  setAddTypes(false);
                  setChosenType(defaultType);
                  setIsTypeUpdate(false);
                  setChosenImage(defaultImage);
                  setFieldValue("name", "");
                  setFieldValue("price", "");
                  setFieldValue("description", "");
                  setFieldValue("image", undefined);
                  setPreview(null);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            ""
          )}
          {/* <FormControl>
              <Image
                src="https://www.thespruce.com/thmb/iMt63n8NGCojUETr6-T8oj-5-ns=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/PAinteriors-7-cafe9c2bd6be4823b9345e591e4f367f.jpg"
                rounded="md"
                width={"300px"}
                height={"150px"}
              />
            </FormControl> */}
        </Flex>
        <Flex mt={5} align="center" justify="space-between">
          <Button
            colorScheme="gray"
            variant="ghost"
            onClick={() => navigate("/room", { replace: true })}
            leftIcon={<ArrowLeftIcon boxSize={3} />}
          >
            Back
          </Button>
          <Button
            isDisabled={
              addType &&
              (values.name === "" ||
                errors.name ||
                values.price === "" ||
                errors.price ||
                values.image === undefined ||
                errors.image)
                ? true
                : !chosenType && !addType
                ? true
                : false
            }
            colorScheme="green"
            onClick={onBtnUpdate}
          >
            Update
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default RoomFormEdit;
