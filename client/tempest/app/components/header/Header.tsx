"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/Navbar";
import SearchSection from "../search/SearchSection";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-secondary">
      <div className="ui-container">
        <Navbar></Navbar>
      </div>
    </header>
  );
};

export default Header;
