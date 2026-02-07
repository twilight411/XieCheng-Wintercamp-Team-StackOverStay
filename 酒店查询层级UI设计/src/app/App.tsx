import React, { useState } from "react";
import { HomeView } from "./views/HomeView";
import { ListView } from "./views/ListView";
import { DetailView } from "./views/DetailView";
import { Hotel } from "./types";
import { motion, AnimatePresence } from "motion/react";

type Page = "home" | "list" | "detail";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleSearch = (searchParams: any) => {
    console.log("Searching with:", searchParams);
    navigateTo("list");
  };

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    navigateTo("detail");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentPage === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HomeView onSearch={handleSearch} />
          </motion.div>
        )}

        {currentPage === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ListView 
              onBack={() => navigateTo("home")} 
              onSelectHotel={handleSelectHotel} 
            />
          </motion.div>
        )}

        {currentPage === "detail" && selectedHotel && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <DetailView 
              hotel={selectedHotel} 
              onBack={() => navigateTo("list")} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
