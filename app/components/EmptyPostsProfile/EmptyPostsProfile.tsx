
import { FileText, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function EmptyPostsProfile() {
    return (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-main">
                You haven`t written any stories yet
            </h3>
            <p className="text-xs sm:text-sm text-text-soft max-w-sm mx-auto">
                Share your thoughts, tutorials, or experiences with everyone now.
            </p>
            <Link
                href="/writePost"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white text-xs font-semibold shadow-xs transition-colors"
            >
                <PlusCircle className="w-4 h-4" />
                <span>Write your first story</span>
            </Link>
        </div>
    )
}