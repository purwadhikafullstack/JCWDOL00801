import {
  Box,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Select,
  Text,
  Image,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import Axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { propertySchema } from "../schemas/propertyValidator";

function PropertyFormEdit(props) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [editData, setEditData] = React.useState({});
  const [preview, setPreview] = React.useState();
  const [city, setCity] = React.useState([]);
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });

  const getEditData = async () => {
    const propertyId = search.split("?")[1];
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/property/${propertyId}`
      );
      setEditData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCityData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + `/category/${tenantId}`);
      setCity(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onBtnUpdate = async () => {
    try {
      const formData = new FormData();
      if (typeof values.image === "string") {
        formData.append("filename", values.image);
      } else {
        formData.append("images", values.image);
        formData.append("filename", "");
      }
      formData.append("propertyId", parseInt(editData.propertyId));
      formData.append("categoryId", parseInt(values.city));
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("desc", values.desc);
      let response = await Axios.patch(
        process.env.REACT_APP_API_BASE_URL + "/property/edit",
        formData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#48BB78",
        }).then(() => {
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
        image: undefined || editData.image,
        name: "" || editData.name,
        address: "" || editData.address,
        phone: "" || editData.phone,
        desc: "" || editData.desc,
        city: "" || `${editData.categoryId}`,
      },
      validationSchema: propertySchema,
      enableReinitialize: true,
      onSubmit: onBtnUpdate,
    });

  useEffect(() => {
    getEditData();
    getCityData();
  }, []);

  useEffect(() => {
    if (values.image === undefined) {
      setPreview(undefined);
      return;
    }
    if (typeof values.image !== "string") {
      const objectUrl = URL.createObjectURL(values.image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(`http://localhost:8000/${values.image}`);
    }
  }, [values.image]);

  return (
    <Box px={{ base: "0", md: "20" }} pb={5}>
      <Heading mb="5">Edit Property</Heading>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" align="center" justify="center" gap={6}>
          <FormControl
            isInvalid={
              typeof values.image !== "string"
                ? errors.image && touched.image
                  ? true
                  : false
                : false
            }
          >
            {values.image !== null ? (
              <Flex mb={6} direction="column" gap={3}>
                <Text>Property Picture:</Text>
                <Image width="280px" height="187px" src={preview} />
              </Flex>
            ) : null}
            <FormLabel>Change Property Picture</FormLabel>
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
            <FormErrorMessage>
              {typeof values.image !== "string" ? errors.image : null}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.name && touched.name ? true : false}>
            <FormLabel>Property Name</FormLabel>
            <Input name="name" value={values.name} onBlur={handleBlur} onChange={handleChange} />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.address && touched.address ? true : false}>
            <FormLabel>Address</FormLabel>
            <Input
              name="address"
              value={values.address}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.address}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.city && touched.city ? true : false}>
            <FormLabel>City</FormLabel>
            <Select
              name="city"
              value={values.city}
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
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.phone && touched.phone ? true : false}>
            <FormLabel>Phone</FormLabel>
            <Input
              type="tel"
              name="phone"
              value={values.phone}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.desc && touched.desc ? true : false}>
            <FormLabel>Description</FormLabel>
            <Textarea
              focusBorderColor="green.400"
              name="desc"
              value={values.desc}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.desc}</FormErrorMessage>
          </FormControl>
        </Flex>
        <Flex mt={5} align="center" justify="space-between">
          <Button
            colorScheme="gray"
            variant="ghost"
            onClick={() => navigate("/property", { replace: true })}
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
              (typeof values.image !== "string" ? errors.image : null) ||
              values.phone === "" ||
              errors.phone
                ? true
                : false
            }
            type="submit"
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

export default PropertyFormEdit;
