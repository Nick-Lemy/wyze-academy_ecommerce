import { SearchIcon } from "lucide-react";
import React from "react";

interface SearchProductsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (value: string) => void;
}

const SearchProducts = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
}: SearchProductsProps) => {
  return (
    <div className="relative flex items-center justify-between">
      <div className="flex gap-4">
        <div className=" border-primary/50 border rounded-xl px-3 bg-primary-hover">
          <select
            className="p-2 text-white bg-transparent outline-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="headphones">Headphones</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="watches">Watches</option>
          </select>
        </div>
        <div className=" border-primary/50 border rounded-xl px-3 bg-primary-hover">
          <select
            className="p-2 text-white bg-transparent outline-none cursor-pointer"
            value={selectedPriceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="51-200">$51 - $200</option>
            <option value="201-500">$201 - $500</option>
            <option value="501-1000">$501 - $1000</option>
            <option value="1000+">$1000+</option>
          </select>
        </div>
      </div>
      <div className="w-1/4">
        <div className="relative flex flex-1 text-[16px] items-center justify-end">
          <input
            className="border focus:ring-2 focus:ring-primary w-full pl-10 border-primary rounded-xl p-2 outline-none"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <SearchIcon className="absolute left-0 inline-block ml-2 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
