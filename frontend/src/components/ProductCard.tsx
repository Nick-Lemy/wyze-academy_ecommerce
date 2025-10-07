"use client";
import { Product } from "@/app/types/products";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/Button";
import { HeartIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavorite, addToCart } from "@/lib/api/products";
import { AxiosError } from "axios";

type ProductCardProps = Pick<
  Product,
  | "id"
  | "title"
  | "miniTitle"
  | "rating"
  | "price"
  | "image"
  | "isInFavorites"
  | "isInCart"
>;

const ProductCard = ({
  id,
  title,
  miniTitle,
  rating,
  price,
  image,
  isInFavorites,
  isInCart,
}: ProductCardProps) => {
  const queryClient = useQueryClient();

  // Toggle favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavorite(String(id), isInFavorites || false),
    onSuccess: () => {
      // Invalidate queries to refetch user profile and products
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update favorites";
      alert(errorMessage);
    },
  });

  // Add to cart mutation
  const cartMutation = useMutation({
    mutationFn: () => addToCart(String(id)),
    onSuccess: () => {
      // Invalidate queries to refetch user profile
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      alert("Product added to cart!");
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add to cart";
      alert(errorMessage);
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cartMutation.mutate();
  };

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
        <button
          onClick={handleFavoriteClick}
          disabled={favoriteMutation.isPending}
        >
          <HeartIcon
            className={`absolute size-6.5 stroke-1.5 top-2 right-2 text-green-700 cursor-pointer hover:scale-110 transition ${
              isInFavorites && "fill-green-700"
            } ${favoriteMutation.isPending && "opacity-50"}`}
          />
        </button>
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
          onClick={handleAddToCart}
          disabled={cartMutation.isPending || isInCart}
          size={"xs"}
          variant={"outline"}
          className="mt-4 w-fit rounded-full transition"
        >
          {cartMutation.isPending
            ? "Adding..."
            : isInCart
            ? "In Cart"
            : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
