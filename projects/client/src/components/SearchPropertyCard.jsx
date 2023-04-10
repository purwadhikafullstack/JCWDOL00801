import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormControl, Select, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import CalendarDateRange from "./CalendarDateRange";
import { SearchIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { Select as Select2, components } from "chakra-react-select";
import { useState } from "react";
import { useRef } from "react";

function SearchProperty({
  searchData,
  getData,
  cityHandler,
  provinceHandler,
  nameHandler,
  defaultProvince,
  defaultCity,
  defaultProvinceLabel,
  defaultCityLabel,
  setPage,
  setCapacityHandler
}) {
  ///search
  const [province, setProvince] = React.useState([]);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [capacity, setCapacity] = useState(0);
  const [provinceLabel, setProvinceLabel] = useState("");
  const [cityLabel, setCityLabel] = useState("");
  const [city, setCity] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggesstions, setSuggestions] = useState([]);
  const [onInputFocus, setOnInputFocus] = useState(false);
  const wrapperRef = useRef(null);
  const getProvinceData = async () => {
    try {
      let response = await Axios.get(
        "http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
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
    if (triggeredAction.action == "clear") {
      setCity([]);
      cityHandler("")
      setCityLabel("")
      setProvinceLabel("");
      provinceHandler("");
      return setSelectedProvince("");
    }
    setSelectedProvince(e.value);
    setProvinceLabel(e.label);
  };
  const setCityHandler = (e, triggeredAction) => {
    if (triggeredAction.action == "clear") {
      setCityLabel("");
      cityHandler("");
      return setSelectedCity("");
    }
    setSelectedCity(e.value);
    setCityLabel(e.label);
  };
  const getCityData = async () => {
    if (province.length !== 0 || defaultProvince) {
      try {
        let response = await Axios.get(
          `http://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`
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

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>Property Not Found</span>
      </components.NoOptionsMessage>
    );
  };
  const onChangeSearchHandler = (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = searchData.filter((val) => {
        const currentText = text.toLowerCase();
        const currentData = val.label.toLowerCase();
        return currentData.includes(currentText);
      });
    }
    nameHandler(text);
    setSuggestions(matches);
    setSearchTerm(text);
  };
  const submitHandler = () => {
    cityHandler(cityLabel);
    provinceHandler(provinceLabel);
    nameHandler(searchTerm);
    setCapacityHandler(capacity)
    setPage(0)
    getData(searchTerm, provinceLabel, cityLabel, capacity, true);
  };
  const handleClickOutside = (e) => {
    const wrap = wrapperRef;
    if (wrap.current && !wrap.current.contains(e.target)) {
      setOnInputFocus(false);
    }
  };
  useEffect(() => {
    getProvinceData();
    if (defaultProvince) {
      setSelectedProvince(defaultProvince);
      setProvinceLabel(defaultProvinceLabel);
      getCityData();
    }
    if (defaultCity) {
      setSelectedCity(defaultCity);
      setCityLabel(defaultCityLabel);
    }
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef.current]);

  useEffect(() => {
    getCityData();
  }, [selectedProvince]);
  useEffect(() => {

  }, []);

  return (
    <Container maxW="container.lg" pos="sticky" top="16px" alignSelf={"flex-start"}>
      <Box my={4} shadow="md" p="5" rounded="md">
        <Heading mb={5} size="lg">
          Search
        </Heading>
        <VStack alignItems="start" spacing={7}>
          <Flex direction="column" gap={6} minW="100%">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Box ref={wrapperRef}>
                <Input
                  placeholder="Input property name here"
                  onFocus={() => setOnInputFocus(true)}
                  value={searchTerm}
                  onChange={(e) => onChangeSearchHandler(e.target.value)}
                />
                <Flex
                  direction={"column"}
                  pos={"absolute"}
                  w="100%"
                  background={"white"}
                  zIndex={9999}
                >
                  {onInputFocus === false || suggesstions.length < 1 ? (
                    ""
                  ) : (
                    <Box
                      style={{
                        border: "1px #ccc solid",
                        borderBottomRightRadius: "4%",
                        borderBottomLeftRadius: "4%",
                      }}
                    >
                      {suggesstions
                        .map((val) => {
                          return (
                            <Text
                              tabIndex={0}
                              pl={1}
                              _hover={{ background: "#F0FFF4", cursor: "pointer" }}
                              onClick={() => {
                                nameHandler(val.label)
                                setSearchTerm(val.label);
                                setOnInputFocus(false);
                              }}
                            >
                              {val.label}
                            </Text>
                          );
                        })
                        .slice(0, 5)}
                    </Box>
                  )}
                </Flex>
              </Box>
            </FormControl>
            <FormControl>
              <FormLabel>Province</FormLabel>
              <Select2
                defaultValue={
                  defaultProvince ? { value: defaultProvince, label: defaultProvinceLabel } : null
                }
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
            {selectedProvince != "" ? (
              <FormControl>
                <FormLabel>City</FormLabel>
                <Select2
                  defaultValue={
                    defaultCity ? { value: selectedCity, label: cityLabel } : null
                  }
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
          <Stack direction={{ base: "column" }} spacing={5} alignItems={{ base: "start" }} w="100%">
            <Box minW="100%">
              <FormLabel>Date</FormLabel>
              <CalendarDateRange />
            </Box>
            <Box>
              {/* <FormLabel>Capacity</FormLabel>
              <NumberInput
                w="100px"
                defaultValue={1}
                min={1}
                max={10}
                onChange={(e) => {setCapacity(e)
                setCapacityHandler(e)
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput> */}
            </Box>
            <Box w="100%">
              <Flex direction={{ base: "column", md: "row" }}>
                <Button
                  leftIcon={<SearchIcon />}
                  w="100%"
                  colorScheme="green"
                  onClick={submitHandler}
                >
                  Search
                </Button>
              </Flex>
            </Box>
          </Stack>
        </VStack>
      </Box>
    </Container>
  );
}

export default SearchProperty;
