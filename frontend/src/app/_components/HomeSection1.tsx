import ProductCard from "@/components/ProductCard";
import React from "react";
import { sampleProducts } from "@/lib/sampleData";
import SearchProducts from "./SearchProducts";

const HomeSection1 = () => {
  return (
    <div className="space-y-7">
      <div>
        <SearchProducts />
      </div>
      <h1 className="text-3xl font-semibold">Headphones For You!</h1>
      <div className="flex flex-wrap gap-6 mt-6">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default HomeSection1;
