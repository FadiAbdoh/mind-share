import Link from "next/link";
import Image from "next/image"
import { Dot, Play } from "lucide-react";

const categoryColors: Record<string, string> = {
    coding: "bg-brand-coding",
    fashion: "bg-brand-fashion",
    food: "bg-brand-food",
    travel: "bg-brand-travel",
    culture: "bg-brand-culture",
    style: "bg-brand-style",
};

interface SidePostProps {
    withImage?: boolean,
    post: {
        catSlug: string,
        mediaType?: string | null
        mediaUrl?: string | null,
        createdAt: Date | string,
        user: { name: string | null },
        title: string,
        slug: string,
    }
}

export default function SidebarPostItem({ withImage = false, post }: SidePostProps) {

    return (
        <Link href={`/posts/${post.slug}`} className="flex items-center gap-3.5 group transition-opacity hover:opacity-95">
            {withImage && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800">
                    {post.mediaType === "video" ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <video
                                src={post.mediaUrl || ""}
                                muted
                                autoPlay
                                loop
                                playsInline
                                className="w-full h-full object-cover pointer-events-none"
                            />
                            {/* طبقة شفافة خفيفة مع أيقونة تدل على أنه فيديو */}
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                <Play className="w-4 h-4 text-white fill-white opacity-90 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                    ) : post.mediaUrl ? (
                        <Image
                            src={post.mediaUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <Image
                            src={"/def-profile-svg.svg"}
                            alt={post.user.name || "Author"}
                            fill
                            className="object-cover"
                        />
                    )}
                </div>
            )}
            <div className="flex-1 space-y-1">
                <span className={`text-[12px] uppercase tracking-wider px-2 py-0.5 rounded ${categoryColors[post.catSlug]} text-white inline-block`}>
                    {post.catSlug}
                </span>
                <h4 className="text-xs font-semibold text-text-main group-hover:text-brand-primary line-clamp-2 transition-colors">
                    {post.title}
                </h4>
                <div className="flex items-center gap-1 text-[12px] text-brand-primary">
                    <span className="font-semibold text-text-main">{post.user.name || "Auther"}</span>
                    <span><Dot /></span>
                    <span>{new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: 'numeric' })}</span>
                </div>
            </div>
        </Link>
    )
}



/*


return (
        <div aria-label='' className="flex flex-col gap-5 my-6">
            {posts.map((post) =>  
                <Link 
                href='/' 
                key={post.id} 
                aria-label={`post ${withImage ? 'with' : 'without'} image`} 
                className=" flex flex-row gap-4 items-center">
                    {
                        withImage && (
                            <div className="relative aspect-square flex-1">
                                <Image
                                    src={`${post.imgSrc}`}
                                    alt="post 1"
                                    fill
                                    className="object-cover rounded-[50%] border-3 border-solid border-gray-200" />
                            </div>
                        )}
                        <div className="flex-4 flex flex-col gap-1">
                            <span className={`${post.bgClass} w-fit py-1 px-3 rounded-xl text-white capitalize`} aria-label={`${post.category}`}>
                                {post.category}
                            </span>
                            <h3 className='text-brand-soft'>{post.title}</h3>
                            <div className="text-xs text-brand-primary">
                                <span className="uppercase font-semibold">{post.author}</span>
                                <span> - </span>
                                <span className="">{post.date}</span>

                            </div>
                        </div>
                    
                </Link>
            )}
        </div>
    )

*/