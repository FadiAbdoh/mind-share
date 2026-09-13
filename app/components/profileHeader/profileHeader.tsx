
import { motion } from "framer-motion";
import { Calendar, Edit3, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageType {
    userInfo: {
        bio: string | null,
        name: string | null,
        createdAt: string,
        image: string | null,
        email: string | null,
    },
    postsCount: number
}

export default function ProfileHeader({ userInfo, postsCount }: PageType) {

    const formattedDate = userInfo.createdAt ?
        new Date(userInfo.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : 'Recently';

    return (
        <section className="rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* user img*/}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-md flex-shrink-0 flex items-center justify-center">
                    {
                        userInfo?.image ? (
                            <Image
                                src={userInfo?.image}
                                alt={userInfo.name || "User Avatar"}
                                fill
                                priority
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                src='/def-profile-svg.svg'
                                alt="User Avatar"
                                fill
                                priority
                                className="object-cover"
                            />
                        )
                    }
                </div>

                {/* personal info*/}
                <div className="flex-1 text-center sm:text-left space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
                                {userInfo?.name || "User Name"}
                            </h1>
                            <p className="text-sm text-text-soft font-medium">
                                @{userInfo?.email?.split('@')[0]}
                            </p>
                        </div>

                        {/* زر تعديل البروفايل */}
                        <Link href="/profile/edit">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 min-h-[44px] cursor-pointer shadow-xs"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </motion.button>
                        </Link>
                    </div>

                    {/* (Bio) */}
                    <p className="text-sm md:text-base text-text-main leading-relaxed max-w-2xl">
                        {userInfo.bio || 'No bio added yet.'}
                    </p>

                    {/* email , join */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs md:text-sm text-text-soft">
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4" />
                            {userInfo?.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Joined {formattedDate}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-4 mt-5 border-t border-gray-200 dark:border-neutral-800 text-center">
                <span className="text-lg font-bold text-text-main">{postsCount}</span>
                <span className="text-xs text-text-soft ml-1.5">Published Posts</span>
            </div>
        </section>
    )
}