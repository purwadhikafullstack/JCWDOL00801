import { Box, Button, Container, FormLabel, Heading, Stack, VStack } from "@chakra-ui/react";
import { FormControl, Select, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CalendarDateRange from "./CalendarDateRange";
import { SearchIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { Select as Select2 } from "chakra-react-select";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CalendarSearchBook from "./CalendarSearchBook";

function LandingSearchForm(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [province, setProvince] = React.useState([]);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [provinceLabel, setProvinceLabel] = useState("");
  const [cityLabel, setCityLabel] = useState("");
  const [city, setCity] = React.useState([]);

  const getProvinceData = async () => {
    try {
      let response = await Axios.get(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );

      const provinceOption = response.data.map((val, idx) => {
        return { value: val.id, label: val.name };
      });
      setProvince(provinceOption);
    } catch (error) {
      console.log(error);
    }
  };
  const selectProvinceHandler = (e, triggeredAction) => {
    if (triggeredAction.action === "clear") {
      setCity([]);
      return setSelectedProvince("");
    }
    setSelectedProvince(e.value);
    setProvinceLabel(e.label);
  };
  const setCityHandler = (e, triggeredAction) => {
    if (triggeredAction.action === "clear") {
      return setSelectedCity("");
    }
    setSelectedCity(e.value);
    setCityLabel(e.label);
  };
  const getCityData = async () => {
    if (province.length !== 0) {
      try {
        let response = await Axios.get(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`
        );
        const cityOption = response.data.map((val, idx) => {
          return { value: val.id, label: val.name };
        });
        setCity(cityOption);
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
              <Select2
                isClearable
                isSearchable
                maxMenuHeight={200}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                options={province}
                placeholder="Select province"
                onChange={(e, triggeredAction) => selectProvinceHandler(e, triggeredAction)}
              ></Select2>
            </FormControl>
            {city.length > 0 ? (
              <FormControl>
                <FormLabel>City</FormLabel>
                <Select2
                  isClearable
                  isSearchable
                  maxMenuHeight={200}
                  options={city}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder="Select city"
                  onChange={(e, triggeredAction) => {
                    setCityHandler(e, triggeredAction);
                  }}
                ></Select2>
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
              <CalendarSearchBook />
            </Box>
            <Box>
              <Button
                leftIcon={<SearchIcon />}
                minW="50%"
                colorScheme="green"
                onClick={() => {
                  navigate(`/search`, {
                    replace: true,
                    state: {
                      province: provinceLabel,
                      city: cityLabel,
                      defaultProvince: selectedProvince,
                      defaultCity: selectedCity,
                    },
                  });
                }}
              >
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
