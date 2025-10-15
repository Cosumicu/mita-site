"use client";

import {
  HomeOutlined,
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function NavbarMobile() {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const navItems = [
    { href: "/", icon: <SearchOutlined />, label: "Explore" },
    { href: "/reservations", icon: <CalendarOutlined />, label: "Reservations" },
    { href: "/myproperties", icon: <HomeOutlined />, label: "Hosting" },
    { href: "/favorites", icon: <HeartOutlined />, label: "Favorites" },
    { href: "/profile", icon: <UserOutlined />, label: "Profile" },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center justify-center text-gray-500 hover:text-[#7289DA] transition-all duration-200",
              active === item.href && "text-[#7289DA]"
            )}
          >
            <span className="text-[22px]">{item.icon}</span>
            <span className="text-[12px] font-medium mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
