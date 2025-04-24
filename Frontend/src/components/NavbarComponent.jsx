import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LOGO from "../assets/LOGO3.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

// Navigation items
const NavLinks = React.memo(({ items, location, hovered, setHovered }) => {
  return items.map((item, idx) => (
    <Link
      key={`link-${idx}`}
      to={item.link}
      onMouseEnter={() => setHovered(idx)}
      onMouseLeave={() => setHovered(null)}
      className={`relative px-4 py-2 font-body font-medium transition-all duration-300 ${
        location.pathname === item.link
          ? "text-black font-semibold border-2 border-spice-primary rounded-md"
          : "text-black hover:text-black"
      }`}
    >
      {(location.pathname === item.link || hovered === idx) && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 -z-10 h-full w-full rounded-md bg-gray-100"
        />
      )}
      <span className="relative z-10">{item.name}</span>
    </Link>
  ));
});

export default function NavbarComponent() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { name: t("navbar.home"), link: "/" },
    { name: t("navbar.aboutUs"), link: "/aboutus" },
    { name: t("navbar.products"), link: "/products" },
    { name: t("navbar.services"), link: "/services" },
    { name: t("navbar.certification"), link: "/certification" },
    { name: t("navbar.gallery"), link: "/gallery" },
    { name: t("navbar.contactUs"), link: "/contactus" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 w-full">
      {/* Desktop Navigation - Full width with no vertical padding */}
      <div className="w-full bg-white shadow-md">
        <div className="w-full px-6">
          <div className="hidden lg:flex justify-between items-center h-20">
            <Link to="/" className="flex items-center z-20 relative h-full py-0">
              <img
                src={LOGO}
                alt="Briskwell Logo"
                className="h-20 object-contain py-0"
              />
            </Link>

            <nav className="flex items-center">
              <div className="flex items-center space-x-0">
                <NavLinks
                  items={navItems}
                  location={location}
                  hovered={hovered}
                  setHovered={setHovered}
                />
              </div>

              <div className="flex items-center ml-4">
                <LanguageSwitcher />
              </div>
              <Link
                to="/contactus"
                className="ml-4 rounded-md px-6 py-2.5 font-body font-medium transition-all blue-gradient text-white shadow-blue-glow hover:shadow-glossy-hover"
              >
                {t("navbar.getQuote")}
              </Link>
            </nav>
          </div>

          {/* Mobile Navigation - Full width with no vertical padding */}
          <div className="flex lg:hidden justify-between items-center h-16">
            <Link to="/" className="flex items-center h-full py-0">
              <img
                src={LOGO}
                alt="Briskwell Logo"
                className="h-25 object-contain py-5"
              />
            </Link>

            <button
              className="p-2 rounded-md text-black"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white shadow-md"
          >
            <div className="p-4 space-y-1 px-6">
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  to={item.link}
                  className={`block px-4 py-3 rounded-md text-base font-medium ${
                    location.pathname === item.link
                      ? "bg-gray-200 text-black"
                      : "text-black hover:bg-gray-200"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex justify-center my-3">
                <LanguageSwitcher />
              </div>
              <Link
                to="/contactus"
                className="block w-full mt-3 px-4 py-3 rounded-md text-base font-medium text-center text-white blue-gradient shadow-blue-glow"
                onClick={() => setIsOpen(false)}
              >
                {t("navbar.getQuote")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
