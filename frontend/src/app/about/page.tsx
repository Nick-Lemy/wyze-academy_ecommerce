import React from "react";
import Image from "next/image";
import Logo from "@/assets/logo.jpg";
import Breadcrumb from "@/components/Breadcrumb";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[{ label: "About Us" }]} />

        <div className="bg-white border border-gray-200 rounded p-8">
          <div className="text-center mb-8">
            <Image
              src={Logo}
              alt="Nick's Shop Logo"
              className="w-24 h-24 mx-auto mb-4 rounded"
            />
            <h1 className="text-4xl font-bold text-primary mb-4">
              About Nick&apos;s Shop
            </h1>
            <p className="text-xl text-gray-600">
              Your trusted partner in quality products
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Our Story
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Founded with a passion for bringing quality products to our
                customers, Nick&apos;s Shop has been serving the community with
                dedication and excellence. We believe that everyone deserves
                access to high-quality products at fair prices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To provide our customers with an exceptional shopping experience
                by offering carefully curated products, competitive prices, and
                outstanding customer service. We strive to build lasting
                relationships with our customers based on trust and
                satisfaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Why Choose Us?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Quality Assurance
                  </h3>
                  <p className="text-gray-700">
                    Every product is carefully selected and tested to meet our
                    high standards.
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Fast Shipping
                  </h3>
                  <p className="text-gray-700">
                    Quick and reliable delivery to get your products to you as
                    soon as possible.
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Customer Support
                  </h3>
                  <p className="text-gray-700">
                    Our friendly team is always ready to help with any questions
                    or concerns.
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Secure Shopping
                  </h3>
                  <p className="text-gray-700">
                    Your personal and payment information is always protected
                    with us.
                  </p>
                </div>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Get In Touch
              </h2>
              <p className="text-gray-700 mb-6">
                Have questions or feedback? We&apos;d love to hear from you.
              </p>
              <a
                href="/contact"
                className="inline-block bg-primary text-white px-8 py-3 rounded hover:bg-primary-hover transition font-semibold"
              >
                Contact Us
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
