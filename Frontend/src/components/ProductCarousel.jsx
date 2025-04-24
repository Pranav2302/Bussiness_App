import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Carousel } from "./ui/carousel";

export function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const productSlides = [
    {
      title: "Indian Spices",
      // title: t("products.carousel.spices"),
      // button: t("products.carousel.view"),
      button: "View details",
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1745471626/Business_App/cggr2xbzycionjitpzbk.jpg",
      category: "Indian-spices",
    },

    {
      title: "Pulses",
      button: "View details",
      // title: t("products.carousel.feed"),
      // button: t("products.carousel.view"),
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1745472107/Business_App/jee3u9uk23oej3aia4dl.jpg",
      category: "pulses",
    },
    {
      title: "Fruits",
      button: "View details",
      // title: t("products.carousel.feed"),
      // button: t("products.carousel.view"),
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1745473364/Business_App/wyrabeglzez1aftklfej.jpg",
      category: "fruits",
    },
    {
      title: "Feed Material",
      button: "View details",
      // title: t("products.carousel.jaggery"),
      // button: t("products.carousel.view"),
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1745473949/Business_App/osruhszwvk92sx8omjpf.jpg",
      category: "feed-material",
    },

    {
      title: "Sugar",
      button: "View details",
      //   title: t("products.carousel.rice"),
      //   button: t("products.carousel.view"),
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1745319254/Business_App/mmzk976d325c0jz5jydl.jpg",
      category: "jaggery",
    },

    {
      title: "Grains",
      button: "View details",
      // title: t("products.carousel.rice"),
      // button: t("products.carousel.view"),
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1745474051/Business_App/rjgjfhvsv45kdzwm7cjm.jpg",
      category: "grains",
    },
    {
      title: "Fresh Vegetables",
      button: "View details",
      // title: t("products.carousel.rice"),
      // button: t("products.carousel.view"),
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1744303070/Business_App/if7fmackdd34uy6guyys.jpg",
      category: "vegetables",
    },
    {
      title: "Exotic Fruits",
      button: "View details",
      // title: t("products.carousel.rice"),
      // button: t("products.carousel.view"),
      src: "https://res.cloudinary.com/doxrnqdwn/image/upload/v1744303070/Business_App/rnoohbyhkfxfy7ipinen.jpg",
      category: "fruits",
    },
  ];

  const handleProductClick = (category) => {
    navigate("/products", { state: { category } });
  };

  return (
    <div className="relative overflow-hidden w-full h-full py-12">
      <Carousel slides={productSlides} onSlideClick={handleProductClick} />
    </div>
  );
}
