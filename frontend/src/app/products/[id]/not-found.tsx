import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 bg-white rounded-2xl p-12">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold text-primary-hover">
          Product Not Found
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the product you&apos;re looking for. It
          may have been removed or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button variant="default" size="sm">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
