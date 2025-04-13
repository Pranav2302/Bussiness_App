import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { VideoPopup } from "./components/VideoPopup";
import ChatComponent from "./components/SendbirdChat"; // Updated import
import { sendbirdConfig } from "./config/sendbird";

// Import pages
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Brochure from "./pages/Brochure";
import Certification from "./pages/Certification";
import Gallery from "./pages/Gallery";
import Products from "./pages/Products";
import ContactUs from "./pages/ContactUs";

function App() {
  // Generate a random user ID for anonymous chat or use a logged-in user's ID
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <BrowserRouter>
      <div className="bg-white min-h-screen flex flex-col">
        <NavbarComponent />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brochure" element={<Brochure />} />
            <Route path="/certification" element={<Certification />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
        {/* Add the VideoPopup component */}
        <VideoPopup />
        {/* Add the Chat component */}
        <ChatComponent 
          appId={sendbirdConfig.appId || '9EF2CDDF-4BA9-4EBE-A4D6-368DFE747047'} // Fallback to hardcoded ID if needed
          apiToken={sendbirdConfig.apiToken}
          userId={userId}
          nickname="Website Visitor"
        />
        {/* WhatsApp Button - appears on all pages */}
        <WhatsAppButton 
          phoneNumber="+919922990829" 
          message="Hello! I'm interested in your products. Can you provide more information?" 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;