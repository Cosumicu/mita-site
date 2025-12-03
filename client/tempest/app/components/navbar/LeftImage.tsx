import React from "react";

function LeftImage() {
  return (
    <div className="hidden sm:inline-block">
      <a href="/">
        <div className="text-2xl whitespace-nowrap">
          <span className="text-2xl">
            Mita{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(135deg, black 50%, #7289DA 50%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Site
            </span>
          </span>
        </div>
      </a>
    </div>
  );
}

export default LeftImage;
