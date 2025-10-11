"use client";
import { Order, OrderStatus } from "@/app/types/user";
import { Button } from "@/components/ui/Button";
import {
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface OrdersSectionProps {
  orders: Order[];
}

const OrdersSection = ({ orders }: OrdersSectionProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: ClockIcon,
      color: "text-yellow-800",
      bgColor: "bg-yellow-100",
    },
    processing: {
      label: "Processing",
      icon: PackageIcon,
      color: "text-blue-800",
      bgColor: "bg-blue-100",
    },
    shipped: {
      label: "Shipped",
      icon: TruckIcon,
      color: "text-purple-800",
      bgColor: "bg-purple-100",
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircleIcon,
      color: "text-primary",
      bgColor: "bg-green-100",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircleIcon,
      color: "text-red-800",
      bgColor: "bg-red-100",
    },
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Orders</h2>
        <p className="text-gray-600">View and track your orders</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-4 py-1.5 rounded-md font-semibold  ${
            selectedStatus === "all"
              ? "bg-primary text-white"
              : "border text-primary"
          }`}
        >
          All ({orders.length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter(
            (order) => order.status === status
          ).length;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as OrderStatus)}
              className={`px-4 py-1.5 rounded-md font-semibold  ${
                selectedStatus === status
                  ? "bg-primary text-white"
                  : "border text-primary"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 rounded-xl">
            {/* <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" /> */}
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedStatus === "all"
                ? "You haven't placed any orders yet"
                : `No ${selectedStatus} orders`}
            </p>
            <Link href="/">
              <Button variant="default" size="sm">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded p-6"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-primary">
                        {order.orderNumber}
                      </h3>
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          statusConfig[order.status].bgColor
                        } ${statusConfig[order.status].color}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                      {order.deliveryDate && (
                        <>
                          {" "}
                          • Delivery:{" "}
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-hover">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-primary-hover/15 p-3 rounded-sm"
                    >
                      <Image
                        src={item.productImage}
                        alt={item.productTitle}
                        width={60}
                        height={60}
                        className="object-contain bg-white rounded"
                      />
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-semibold text-primary hover:text-primary-hover"
                        >
                          {item.productTitle}
                        </Link>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrdersSection;
