'use client';
import React from "react";
import PropertyList from "./PropertyList";

function Properties() {
  return (
    <div className="pl-4 pr-0 sm:px-4 md:px-8 lg:px-12">
      <PropertyList label="Label 1" location="china" />
      <PropertyList label="Label 2" location="china" />
      <PropertyList label="Label 3" location="china" />
    </div>
  );
}

export default Properties;
