import React, { useEffect, useState } from "react";
import ImageSection01 from "../../../assets/ImageSection01.avif";
import ImageSection02 from "../../../assets/ImageSection02.jpg";
import ImageSection03 from "../../../assets/ImageSection03.avif";
import ImageSection04 from "../../../assets/ImageSection04.avif";
import ImageSection05 from "../../../assets/ImageSection05.jpg";
import ImageSection06 from "../../../assets/ImageSection06.avif";
import ImageSection07 from "../../../assets/ImageSection07.jpg";

const images = [ ImageSection01, ImageSection02, ImageSection03, ImageSection04, ImageSection05, ImageSection06, ImageSection07 ];

const ImageSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block lg:w-1/2 self-stretch">
      <div className="relative w-full h-full overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Men Fashion Model"
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 ease-in-out ${
              index === currentImage
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSection;
