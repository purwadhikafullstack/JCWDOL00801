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
  Heading,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Axios from "axios";
import { useFormik } from "formik";
import { propertySchema } from "../schemas/propertyValidator";

function CreateProperty(props) {
  const [city, setCity] = React.useState([]);
  const [preview, setPreview] = React.useState();

  const getCityData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + "/category");
      setCity(response.data);
    } catch (error) {
      console.log(error);
      setCity([]);
    }
  };

  const onBtnCreate = () => {
    console.log(`submitted`);
    console.log(values.image);
  };

  //Formik configuration
  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      image: undefined,
      name: "",
      address: "",
      phone: "",
      description: "",
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
    <form onSubmit={handleSubmit}>
      <Flex direction="column" align="center" justify="center" gap={6}>
        <FormControl>
          <FormLabel>Property Name</FormLabel>
          <Input />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input />
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>City</FormLabel>
          <Select placeholder="Select City">
            {city.map((val, idx) => {
              return <option key={idx}>{`${val.province}, ${val.city}`}</option>;
            })}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Phone</FormLabel>
          <Input type="tel" />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>
        <FormControl>
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
          {values.image && (
            <Flex mt={3} direction="column" gap={3}>
              <Heading size="sm">Preview:</Heading>
              <Image boxSize="250px" src={preview} />
            </Flex>
          )}
          <FormErrorMessage>{errors.image}</FormErrorMessage>
        </FormControl>
      </Flex>
      <Flex mt={5} align="center" justify="end">
        <Button type="submit" colorScheme="green" onClick={onBtnCreate}>
          Create
        </Button>
      </Flex>
    </form>
  );
}

export default CreateProperty;
