"use client";

import React, { useEffect, useRef, useState } from "react";
import LeftImage from "./LeftImage";
import RightMenu from "./RightMenu";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Segmented } from "antd";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const path =
    pathname === "/host/create-listing" ||
    pathname === "/host/onboarding" ||
    pathname === "/host/update-listing" ||
    pathname.startsWith("/host/update-listing/");

  const isHome = pathname === "/";

  return (
    <div>
      <div className="flex h-12 items-center justify-between gap-2">
        <LeftImage />

        {path ? (
          <div className="flex gap-4">
            <button>Help</button>{" "}
            <button onClick={() => router.push("/")}>Exit</button>
          </div>
        ) : (
          <RightMenu />
        )}
      </div>

      {!isHome ? (
        <></>
      ) : (
        <div className="max-w-full overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-block">
            <Segmented<string>
              className="!bg-secondary"
              options={[
                { label: "Stays", value: "1" },
                { label: "Experiences", value: "2" },
                { label: "Services", value: "3" },
                { label: "Flights", value: "4" },
                { label: "Attractions", value: "5" },
              ]}
              defaultValue="1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
