import React from "react";
import Image from "next/image";
import Icon from "@/../public/favicon.svg";

export default function HeaderMobil() {

    return (

      <div className="relative max-w-6xl mx-auto flex items-center justify-center mt-10">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative w-9 h-9 ">
            <Image loading="lazy" src={Icon} alt="Acadia OS Logo" fill style={{ objectFit: "contain" }} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wider  ">
            Acadia OS
          </h1>
          </div>
        </div>
    )
}