import Axios from "axios";
import Swal from "sweetalert2";
import { Box, Button, Flex, Hide, Show, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import bannerImage1 from "../assets/landingBanner/banner-1.jpg";
import bannerImage2 from "../assets/landingBanner/banner-2.jpg";
import bannerImage3 from "../assets/landingBanner/banner-3.jpg";
import bannerImage4 from "../assets/landingBanner/banner-4.jpg";
import "../styles/imageGallery.css"
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { Select as Select2 } from "chakra-react-select";
const RoomPhoto = () =>{
    const navigate = useNavigate();
    const [propData, setPropData] = useState([]);
    const [chosenProp, setChosenPropData] = useState([]);
    const [propCity, setPropCity] = useState([]);
    const [isPropAvail, setIsPropAvail] = useState(true)
    const [bannerImage, setBannerImage] = useState([bannerImage1, bannerImage2, bannerImage3, bannerImage4])
  const images = bannerImage.map((image, idx) => {
    return {
      original: image,
      thumbnail: image,
    };
  });
  const getPropData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.get(
          process.env.REACT_APP_API_BASE_URL + "/rooms/prop-availability",
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        if (res.data.result.length > 0) {
          const optionPropData = res.data.result.map((val, idx) => {
            return { value: val.propertyId, label: val.name };
          });
          setPropData(optionPropData);
        } else {
          Swal.fire({
            icon: "error",
            title: `You have not create a property, please create it first`,
            confirmButtonText: "OK",
            confirmButtonColor: "#48BB78",
            timer: 3000,
          }).then((res) => {
            navigate("/property/new", { replace: true, state: { data: propData } });
            window.scrollTo(0, 0);
          });
        }
      }
    } catch (e) {
      console.log(e);
      setIsPropAvail(false);
    }
  };const getPropChosenData = async (e, triggeredAction) => {
    try {
      if (triggeredAction.action === "clear") {
        setPropCity(null)
        return setChosenPropData(null);
      }
      const propId = e.value;
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.get(
          process.env.REACT_APP_API_BASE_URL + `/rooms/prop-availability/find?id=${propId}`,
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        setChosenPropData(res.data.prop);
        setPropCity(res.data.category.city);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPropData();
    document.title = "Renthaven || Add Photos";
  }, []);
  return (
    <Box style={{margin: "5%"}}>
        <Box mb={4}>
            <Text fontSize="24px" fontWeight={"600"} mb={3}>Select Property</Text>
        <Select2 options={propData} isClearable isSearchable placeholder="Choose the property" onChange={(e, triggeredAction) =>{
            getPropChosenData(e, triggeredAction)
        }}></Select2>
        </Box>
      <Hide above="sm" below="md">
        <ImageGallery
          items={images}
          thumbnailPosition="right"
          useBrowserFullscreen={false}
          showBullets={true}
        />
      </Hide>

      <Show above="sm" below="md">
        <ImageGallery
          items={images}
          showThumbnails={false}
          useBrowserFullscreen={false}
          showBullets={true}
          showPlayButton={false}
          additionalClass="simple-border"
        />
      </Show>
      <Flex mt={5} align="center" justify="space-between">
          <Button
            colorScheme="gray"
            variant="ghost"
            onClick={() => navigate("/room/new", { replace: true })}
            leftIcon={<ArrowLeftIcon boxSize={3} />}
          >
            Back
          </Button>
          <Button
            type="submit"
            colorScheme="green"
          >
            Add Photo
          </Button>
        </Flex>
    </Box>
  );
}

export default RoomPhoto;