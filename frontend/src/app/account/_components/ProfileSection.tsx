"use client";
import { User } from "@/app/types/user";
import { Button } from "@/components/ui/Button";
import { MailIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ProfileSectionProps {
  user: User;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    console.log("Saving user data:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Profile</h2>
      </div>
      <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
        <div className=" rounded-full flex items-center justify-center">
          <Image
            src={
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt="Profile"
            width={500}
            height={500}
            className="rounded-full w-15 h-15 object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary">
            {formData.firstName} {formData.lastName}
          </h3>
          <p className="text-[14px] text-gray-600">
            Member since {new Date(formData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-primary-hover" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-primary-hover" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Shipping Address
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Street Address
            </label>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-primary-hover" />
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Country
            </label>
            <input
              type="text"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-t border-gray-200 pt-6">
        <Button variant="default" size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileSection;
