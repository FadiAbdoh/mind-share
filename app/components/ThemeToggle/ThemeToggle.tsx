"use-client";

import { useContext } from "react";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { motion } from 'framer-motion'
import { ThemeContext } from "@/app/context/ThemeContext";

export default function ThemeToggle() {

    const context = useContext(ThemeContext);
    if(!context) {
        throw new Error("ThemeToggle must be used within a ThemeProvider");
    }
    const { theme, toggleTheme } = context;

    return (
        <button 
            type="button" 
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={`w-[45px] h-[25px] rounded-full p-[4px] flex items-center cursor-pointer transition-colors duration-300 outline-none
                ${theme === "dark" ? "bg-brand-primary justify-end" : "bg-gray-300 border border-gray-100 shadow-sm justify-start"}`
            }
        >
            <motion.div 
                layout 
                // هنا نجعل الدائرة الداخلية تأخذ لون أصفر دافئ لتعبر عن الشمس في الوضع الفاتح
                className={`w-[17px] h-[17px] rounded-full shadow-sm flex items-center justify-center select-none transition-colors duration-300
                    ${theme === "dark" ? "bg-white" : "bg-[#ffb703]"}`
                }
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {theme === "dark" ? (
                    <DarkModeIcon sx={{ fontSize: '12px', color: '#1e293b' }} />
                ) : (
                    // الأيقونة بيضاء لتتناسق مع الدائرة الصفراء والكبسولة البيضاء
                    <LightModeIcon sx={{ fontSize: '12px', color: '#ffffff' }} />
                )}
            </motion.div>
        </button>
    )
}