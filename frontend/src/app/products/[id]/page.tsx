import { sampleProducts } from "@/lib/sampleData";
import { notFound } from "next/navigation";
import ProductImageGallery from "./_components/ProductImageGallery";
import ProductDetails from "./_components/ProductDetails";
import RelatedProducts from "./_components/RelatedProducts";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = sampleProducts.find((p) => p.id.toString() === params.id);

  if (!product) {
    notFound();
  }

  // Get related products (exclude current product)
  const relatedProducts = sampleProducts.filter((p) => p.id !== product.id);

  return (
    <main className="space-y-10 my-5">
      <div className="bg-white rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ProductImageGallery images={product.images || [product.image]} />
          <ProductDetails product={product} />
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
