import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LOGO from "../assets/LOGO3.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

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
   <div className="relative overflow-hidden">
  {/* Main blue gradient navbar */}
  <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-2 px-6">
    {/* Decorative accent line */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-spice-primary via-yellow-400 to-spice-primary"></div>
    
    <div className="container mx-auto">
      <div className="flex flex-wrap justify-between items-center">
        {/* Contact Info */}
        <div className="flex items-center space-x-4 text-sm">
          <a href="tel:+919922990829" className="flex items-center hover:text-yellow-300 transition-colors">
            <FaPhone className="mr-1 text-xs text-yellow-300" />
            <span className="hidden sm:inline text-white">+91 9922990829</span>
          </a>
          <a href="mailto:info@briskwellinternational.com" className="flex items-center hover:text-yellow-300 transition-colors">
            <FaEnvelope className="mr-1 text-xs text-yellow-300" />
            <span className="hidden sm:inline text-white">info@briskwellinternational.com</span>
          </a>
          <div className="hidden md:flex items-center">
            <FaMapMarkerAlt className="mr-1 text-xs text-yellow-300" />
            <span className="text-gray-100">A602, Lotus Sanskruti, Malawalenager 2, Kiwale, Pune-412101</span>
          </div>
        </div>
       {/* Enhanced Social Media Icons */}
<div className="flex items-center space-x-4 relative z-10">
  <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-gray-700 to-black shadow-lg hover:from-gray-600 hover:to-gray-900 transition-all duration-300 group border border-gray-600">
    <FaWhatsapp className="text-gray-200 group-hover:text-yellow-300 transition-colors text-sm" />
  </a>
  <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-gray-700 to-black shadow-lg hover:from-gray-600 hover:to-gray-900 transition-all duration-300 group border border-gray-600">
    <FaFacebookF className="text-gray-200 group-hover:text-yellow-300 transition-colors text-sm" />
  </a>
  <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-gray-700 to-black shadow-lg hover:from-gray-600 hover:to-gray-900 transition-all duration-300 group border border-gray-600">
    <FaInstagram className="text-gray-200 group-hover:text-yellow-300 transition-colors text-sm" />
  </a>
  <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-gray-700 to-black shadow-lg hover:from-gray-600 hover:to-gray-900 transition-all duration-300 group border border-gray-600">
    <FaLinkedinIn className="text-gray-200 group-hover:text-yellow-300 transition-colors text-sm" />
  </a>
</div>
        
        {/* Slanted white section after the address */}
        <div className="absolute top-0 h-full transform -skew-x-45 bg-white right-0 w-1/4"></div>
      </div>
    </div>
  </div>
</div>

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
              
              {/* Contact Info for Mobile - with same styling as top stripe */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <a href="tel:+919922990829" className="flex items-center text-blue-900 hover:text-blue-700">
                  <FaPhone className="mr-2 text-yellow-500" /> +91 9922990829
                </a>
                <a href="mailto:info@briskwellinternational.com" className="flex items-center text-blue-900 hover:text-blue-700">
                  <FaEnvelope className="mr-2 text-yellow-500" /> info@briskwellinternational.com
                </a>
                <div className="flex items-center text-blue-900">
                  <FaMapMarkerAlt className="mr-2 flex-shrink-0 text-yellow-500" /> 
                  <span>A602, Lotus Sanskruti, bldg 2, Malawalenager 2, Mukai chowk,Ravet- Kiwale, Pune-412101</span>
                </div>
                
                {/* Social Media for Mobile - styled as circular buttons */}
                <div className="flex items-center space-x-3 pt-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 hover:bg-blue-600 text-white">
                    <FaFacebookF size={14} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 hover:bg-blue-500 text-white">
                    <FaTwitter size={14} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 hover:bg-pink-600 text-white">
                    <FaInstagram size={14} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 hover:bg-blue-600 text-white">
                    <FaLinkedinIn size={14} />
                  </a>
                  <a href="https://wa.me/9922990829" target="_blank" rel="noopener noreferrer" 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 hover:bg-green-600 text-white">
                    <FaWhatsapp size={14} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
