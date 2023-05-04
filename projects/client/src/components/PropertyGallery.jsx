import { Hide, Show } from "@chakra-ui/react";
import React, { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "../styles/imageGallery.css";
import bannerImage from "../assets/landingBanner";

function PropertyGallery(props) {
  const images = bannerImage.map((image, idx) => {
    return {
      original: image,
      thumbnail: image,
    };
  });
  const image = props.image.map(val =>{
    return {
      original: val,
      thumbnail: val
    }
  })
  return (
    <>
      <Hide above="sm" below="md">
        <ImageGallery
          items={props.image ? image : images}
          thumbnailPosition="right"
          useBrowserFullscreen={false}
          showBullets={true}
        />
      </Hide>

      <Show above="sm" below="md">
        <ImageGallery
          items={props.image ? image : images}
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
