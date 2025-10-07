"use client";
import { User } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { MailIcon, MapPinIcon, UserIcon as UserIconLucide } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/lib/api/auth";
import { AxiosError } from "axios";

interface ProfileSectionProps {
  user: User;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
  });

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      alert("Profile updated successfully!");
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Update failed. Please try again.";
      alert(errorMessage);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
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
          <p className="text-[14px] text-gray-600">{user.email}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              First Name
            </label>
            <div className="flex items-center gap-2">
              <UserIconLucide className="h-5 w-5 text-primary-hover" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Last Name
            </label>
            <div className="flex items-center gap-2">
              <UserIconLucide className="h-5 w-5 text-primary-hover" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary mb-2">
              Email Address (Read Only)
            </label>
            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-primary-hover" />
              <input
                type="email"
                value={user.email}
                disabled
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-primary mb-4">Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Full Address
            </label>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-primary-hover" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-t border-gray-200 pt-6">
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSection;
