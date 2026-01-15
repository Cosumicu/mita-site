"use client";

import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../search/SearchBar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const path = pathname === "/" || pathname === "/s";

  return (
    <div className="bg-secondary">
      {path && (
        <div className="ui-container">
          <div>
            <SearchBar />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
