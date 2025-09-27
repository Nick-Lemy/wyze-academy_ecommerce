"use client";
import { Product } from "@/app/types/products";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { HeartIcon, StarIcon } from "lucide-react";
import Link from "next/link";

type ProductCardProps = Pick<
  Product,
  "id" | "title" | "miniTitle" | "rating" | "price" | "image" | "isInFavorites"
>;

const ProductCard = ({
  id,
  title,
  miniTitle,
  rating,
  price,
  image,
  isInFavorites,
}: ProductCardProps) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl p-4 w-75">
      <div className="relative flex justify-center">
        <Image
          src={image}
          alt={title}
          width={200}
          height={160}
          className="object-contain"
        />
        <HeartIcon
          className={`absolute size-6.5 stroke-1.5 top-2 right-2 text-green-700 ${
            isInFavorites && "fill-green-700"
          }`}
        />
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <Link
            href={`/products/${id}`}
            className="font-semibold text-primary hover:text-primary-hover text-lg truncate w-40"
          >
            {title}
          </Link>
          <span className="font-bold text-primary-hover text-xl">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{miniTitle}</p>
        <div className="flex items-center mt-2">
          <span className="text-green-600 flex mr-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating) && "fill-green-600"
                }`}
              />
            ))}
          </span>
          <span className="text-gray-600 text-xs ml-2">({rating})</span>
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            router.push(`/products/${id}`);
          }}
          size={"xs"}
          variant={"outline"}
          className="mt-4 w-fit rounded-full  transition"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
