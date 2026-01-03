"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on design page (it has its own navbar)
  if (pathname === "/design") {
    return null;
  }

  return (
    <header className="fixed top-5 left-1/2 transform -translate-x-1/2 z-30">
      <nav className="flex gap-8 items-center justify-center px-4 py-2">
        <a className="text-sm uppercase tracking-wider text-gray-300 hover:text-white" href="#hero">Home</a>
        <a className="text-sm uppercase tracking-wider text-gray-300 hover:text-white" href="#intro">Intro</a>
        <a className="text-sm uppercase tracking-wider text-gray-300 hover:text-white" href="#projects">Projects</a>
        <Link className="text-sm uppercase tracking-wider text-gray-300 hover:text-white" href="/design">Design</Link>
        <a className="text-sm uppercase tracking-wider text-gray-300 hover:text-white" href="#contact">Contact</a>
      </nav>
    </header>
  );
}





