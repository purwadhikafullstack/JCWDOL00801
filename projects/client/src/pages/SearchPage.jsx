import Axios from "axios";
import { Box, Button, Flex, IconButton, Text, VStack, filter } from "@chakra-ui/react";
import SearchProperty from "../components/SearchPropertyCard";
import SearchCard from "../components/SearchCard";
import ReactPaginate from "react-paginate";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { clearAllDate } from "../actions/dateAction";

const SearchPage = (props) => {
  const location = useLocation();
  const [propertyData, setPropertyData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [city, setCurrentCity] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [sortData, setSortData] = useState("");
  const [desc, setDesc] = useState(true);
  const [pageMessage, setPageMessage] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const { startDate, endDate } = useSelector((state) => {
    return { startDate: state.dateReducer.startDate, endDate: state.dateReducer.endDate };
  });
  const getPropertyData = async (name, province, city, capacity, paging) => {
    let url = `/search?limit=${limit}&page=${page}`;
    let reqQuery = "";
    if (sortData) {
      if (desc) {
        reqQuery += `&sortby=${sortData}&order=desc`;
      } else {
        reqQuery += `&sortby=${sortData}`;
      }
    }
    if (paging) {
      reqQuery += `&paging=${0}`;
    }
    if (filterName || name) {
      reqQuery += `&name=${filterName}`;
    }
    if (filterProvince || province || (location.state != null && location.state.province) ) {
      reqQuery += `&province=${province || filterProvince}`;
    }
    if (filterCity || city || (location.state != null && location.state.city != null)) {
      reqQuery += `&city=${city || filterCity}`;
    }
    if (filterCapacity || capacity) {
      reqQuery += `&capacity=${capacity || filterCapacity}`;
    }
    console.log(reqQuery)
    try {
      let response = await Axios.post(process.env.REACT_APP_API_BASE_URL + url + reqQuery, {
        startDate,
        endDate,
      });
      setPropertyData(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
      if (response.data.options) {
        setSearchData(
          response.data.options.map((val) => {
            return { label: val.name, value: val.id };
          })
        );
      }
    } catch (error) {
      if (error.response.status === 404) {
        setPropertyData(error.response.data.data);
        setPage(error.response.data.page);
        setPages(error.response.data.totalPage);
        setRows(error.response.data.totalRows);
      }
      console.log(error);
    }
  };
  const handleSort = (data) => {
    setSortData(data);
    setDesc(!desc);
  };
  const provinceHandler = (e) => {
    setFilterProvince(e.label || e);
  };
  const pageHandler = (e) => {
    setPage(e);
  };
  const capacityHandler = (e) => {
    setFilterCapacity(e);
  };
  const cityHandler = (e) => {
    setFilterCity(e.label || e);
  };
  const nameHandler = (e) => {
    setFilterName(e);
  };
  const onPageChange = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setPageMessage(
        `If you can't find the data you're looking for, please try using a more specific keyword`
      );
    } else {
      setPageMessage("");
    }
  };
  useEffect(() => {
    getPropertyData();

  }, [page, pages,sortData, desc]);
  useEffect(() =>{
    if(location.state){
      if(location.state.province){
        setFilterProvince(location.state.province)
      }
      if(location.state.city){
        setFilterCity(location.state.city)
      }
      getPropertyData()
    }
  },[])
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent="center"
      style={{ margin: "20px auto" }}
      w="100%"
    >
      <Flex direction={{ base: "column", md: "row" }}>
        <Box w={{ base: "100%", md: "30%" }}>
          <SearchProperty
            searchData={searchData}
            getData={getPropertyData}
            cityHandler={cityHandler}
            provinceHandler={provinceHandler}
            nameHandler={nameHandler}
            setPage={pageHandler}
            setCapacityHandler={capacityHandler}
            defaultProvince = {location.state == null? "" : location.state.defaultProvince ? location.state.defaultProvince : ""}
            defaultProvinceLabel = {location.state == null? "" :location.state.province? location.state.province:""}
            defaultCity = {location.state == null? "" :location.state.defaultCity? location.state.defaultCity:""}
            defaultCityLabel = {location.state == null? "" :location.state.city? location.state.city:""}
          />
        </Box>
        <Box w={{ base: "100%", md: "800px" }} ml={2} mr={2} mb={4}>
          <Flex
            pt={1}
            pb={1}
            mt={2}
            mb={4}
            order={{ base: 1, md: 2 }}
            alignItems={"center"}
            shadow={"md"}
            pos={"sticky"}
            top={"0px"}
            alignSelf={"flex-start"}
            zIndex={9999}
            bg={"white"}
          >
            <Text ml={3}>Sort By:</Text>
            <Button
              rounded={"2xl"}
              variant={"ghost"}
              colorScheme="green"
              ml={2}
              onClick={() => {
                handleSort("name");
              }}
            >
              Name
            </Button>
            <Button
              rounded={"2xl"}
              variant={"ghost"}
              colorScheme="green"
              ml={2}
              onClick={() => {
                handleSort("price");
              }}
            >
              Price
            </Button>
          </Flex>
          <VStack w="100%" gap={3}>
            {propertyData.length > 0 ? (
              propertyData.map((val, idx) => {
                return <SearchCard data={val} key={idx} />;
              })
            ) : (
              <Text>DATA NOT FOUND</Text>
            )}
          </VStack>
          <Flex>
            <Text>
              Page: {rows ? page + 1 : 0} of {pages}
            </Text>
          </Flex>
          <nav key={rows}>
            <ReactPaginate
              previousLabel={
                <IconButton
                  isDisabled={pages != 0 ? page === 0 : true}
                  variant="outline"
                  colorScheme="green"
                  icon={<ArrowLeftIcon />}
                />
              }
              nextLabel={
                <IconButton
                  isDisabled={pages != 0 ? page + 1 === pages : true}
                  variant="outline"
                  colorScheme="green"
                  icon={<ArrowRightIcon />}
                />
              }
              pageCount={Math.min(10, pages)}
              onPageChange={onPageChange}
              containerClassName={"pagination-container"}
              pageLinkClassName={"pagination-link"}
              previousLinkClassName={"pagination-prev"}
              nextLinkClassName={"pagination-next"}
              activeLinkClassName={"pagination-link-active"}
              disabledLinkClassName={"pagination-link-disabled"}
            />
          </nav>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SearchPage;
