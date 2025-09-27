import ProductCard from "@/components/ProductCard";
import React from "react";
import { sampleProducts } from "@/lib/sampleData";

const HomeSection1 = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Headphones For You!</h1>
      <div className="flex flex-wrap gap-6 mt-6">
        {/* Product List Here */}
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
        {/* Example ProductCard */}
      </div>
    </div>
  );
};

export default HomeSection1;
