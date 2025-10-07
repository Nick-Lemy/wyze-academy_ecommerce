"use client";
import { notFound, useParams } from "next/navigation";
import ProductImageGallery from "./_components/ProductImageGallery";
import ProductDetails from "./_components/ProductDetails";
import RelatedProducts from "./_components/RelatedProducts";
import Breadcrumb from "@/components/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "@/lib/api/products";
import { getUserProfile } from "@/lib/api/auth";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  // Fetch product
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
  });

  // Fetch all products for related products
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Fetch user profile to get favorites and cart
  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: false,
  });

  if (isLoading) {
    return (
      <main className="space-y-10 my-5">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    notFound();
  }

  // Get related products (exclude current product, filter by category if available)
  const relatedProducts = allProducts
    .filter((p) => p._id !== product._id)
    .filter((p) => !product.category || p.category === product.category)
    .slice(0, 4);

  // Prepare images for gallery
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [product.image.url];

  return (
    <main className="space-y-10 my-5">
      <Breadcrumb
        items={[
          { label: "Products", href: "/" },
          ...(product.category
            ? [
                {
                  label: product.category,
                  href: `/?category=${product.category}`,
                },
              ]
            : []),
          { label: product.title },
        ]}
      />
      <div className="bg-white rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ProductImageGallery images={galleryImages} />
          <ProductDetails
            product={{
              id: product._id,
              title: product.title,
              miniTitle: product.miniTitle,
              description: product.description,
              price: product.price,
              rating: product.rating,
              image: product.image.url,
              images: galleryImages,
              features: product.features,
              sku: product.sku,
              isInFavorites: user?.favorites.includes(product._id) || false,
            }}
          />
        </div>
      </div>

      <RelatedProducts
        products={relatedProducts.map((p) => ({
          id: p._id,
          title: p.title,
          miniTitle: p.miniTitle,
          description: p.description,
          rating: p.rating,
          price: p.price,
          image: p.image.url,
          isInFavorites: user?.favorites.includes(p._id) || false,
        }))}
      />
    </main>
  );
}
