
import Link from "next/link";
import Image from "next/image";
import prisma from '@/lib/prismadb';

const categoryColors: Record<string, string> = {
    coding: "bg-brand-coding",
    fashion: "bg-brand-fashion",
    food: "bg-brand-food",
    travel: "bg-brand-travel",
    culture: "bg-brand-culture",
    style: "bg-brand-style",
};

export default async function Category() {

    const categories = await prisma.category.findMany();
    return (
        <div className="my-4">
            <h1 aria-label="title" className="text-xl text-base font-semibold">Popular Categories</h1>
            <div aria-label="categories" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
                {categories.map((cat) => (
                    <Link 
                    key={cat.id} 
                    aria-label={`${cat.title} category`} 
                    href={`/blog?cat=${cat.slug}`} 
                    className={`${categoryColors[cat.slug]} flex items-center justify-center gap-3 rounded-lg py-4 px-6 transition-all duration-300 transform hover:-translate-y-0.5`}>
                        <Image 
                            src={cat.img || ''} 
                            alt={cat.title}
                            width={35}
                            height={35}
                            className="rounded-[50%] object-cover w-8 h-8 md:w-[35px] md:h-[35px]"
                        />
                        <span className="capitalize text-sm md:text-base text-white">
                            {cat.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
