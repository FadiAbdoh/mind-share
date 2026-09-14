
import Link from "next/link";
import SidebarPostItem from "../sidebarPost/SidebarPost";
import prisma from '@/lib/prismadb';


const categoryColors: Record<string, string> = {
    coding: "bg-brand-coding",
    fashion: "bg-brand-fashion",
    food: "bg-brand-food",
    travel: "bg-brand-travel",
    culture: "bg-brand-culture",
    style: "bg-brand-style",
};

export default async function Sidebar() {
        
    const [categories, popularPosts, editorPickPosts] = await Promise.all([
        prisma.category.findMany(),
        // most popular
        prisma.post.findMany({
            take: 4,
            orderBy: { views: 'desc'},
            include: {
                user: { select: { name: true, image: true } },
                cat: { select: {title: true } },
            }
        }),
        // editor pick
        prisma.post.findMany({
            where: {
                isEditorPick: true,
            },
            take: 4,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, image: true } },
                cat: { select: { title: true } },
            },
        })
    ]);

    return (
        <div className="flex flex-col gap-10">
            <div>
                <h1 className="text-xl md:text-xl font-bold">Most Popular</h1>
                <h2 className="text-brand-soft text-base mb-2">{"What's A Hot"}</h2>   
                <div className="flex flex-col gap-5">
                    {popularPosts.map((popPost) => 
                        <SidebarPostItem key={popPost.id} post={popPost} />
                    )}
                </div>
            </div>
            {/*  */}
            <div>
                <h1 className="text-xl md:text-xl font-bold">Categories</h1>
                <h2 className="text-brand-soft text-base">{"Discover By Topics"}</h2>   
                <div aria-label="categories" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 my-6">
                    {categories.map((cat) => (
                        <Link 
                        key={cat.id} 
                        aria-label={`${cat.slug} category`} 
                        href={`/blog?cat=${cat.slug}`} 
                        className={`flex items-center justify-center gap-2 ${categoryColors[cat.slug]} text-white rounded-lg py-4 px-6 transition-all duration-300 transform hover:-translate-y-0.5`}>
                            <span className="capitalize text-sm md:text-base">
                                {cat.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
            {/*  */}
            <div>
                <h1 className="text-xl md:text-xl font-bold">Editors Pick</h1>
                <h2 className="text-brand-soft text-base mb-2">{"Chossen By The Editor"}</h2>   
                <div className="flex flex-col gap-5">
                    {editorPickPosts.length === 0 ? (
                        <p className="text-xs text-brand-soft">No editor picks selected yet.</p>
                    ) : (
                        editorPickPosts.map((edPost) => (
                            <SidebarPostItem key={edPost.id} post={edPost} withImage={true} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

