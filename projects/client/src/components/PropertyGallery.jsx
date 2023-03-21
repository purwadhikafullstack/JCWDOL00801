import { Hide, Show } from "@chakra-ui/react";
import React, { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
// import bannerImage from "../assets/landingBanner";

function PropertyGallery(props) {
  //   const images = bannerImage.map((image, idx) => {
  //     return {
  //       original: image,
  //       thumbnail: image,
  //       originalClass: "gallery-img",
  //       thumbnailClass: "gallery-img-tn",
  //     };
  //   });

  const [images, setImages] = useState([
    {
      original: require("../assets/landingBanner/banner-4.jpg"),
      thumbnail: require("../assets/landingBanner/banner-4.jpg"),
      originalClass: "gallery-img",
      thumbnailClass: "gallery-img-tn",
    },
    {
      original: require("../assets/landingBanner/banner-4.jpg"),
      thumbnail: require("../assets/landingBanner/banner-4.jpg"),
      originalClass: "gallery-img",
      thumbnailClass: "gallery-img-tn",
    },
    {
      original: require("../assets/landingBanner/banner-4.jpg"),
      thumbnail: require("../assets/landingBanner/banner-4.jpg"),
      originalClass: "gallery-img",
      thumbnailClass: "gallery-img-tn",
    },
    {
      original: require("../assets/landingBanner/banner-4.jpg"),
      thumbnail: require("../assets/landingBanner/banner-4.jpg"),
      originalClass: "gallery-img",
      thumbnailClass: "gallery-img-tn",
    },
  ]);
  return (
    <>
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
        />
      </Show>
    </>
  );
}

export default PropertyGallery;
