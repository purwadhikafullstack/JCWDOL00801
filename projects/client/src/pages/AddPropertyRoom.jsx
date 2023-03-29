import {
  Box,
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Image,
  Text,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Axios from "axios";
import { useSelector } from "react-redux";
import { propertyRoomSchema } from "../schemas/propertyRoomVal";

function AddPropertyRoom() {
  const navigate = useNavigate();
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });
  const steps = [{ label: "Add Property" }, { label: "Add Rooms" }, { label: "Finish" }];
  const [preview, setPreview] = React.useState();
  const [city, setCity] = React.useState([]);

  const getCityData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + `/category/${tenantId}`);
      setCity(response.data);
    } catch (error) {
      console.log(error);
      setCity([]);
    }
  };

  const onBtnSubmit = async () => {};

  //Formik configuration
  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        propertyImage: undefined,
        propertyName: "",
        propertyAddress: "",
        propertyPhone: "",
        propertyDesc: "",
        propertyCity: "",
      },
      validationSchema: propertyRoomSchema,
      enableReinitialize: true,
      onSubmit: onBtnSubmit,
    });

  useEffect(() => {
    if (!values.propertyImage) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(values.propertyImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [values.propertyImage]);

  useEffect(() => {
    getCityData();
  }, []);

  return (
    <Box px={{ base: "0", md: "20" }}>
      <Flex flexDir="column" width="100%">
        <form onSubmit={handleSubmit}>
          <Steps activeStep={activeStep}>
            <Step label="Add Property">
              <Heading my="5">Add Your Property</Heading>
              <Flex direction="column" align="center" justify="center" gap={6}>
                <FormControl
                  isRequired
                  isInvalid={errors.propertyImage && touched.propertyImage ? true : false}
                >
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
                    name="propertyImage"
                    onChange={(e) => setFieldValue("propertyImage", e.target.files[0])}
                    onBlur={handleBlur}
                    accept=".png,.jpg,.jpeg"
                  />
                  <FormHelperText>
                    File Size: 1MB (Megabyte) maximum. File extension that are accepted: .JPG .JPEG
                    .PNG
                  </FormHelperText>
                  <FormErrorMessage>{errors.propertyImage}</FormErrorMessage>
                  {values.propertyImage && (
                    <Flex mt={3} direction="column" gap={3}>
                      <Text>Preview:</Text>
                      <Image width="280px" height="187px" src={preview} />
                    </Flex>
                  )}
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.propertyName && touched.propertyName ? true : false}
                >
                  <FormLabel>Property Name</FormLabel>
                  <Input name="propertyName" onBlur={handleBlur} onChange={handleChange} />
                  <FormErrorMessage>{errors.propertyName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.propertyAddress && touched.propertyAddress ? true : false}
                >
                  <FormLabel>Address</FormLabel>
                  <Input name="propertyAddress" onBlur={handleBlur} onChange={handleChange} />
                  <FormErrorMessage>{errors.propertyAddress}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.propertyCity && touched.propertyCity ? true : false}
                >
                  <FormLabel>City</FormLabel>
                  <Select
                    name="propertyCity"
                    defaultValue=""
                    onBlur={handleBlur}
                    onChange={(e) => setFieldValue("propertyCity", e.target.value)}
                    placeholder="Select City"
                  >
                    {city.map((val, idx) => {
                      return (
                        <option
                          value={val.categoryId}
                          key={idx}
                        >{`${val.province}, ${val.city}`}</option>
                      );
                    })}
                  </Select>
                  <FormErrorMessage>{errors.propertyCity}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.propertyPhone && touched.propertyPhone ? true : false}
                >
                  <FormLabel>Phone</FormLabel>
                  <Input
                    type="tel"
                    name="propertyPhone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.propertyPhone}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.propertyDesc && touched.propertyDesc ? true : false}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    focusBorderColor="green.400"
                    name="propertyDesc"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.propertyDesc}</FormErrorMessage>
                </FormControl>
              </Flex>
              {/* <Flex mt={5} align="center" justify="space-between">
                <Button
                  isDisabled={
                    values.name === "" ||
                    errors.name ||
                    values.address === "" ||
                    errors.address ||
                    values.city === "" ||
                    errors.city ||
                    values.image === undefined ||
                    errors.image ||
                    values.phone === "" ||
                    errors.phone
                      ? true
                      : false
                  }
                  type="submit"
                  colorScheme="green"
                >
                  Create
                </Button>
              </Flex> */}
            </Step>
            <Step label="Add Rooms">{/* PUT FORM HERE */}</Step>
            <Step label="Finish">
              <Flex mt={5} align="center" justify="center">
                <Heading>Make sure you fill in the correct information and click finish</Heading>
              </Flex>
            </Step>
          </Steps>
        </form>
        {activeStep === steps.length ? (
          <Flex px={4} py={4} width="100%" flexDirection="column">
            <Heading fontSize="xl" textAlign="center">
              Woohoo! All steps completed!
            </Heading>
            <Button mx="auto" mt={6} size="sm" onClick={reset}>
              Reset
            </Button>
          </Flex>
        ) : (
          <Flex mt={5} width="100%" justify="space-between">
            <Button
              mr={4}
              onClick={
                activeStep === 0
                  ? () => {
                      navigate("/property/new", { replace: true });
                    }
                  : prevStep
              }
              colorScheme="gray"
              variant="ghost"
              leftIcon={<ArrowLeftIcon boxSize={3} />}
            >
              {activeStep === 0 ? `Back` : `Prev`}
            </Button>
            <Button
              colorScheme="green"
              onClick={nextStep}
              type={activeStep === steps.length - 1 ? "submit" : "button"}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

export default AddPropertyRoom;
