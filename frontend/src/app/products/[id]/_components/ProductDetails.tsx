"use client";
import { Product } from "@/app/types/products";
import { Button } from "@/components/ui/Button";
import { HeartIcon, MinusIcon, PlusIcon, StarIcon } from "lucide-react";
import React, { useState } from "react";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(product.isInFavorites);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Price */}
      <div>
        <p className="text-gray-500 text-sm mb-2">{product.miniTitle}</p>
        <h1 className="text-4xl font-bold text-primary mb-4">
          {product.title}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-primary-hover">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center">
            <span className="text-green-600 flex mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating) && "fill-green-600"
                  }`}
                />
              ))}
            </span>
            <span className="text-gray-600 text-sm">
              ({product.rating} / 5.0)
            </span>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-primary mb-3">
          Product Description
        </h3>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Features (if available) */}
      {product.features && product.features.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-primary mb-3">
            Key Features
          </h3>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-hover mr-2">•</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-primary mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-primary rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-3 hover:bg-secondary transition"
              disabled={quantity <= 1}
            >
              <MinusIcon className="h-5 w-5 text-primary" />
            </button>
            <span className="px-6 font-semibold text-primary text-lg">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-3 hover:bg-secondary transition"
            >
              <PlusIcon className="h-5 w-5 text-primary" />
            </button>
          </div>
          <span className="text-gray-600">
            Total: ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex gap-4">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => {
              // Add to cart logic here
              console.log("Add to cart:", { product, quantity });
            }}
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="px-6"
          >
            <HeartIcon
              className={`h-5 w-5 ${isFavorite && "fill-primary-hover"}`}
            />
          </Button>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-3"
          onClick={() => {
            // Buy now logic here
            console.log("Buy now:", { product, quantity });
          }}
        >
          Buy Now
        </Button>
      </div>

      {/* Additional Info */}
      <div className="border-t border-gray-200 pt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SKU:</span>
          <span className="text-primary font-semibold">
            {product.sku || `SKU-${product.id}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Availability:</span>
          <span className="text-green-600 font-semibold">In Stock</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Category:</span>
          <span className="text-primary font-semibold">
            {product.category || "Electronics"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
