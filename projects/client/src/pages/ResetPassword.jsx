import { Box, Input, Flex, Button, FormLabel, Heading } from "@chakra-ui/react";
import Axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";

const ResetPassword = (props) => {
  const [email, setEmail] = useState("");
  const resetHandler = async (e) => {
    e.preventDefault();
    try {
      let { data } = await Axios.post(
        process.env.REACT_APP_API_BASE_URL + "/user/reset-password",
        { email }
      );

      if (data.success) {
        Swal.fire({
          title: `${data.message}`,
          icon: "success",
          confirmButtonText: "Confirm",
          confirmButtonColor: "#48BB78",
        });
      }
    } catch (error) {
      Swal.fire({
        title: `${error.response.data.message}`,
        icon: "warning",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#48BB78",
      });
    }
  };
  return (
    <>
      <Box>
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Box
            border={"1px"}
            p={"6"}
            my={"50"}
            borderColor={"#ccc"}
            rounded={"md"}
          >
            <Box textAlign={"center"} mb={"6"}>
              <Heading>Reset Password</Heading>
            </Box>

            <form onSubmit={(e) => resetHandler(e)}>
              <FormLabel>Email: </FormLabel>
              <Input onChange={(e) => setEmail(e.target.value)} />

              <Flex justifyContent={"end"}>
                <Button
                  type="submit"
                  variant={"solid"}
                  colorScheme={"green"}
                  mt={"2"}
                >
                  Reset
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ResetPassword;
