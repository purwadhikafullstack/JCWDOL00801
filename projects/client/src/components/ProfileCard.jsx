import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, Text, Stack, Button, Image, Flex } from "@chakra-ui/react";
import { FormHelperText, Input, FormErrorMessage, FormControl } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useFormik } from "formik";
import { profilePictureSchema } from "../schemas/profilePictureVal";
import Axios from "axios";
import Swal from "sweetalert2";
import { loginAction } from "../actions/userAction";
import fallBackAvatar from "../assets/fallback-avatar.jpg";

function ProfileCard(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const { profileImg } = useSelector((state) => {
    return {
      profileImg: state.userReducer.profileImg,
    };
  });

  const onBtnUpdate = async () => {
    console.log(values.image);
    try {
      let token = localStorage.getItem("renthaven1");
      const formData = new FormData();
      formData.append("images", values.image);
      const response = await Axios.patch(
        process.env.REACT_APP_API_BASE_URL + "/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        onClose();
        Swal.fire({
          icon: "info",
          title: response.data.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#48BB78",
        }).then(async () => {
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
              dispatch(loginAction(res.data.result));
              localStorage.setItem("renthaven1", res.data.token);
              setFieldValue("image", undefined);
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Formik configuration
  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      image: undefined,
    },
    validationSchema: profilePictureSchema,
    onSubmit: onBtnUpdate,
  });
  return (
    <Box py={6}>
      <Flex
        maxW={"320px"}
        w={"full"}
        bg="white"
        boxShadow={"sm"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
        border="1px"
        borderColor="blackAlpha.100"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          borderRadius="full"
          border="1px"
          borderColor="#ccc"
          boxSize="200px"
          src={process.env.REACT_APP_API_BASE_IMG_URL + profileImg}
          alt={"User Avatar"}
          fallbackSrc={fallBackAvatar}
        />

        <Stack mt={8} direction={"column"} spacing={3}>
          <Button onClick={onOpen} colorScheme="green" variant="outline">
            Change Profile Picture
          </Button>

          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Upload Picture</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <FormControl isInvalid={errors.image && touched.image ? true : false}>
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
                      accept=".png,.jpg,.gif"
                    />
                    <FormErrorMessage fontSize="sm">{errors.image}</FormErrorMessage>
                    <FormHelperText mt={6}>
                      File Size: 1MB (Megabyte) maximum. File extension that are accepted: .JPG
                      .JPEG .PNG .GIF
                    </FormHelperText>
                  </FormControl>
                </form>
              </ModalBody>
              <ModalFooter gap={4}>
                <Button variant="link" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  isDisabled={
                    (errors.image && touched.image) || values.image === undefined ? true : false
                  }
                  type="submit"
                  onClick={onBtnUpdate}
                  colorScheme="green"
                >
                  Update
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      </Flex>
    </Box>
  );
}

export default ProfileCard;
