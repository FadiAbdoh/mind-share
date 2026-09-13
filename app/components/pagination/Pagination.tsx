"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";


interface PaginationProps {
    page: number,
    cat?: string,
    hasPrev: boolean,
    hasNext: boolean
}

export default function Pagination({ page, cat, hasNext, hasPrev }: PaginationProps) {

    const router = useRouter();
    const handlePageChange = (newPage: number) => {
        const query = new URLSearchParams();
        query.set("page", newPage.toString())
        if(cat) query.set('cat', cat);

        router.push(`?${query.toString()}`)
    }

    return (
        <div className="flex items-center justify-between my-6">
            <motion.button
                type="button"
                disabled={!hasPrev}
                onClick={() => handlePageChange(page - 1)}
                whileHover={{ scale: hasPrev ? 1.03 : 1 }}
                whileTap={{ scale: hasPrev ? 0.97 : 1 }}
                className="flex items-center gap-1.5 capitalize bg-brand-primary text-white text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
            </motion.button>

            <span className="text-xs font-semibold text-text-soft">
                Page {page}
            </span>
            
            <motion.button
                type="button"
                disabled={!hasNext}
                onClick={() => handlePageChange(page + 1)}
                whileHover={{ scale: hasNext ? 1.03 : 1 }}
                whileTap={{ scale: hasNext ? 0.97 : 1 }}
                className="flex items-center gap-1.5 capitalize bg-brand-primary text-white text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
            </motion.button>
        </div>
    )
}

/*
<button 
                className="capitalize bg-brand-primary cursor-pointer text-white px-4 py-2 rounded-lg"
            >
                previous
            </button>
            <button
                className="capitalize bg-brand-primary cursor-pointer text-white px-4 py-2 rounded-lg"
            >
                next
            </button>

*/


