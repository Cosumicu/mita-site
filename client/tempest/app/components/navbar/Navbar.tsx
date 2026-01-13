"use client";

import React, { useEffect, useRef, useState } from "react";
import LeftImage from "./LeftImage";
import RightMenu from "./RightMenu";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "/s";

  if (
    pathname === "/host/create-listing" ||
    pathname === "/host/onboarding" ||
    pathname.startsWith("/host/update-listing")
  ) {
    return null;
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-secondary p-4 sm:px-8">
        <div className="flex items-center justify-between gap-2">
          <LeftImage />
          <RightMenu />
        </div>
      </div>

      {isHome && (
        <div className="sm:px-8 bg-secondary w-full">
          <SearchBar />
        </div>
      )}
    </>
  );
};

export default Navbar;
