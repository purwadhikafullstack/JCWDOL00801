import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { Container, Flex, Image, Skeleton } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/swiperKita.css";
import bannerImage from "../assets/landingBanner";

function LandingBanner(props) {
  return (
    <Container px={0} maxW={{ base: "container", md: "100%" }}>
      <Swiper
        navigation={false}
        spaceBetween={0}
        modules={[Navigation, Autoplay]}
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        className="landing-banner"
      >
        {bannerImage.map((banner, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Skeleton isLoaded>
                <Image
                  height={{ base: "200px", md: "450px" }}
                  width="100%"
                  src={banner}
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/500"
                  alt="Landing Banner"
                />
              </Skeleton>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
}

export default LandingBanner;
