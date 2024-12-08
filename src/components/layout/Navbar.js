"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import TopBar from "./TopBar";
import MiddleBar from "./MiddleBar";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 150) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Plans", path: "/plans" },
    { name: "Affiliate", path: "/affiliate" },
    { name: "Contact Us", path: "/contact" },
    { name: "Terms & Conditions", path: "/terms" },
  ];

  return (
    <div className="fixed w-full z-50">
      {!isScrolled && (
        <>
          <TopBar />
          <MiddleBar />
        </>
      )}
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.95)" : "white",
          height: isScrolled ? "64px" : "64px",
        }}
        transition={{ duration: 0.3 }}
        className="w-full shadow-2xl"
      >
        <nav className="container mx-auto shadow-t-3xl shadow-r-2xl shadow-l-2xl mb-4 px-4">
          <div className="flex justify-between items-center h-16">
            <motion.div
              animate={{
                scale: isScrolled ? 0.9 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/tdlogo.png"
                  alt="Trade Finance Logo"
                  width={isScrolled ? 60 : 60}
                  height={isScrolled ? 30 : 30}
                  className="transition-all duration-300"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden  lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`${
                    isScrolled
                      ? "text-gray-300 hover:text-red-500"
                      : "text-gray-800 hover:text-red-600"
                  } transition-colors duration-300`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between space-x-4">
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    isScrolled
                      ? "text-white border-red-500 border hover:bg-red-500"
                      : "text-red-600 border-red-600 border hover:bg-red-50"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4  pl-4 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile Navigation Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden ${
                isScrolled ? "text-white" : "text-gray-800"
              }`}
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenuAlt3 className="h-6 w-6" />
              )}
            </motion.button>
          </div>

          {/* Mobile Navigation Menu */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <>
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 rounded-md mr-4 transition-all duration-300 ${
                    isScrolled
                      ? "text-red-500 border-red-500 border hover:bg-red-500"
                      : "text-red-600 border-red-600 border hover:bg-red-50"
                  }`}
                >
                  Log In
                </Link>

                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            </div>
          </motion.div>
        </nav>
      </motion.header>
    </div>
  );
}
