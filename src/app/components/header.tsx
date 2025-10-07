import Link from "next/link";
import React from "react";
import Image from "next/image";
import Icon from "@/../public/favicon.svg";

const Header = ({ value }: { value: string }) => {
  return (
    <div className="w-full flex items-center justify-center lg:px-0 px-4" style={{background:"var(--bg-primary)"}}>
      <div className="relative max-w-5xl w-full flex items-center justify-between panel rounded-2xl px-6 py-3 transition-shadow duration-300">
        {/* Logo & Title */}
        <div className="flex gap-3 items-center">
          <Image loading="lazy" src={Icon} width={30} height={30} alt="Acadia OS Logo" />
          <h1 className="text-lg font-bold tracking-wide text-default hover:text-active transition-colors duration-200 cursor-pointer">
            Acadia OS
          </h1>
        </div>

        {/* Button */}
        {value !== "root" ? (
          <Link href="/" className="px-4 py-2 rounded-full font-semibold btn-accent hover-glow apply-hover-scale">Back</Link>
        ) : (
          <Link href="/auth/login" className="px-4 py-2 rounded-full font-semibold btn-accent hover-glow apply-hover-scale">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
