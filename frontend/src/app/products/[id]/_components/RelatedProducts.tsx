import { Product } from "@/app/types/products";
import ProductCard from "@/components/ProductCard";
import React from "react";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-7">
      <h2 className="text-3xl font-semibold text-primary">
        You Might Also Like
      </h2>
      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
