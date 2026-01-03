"use client";

import Link from "next/link";
import styles from "./DesignLayout.module.css";

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      {children}
    </>
  );
}

