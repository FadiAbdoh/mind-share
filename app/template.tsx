"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
    return (
        <motion.div
            // تبدأ الصفحة منزاحة للأسفل، أصغر قليلاً، مع غشاوة (Blur)
            initial={{
                opacity: 0,
                y: 28,
                scale: 0.98,
                filter: "blur(8px)"
            }}
            // تتحرك للحجم الطبيعي، بدون غشاوة، وبشفافية كاملة
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)"
            }}
            // انتقال سلس وسريع مع لمسة فيزيائية مرنة
            transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1], // منحنى Cubic-Bezier فخم وفوري
            }}
        >
            {children}
        </motion.div>
    );
}