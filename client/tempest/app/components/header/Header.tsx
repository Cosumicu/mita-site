"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../navbar/Navbar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-secondary">
      <div className="ui-container">
        <Navbar></Navbar>
      </div>
    </header>
  );
};

export default Header;
