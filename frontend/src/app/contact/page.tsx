"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumb items={[{ label: "Contact Us" }]} />

        <div className="bg-white border border-gray-200 rounded p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Get In Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white p-3 rounded">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      Email Us
                    </h3>
                    <p className="text-gray-600">support@nicksshop.com</p>
                    <p className="text-gray-600">info@nicksshop.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white p-3 rounded">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white p-3 rounded">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      Visit Us
                    </h3>
                    <p className="text-gray-600">123 Commerce Street</p>
                    <p className="text-gray-600">Business District, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white p-3 rounded">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Subject"
                  name="subject"
                  type="text"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:border-primary outline-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-gray-200 pt-12 mt-12">
            <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  What are your shipping policies?
                </h3>
                <p className="text-gray-700">
                  We offer free shipping on orders over $100. Standard shipping
                  takes 3-5 business days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Do you accept returns?
                </h3>
                <p className="text-gray-700">
                  Yes, we accept returns within 30 days of purchase. Items must
                  be in original condition.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  How can I track my order?
                </h3>
                <p className="text-gray-700">
                  Once your order ships, you&apos;ll receive a tracking number
                  via email to monitor your delivery.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Do you offer customer support?
                </h3>
                <p className="text-gray-700">
                  Yes, our customer support team is available during business
                  hours to assist with any questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
