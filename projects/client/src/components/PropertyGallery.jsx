import { Hide, Show } from "@chakra-ui/react";
import React, { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import bannerImage1 from "../assets/landingBanner/banner-1.jpg";
import bannerImage2 from "../assets/landingBanner/banner-2.jpg";
import bannerImage3 from "../assets/landingBanner/banner-3.jpg";
import bannerImage4 from "../assets/landingBanner/banner-4.jpg";
import "../styles/imageGallery.css"

function PropertyGallery(props) {
  const [bannerImage, setBannerImage] = useState([bannerImage1, bannerImage2, bannerImage3, bannerImage4])
  const images = bannerImage.map((image, idx) => {
    return {
      original: image,
      thumbnail: image,
    };
  });
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
          additionalClass="simple-border"
        />
      </Show>
    </>
  );
}

export default PropertyGallery;
