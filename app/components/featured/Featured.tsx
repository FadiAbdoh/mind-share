
import Image from "next/image"
import Link from "next/link"
import prisma from '@/lib/prismadb';
import { ArrowRight, Calendar, Sparkles, TrendingUp } from "lucide-react";
import HeroHeader from "../HeroHeader/HeroHeader";


export default async function Featured() {
    
    //// (Most Popular Post)
    let featuredPost = await prisma.post.findFirst({
        orderBy: { views: 'desc' },
        include: {
            user: { select: {name: true, image: true } },
            cat: { select: { title: true } }
        },
    })

    // let featuredPost;

    //// (Fallback) most recent post
    if(!featuredPost) {
            featuredPost = await prisma.post.findFirst({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: {name: true, image: true } },
                cat: { select: { title: true } }
            },
        })
    }

    if (!featuredPost) return null;
    
    const formattedDate = new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <section>
            <HeroHeader />
            {/* the post */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50/70 dark:bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-gray-200/60 dark:border-neutral-800">
                {/* media */}
                {featuredPost.mediaUrl && (
                    <div className="lg:col-span-6 relative w-full h-[260px] sm:h-[340px] rounded-2xl overflow-hidden shadow-xs bg-neutral-100 dark:bg-neutral-800">
                        {featuredPost.mediaType === 'video' ? (
                            <video
                            src={featuredPost.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            controls
                            />
                        ) : (
                            <Image
                                src={featuredPost.mediaUrl}
                                alt={featuredPost.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        )}
                    </div>
                )}
                {/* post details */}
                <div className={`${featuredPost.mediaUrl ? 'lg:col-span-6' : 'lg:col-span-12'
                    } flex flex-col justify-center space-y-4`}>
                        {/* header */}
                        <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
                            <span 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <TrendingUp className="w-3.5 h-3.5"/>
                                Trinding Now ({featuredPost.views} views)
                            </span>
                            <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary capitalize">
                                {featuredPost.cat.title || featuredPost.catSlug}
                            </span>
                            <span className="flex items-center gap-1 text-text-soft">
                                <Calendar className="w-3.5 h-3.5" />
                                {formattedDate}
                            </span>
                        </div>
                        {/* title */}
                        <Link href={`/posts/${featuredPost.slug}`}>
                            <h2 
                            className="text-xl sm:text-2xl md:text-3xl font-bold text-text-main hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                                {featuredPost.title}
                            </h2>
                        </Link>
                        <p className="text-text-soft text-sm sm:text-base leading-relaxed line-clamp-3">
                            {featuredPost.desc}
                        </p>
                        <div className="pt-2">
                            <Link 
                            href={`/posts/${featuredPost.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-medium text-sm rounded-xl transition-all shadow-xs"
                            >
                                <span>Read Story</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                </div>
            </div>
        </section>
    ) 
}
