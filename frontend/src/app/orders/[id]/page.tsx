"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/lib/api/orders";
import { getProducts } from "@/lib/api/products";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Package, Truck, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  // Fetch order details
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  // Fetch products to get details
  const { data: productData } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    enabled: !!order,
  });

  const products = productData?.products || [];

  if (orderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Button onClick={() => router.push("/account")}>
            View My Orders
          </Button>
        </div>
      </div>
    );
  }

  const orderProducts = order.products
    .map((orderProduct) => {
      const product = products.find((p) => p._id === orderProduct.productId);
      return product
        ? {
            ...product,
            quantity: orderProduct.quantity,
          }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white border border-gray-200 rounded p-8 mb-6 text-center">
          <div className="mb-4">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <div className="inline-block bg-gray-100 px-6 py-3 rounded">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-primary">
              ORD-{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white border border-gray-200 rounded p-8 mb-6">
          <h2 className="text-2xl font-bold text-primary mb-6">
            What&apos;s Next?
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">
                  Order Confirmed
                </h3>
                <p className="text-gray-600">
                  We&apos;ve received your order and will start processing it
                  soon.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">
                  Order Processing
                </h3>
                <p className="text-gray-600">
                  Your items are being prepared for shipment.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">
                  On the Way
                </h3>
                <p className="text-gray-600">
                  Your order will be shipped and on its way to you.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Home className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">
                  Delivered
                </h3>
                <p className="text-gray-600">
                  Your order will be delivered to your address.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-gray-200 rounded p-8 mb-6">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Order Details
          </h2>

          {/* Products */}
          <div className="space-y-4 mb-6">
            {orderProducts.map((product) => (
              <div
                key={product._id}
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
              >
                <Link href={`/products/${product._id}`}>
                  <Image
                    src={product.image.url}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="object-contain rounded bg-gray-50"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/products/${product._id}`}
                    className="font-semibold text-lg text-primary hover:text-primary-hover"
                  >
                    {product.title}
                  </Link>
                  <p className="text-gray-500 text-sm">{product.miniTitle}</p>
                  <p className="text-gray-600 mt-1">
                    Quantity: {product.quantity} × ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary-hover">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">
                  $
                  {(
                    order.totalPrice /
                    1.1 /
                    (order.totalPrice > 100 ? 1 : 1.1)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (10%)</span>
                <span className="font-semibold">
                  ${(order.totalPrice * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold">
                  {order.totalPrice > 100 ? "FREE" : "$10.00"}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-semibold text-lg text-primary mb-2">
              Shipping Address
            </h3>
            <p className="text-gray-600">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/account")}
            className="flex w-1/2 justify-center items-center"
            size={"xs"}
          >
            View My Orders
            <ArrowRight className="h-5 w-5 ml-3" />
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex-1 py-3 rounded font-semibold flex items-center justify-center gap-2 transition"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
