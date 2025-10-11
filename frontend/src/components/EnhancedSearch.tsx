import { SearchIcon, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Image from "next/image";

interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  sortOptions: Array<{
    value: string;
    label: string;
  }>;
}

interface SearchSuggestion {
  _id: string;
  title: string;
  category: string;
  image: string;
  price: number;
}

interface EnhancedSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceRangeCustomChange?: (min: number, max: number) => void;
  inStock?: boolean;
  onInStockChange?: (value: boolean) => void;
  onSearch?: (filters: Record<string, unknown>) => void;
}

const EnhancedSearch = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceRangeCustomChange,
  inStock,
  onInStockChange,
  onSearch,
}: EnhancedSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [customMinPrice, setCustomMinPrice] = useState(
    minPrice?.toString() || ""
  );
  const [customMaxPrice, setCustomMaxPrice] = useState(
    maxPrice?.toString() || ""
  );
  const [loading, setSuggestionLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load search suggestions
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      loadSearchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await fetch("/api/public/products/filters");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFilterOptions(data.filters);
        }
      }
    } catch (error) {
      console.error("Failed to load filter options:", error);
    }
  };

  const loadSearchSuggestions = async (query: string) => {
    setSuggestionLoading(true);
    try {
      const response = await fetch(
        `/api/public/products/search/suggestions?q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions);
          setShowSuggestions(data.suggestions.length > 0);
        }
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.title);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch({ search: suggestion.title });
    }
  };

  const handleApplyFilters = () => {
    const filters: Record<string, unknown> = {
      search: searchTerm,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      priceRange: selectedPriceRange !== "all" ? selectedPriceRange : undefined,
      sortBy,
      inStock,
    };

    // Add custom price range if set
    if (customMinPrice || customMaxPrice) {
      const minPriceVal = customMinPrice ? parseFloat(customMinPrice) : 0;
      const maxPriceVal = customMaxPrice ? parseFloat(customMaxPrice) : 0;

      filters.minPrice = customMinPrice ? minPriceVal : undefined;
      filters.maxPrice = customMaxPrice ? maxPriceVal : undefined;

      // Call the custom price range handler if provided
      if (onPriceRangeCustomChange && (customMinPrice || customMaxPrice)) {
        onPriceRangeCustomChange(minPriceVal, maxPriceVal);
      }
    }

    if (onSearch) {
      onSearch(filters);
    }

    setShowFilters(false);
  };

  const handleClearFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    onPriceRangeChange("all");
    onSortChange("newest");
    setCustomMinPrice("");
    setCustomMaxPrice("");
    if (onInStockChange) {
      onInStockChange(false);
    }

    if (onSearch) {
      onSearch({});
    }
  };

  const activeFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== "all") count++;
    if (selectedPriceRange !== "all") count++;
    if (customMinPrice || customMaxPrice) count++;
    if (inStock) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (e.target.value.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => {
                onSearchChange("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {loading && (
              <div className="p-3 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            )}
            {suggestions.map((suggestion) => (
              <button
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3"
              >
                <Image
                  src={suggestion.image}
                  alt={suggestion.title}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{suggestion.title}</div>
                  <div className="text-xs text-gray-500">
                    {suggestion.category} • ${suggestion.price}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Quick Filters */}
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="all">All Categories</option>
              {filterOptions?.categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              {filterOptions?.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount() > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {activeFilterCount()}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {activeFilterCount() > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="all">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="51-200">$51 - $200</option>
                <option value="201-500">$201 - $500</option>
                <option value="501-1000">$501 - $1000</option>
                <option value="1000+">$1000+</option>
              </select>
            </div>

            {/* Custom Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={customMinPrice}
                  onChange={(e) => setCustomMinPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={customMaxPrice}
                  onChange={(e) => setCustomMaxPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inStock || false}
                  onChange={(e) => onInStockChange?.(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  In stock only
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
