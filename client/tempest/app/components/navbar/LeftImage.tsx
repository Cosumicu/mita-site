import React from "react";
import Link from "next/link";

function LeftImage() {
  return (
    <div className="hidden sm:inline-block">
      <Link href="/">
        <h1 className="text-2xl whitespace-nowrap">Mita Site</h1>
      </Link>
    </div>
  );
}

export default LeftImage;
