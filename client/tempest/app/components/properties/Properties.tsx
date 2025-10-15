'use client';
import React from "react";
import PropertyList from "./PropertyList";

function Properties() {
  return (
    <div className="pl-4 pr-0 sm:px-4 md:px-8 lg:px-12 mt-5">
      <PropertyList label="Label 1" location="china" />
    </div>
  );
}

export default Properties;