import React from "react";
import { Flex, Container, Heading } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import PropertyCard from "./PropertyCard";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/swiperKita.css";

function MainContent(props) {
  return (
    <Container maxW={{ base: "container", md: "container.xl" }}>
      <Heading mb="6">Recommended places for you</Heading>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        grabCursor={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        }}
        className="main-content"
        pagination={{ clickable: true, horizontalClass: "pagination-kita" }}
        modules={[Pagination]}
      >
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
        <SwiperSlide>
          <PropertyCard />
        </SwiperSlide>
      </Swiper>
    </Container>
  );
}

export default MainContent;
