// import React from "react";

// export default function Loader() {
//   return (
//     <div
//       style={{
//         width: "28px",
//         height: "28px",
//         border: "3px solid var(--border)",
//         borderTop: "3px solid var(--sidebar-active-bg)",
//         borderRadius: "50%",
//         animation: "spin 1s linear infinite",
//       }}
//     />
//   );
// }

import React from "react";
import { motion } from "motion/react";

export default function Loader() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <motion.img
        src="/logoSERVA.png"
        alt="SERVA Logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.1, 1],
          opacity: 1,
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "140px",
          height: "140px",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
