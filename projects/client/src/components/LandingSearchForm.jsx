import { Box, Button, Container, FormLabel, Heading, Stack, VStack } from "@chakra-ui/react";
import { FormControl, Select, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import CalendarDateRange from "./CalendarDateRange";
import { SearchIcon } from "@chakra-ui/icons";
import Axios from "axios";

function LandingSearchForm(props) {
  const [province, setProvince] = React.useState([]);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [city, setCity] = React.useState([]);

  const getProvinceData = async () => {
    try {
      let response = await Axios.get(
        "http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      setProvince(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCityData = async () => {
    if (province.length !== 0) {
      try {
        let response = await Axios.get(
          `http://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`
        );
        setCity(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getProvinceData();
  }, []);

  useEffect(() => {
    getCityData();
  }, [selectedProvince]);

  return (
    <Container maxW="container.lg">
      <Box my={4} shadow="md" p="5" rounded="md">
        <Heading mb={5} size="lg">
          Search for a place to stay
        </Heading>
        <VStack alignItems="start" spacing={7}>
          <Flex direction="column" gap={6} minW="100%">
            <FormControl>
              <FormLabel>Province</FormLabel>
              <Select
                value={selectedProvince}
                placeholder="Select province"
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                {province.map((val, idx) => {
                  return (
                    <option value={val.id} key={idx}>
                      {val.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
            {city.length !== 0 ? (
              <FormControl>
                <FormLabel>City</FormLabel>
                <Select placeholder="Select city">
                  {city.map((val, idx) => {
                    return <option key={idx}>{val.name}</option>;
                  })}
                </Select>
              </FormControl>
            ) : null}
          </Flex>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={5}
            alignItems={{ base: "start", md: "end" }}
          >
            <Box minW="100%">
              <FormLabel>Date</FormLabel>
              <CalendarDateRange />
            </Box>
            <Box>
              <Button leftIcon={<SearchIcon />} minW="50%" colorScheme="green">
                Search
              </Button>
            </Box>
          </Stack>
        </VStack>
      </Box>
    </Container>
  );
}

export default LandingSearchForm;
