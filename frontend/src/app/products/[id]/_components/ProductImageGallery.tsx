"use client";
import Image from "next/image";
import React, { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-secondary rounded-xl p-8 flex items-center justify-center min-h-[400px]">
        <Image
          src={images[selectedImage]}
          alt="Product image"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-4 justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`bg-secondary rounded-lg p-4 transition-all hover:ring-2 hover:ring-primary ${
                selectedImage === index ? "ring-2 ring-primary" : ""
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
