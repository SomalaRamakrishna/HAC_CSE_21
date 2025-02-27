import React from "react";
import { easeIn, easeInOut, motion } from "framer-motion";

import "./Loader.css"; // Import the CSS file
import { FaBook, FaBookReader, FaFish } from "react-icons/fa";


const Loader = () => {
  return (
    <div className="loader-container">
       <motion.div
        className="loader-icon"
        animate={{
          y: [0, -15, 0], // Moves smoothly up and down
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse", // Ensures a smooth bounce effect
          ease: "linear",
        }}
      >
        <FaBookReader size="50px" className="loading-anime" color="white"/>
      </motion.div>
      <motion.p
        className="loader-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loader;
