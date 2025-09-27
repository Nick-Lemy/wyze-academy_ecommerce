import { Button } from "@/components/ui/Button";
import Image from "next/image";
import React from "react";
import HeroImage from "@/assets/hero-image.png";

const Hero = () => {
  return (
    <div className=" bg-secondary rounded-2xl flex items-center justify-start px-10 my-5">
      <div className="space-y-6 flex-1">
        <h1 className="text-7xl text-primary font-semibold">
          Grab Upto 50% Off On Selected Items on the store
        </h1>
        <Button variant="default" size="xs" className="mt-4">
          Shop Now
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Image
          src={HeroImage}
          className="object-cover"
          alt="Hero Image"
          layout="responsive"
        />
      </div>
    </div>
  );
};

export default Hero;
