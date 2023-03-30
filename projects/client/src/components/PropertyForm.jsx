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
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Axios from "axios";
import { useFormik } from "formik";
import { propertySchema } from "../schemas/propertyValidator";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function PropertyForm(props) {
  const [city, setCity] = React.useState([]);
  const [preview, setPreview] = React.useState();
  const navigate = useNavigate();
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });

  const getCityData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + `/category/${tenantId}`);
      setCity(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onBtnCreate = async () => {
    //onBtnSubmit
    try {
      const formData = new FormData();
      formData.append("tenantId", parseInt(tenantId));
      formData.append("categoryId", parseInt(values.city));
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("desc", values.description);
      formData.append("images", values.image);
      let response = await Axios.post(
        process.env.REACT_APP_API_BASE_URL + "/property/new",
        formData
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
          navigate("/property", { replace: true });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Formik configuration
  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        image: undefined,
        name: "",
        address: "",
        phone: "",
        description: "",
        city: "",
      },
      validationSchema: propertySchema,
      enableReinitialize: true,
      onSubmit: onBtnCreate,
    });

  useEffect(() => {
    getCityData();
  }, []);

  useEffect(() => {
    if (!values.image) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(values.image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [values.image]);

  return (
    <Box px={{ base: "0", md: "20" }} pb={5}>
      <Heading mb="5">Add Your Property</Heading>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" align="center" justify="center" gap={6}>
          <FormControl isRequired isInvalid={errors.image && touched.image ? true : false}>
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
              File Size: 1MB (Megabyte) maximum. File extension that are accepted: .JPG .JPEG .PNG
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
            <FormLabel>Property Name</FormLabel>
            <Input name="name" onBlur={handleBlur} onChange={handleChange} />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.address && touched.address ? true : false}>
            <FormLabel>Address</FormLabel>
            <Input name="address" onBlur={handleBlur} onChange={handleChange} />
            <FormErrorMessage>{errors.address}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.city && touched.city ? true : false}>
            <FormLabel>City</FormLabel>
            <Select
              name="city"
              defaultValue=""
              onBlur={handleBlur}
              onChange={(e) => setFieldValue("city", e.target.value)}
              placeholder="Select City"
            >
              {city.map((val, idx) => {
                return (
                  <option value={val.categoryId} key={idx}>{`${val.province}, ${val.city}`}</option>
                );
              })}
            </Select>
            <FormHelperText>
              If theres no city, please go to the "Manage Categories" menu
            </FormHelperText>
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.phone && touched.phone ? true : false}>
            <FormLabel>Phone</FormLabel>
            <Input type="tel" name="phone" onBlur={handleBlur} onChange={handleChange} />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
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
        </Flex>
        <Flex mt={5} align="center" justify="space-between">
          <Button
            colorScheme="gray"
            variant="ghost"
            onClick={() => navigate("/property/new", { replace: true })}
            leftIcon={<ArrowLeftIcon boxSize={3} />}
          >
            Back
          </Button>
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
        </Flex>
      </form>
    </Box>
  );
}

export default PropertyForm;
