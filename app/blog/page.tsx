
import CardList from "../components/cardList/CardList";
import MenuMP from "../components/sidebar/Sidebar";

const categoryColors: Record<string, string> = {
    coding: "bg-brand-coding",
    fashion: "bg-brand-fashion",
    food: "bg-brand-food",
    travel: "bg-brand-travel",
    culture: "bg-brand-culture",
    style: "bg-brand-style",
};

interface BlogPageProps {
    searchParams: Promise<{
        page?: string,
        cat?: string,
    }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {

    const resolvedParams = await searchParams;
    const page = resolvedParams.page || '1';
    const cat = resolvedParams.cat || '';

    const bgBadge = categoryColors[cat] || 'bg-brand-primary';

    return (
        <div>
            <h1 
            className={`${bgBadge} text-white capitalize text-center mt-4 mb-12 w-[100%] sm:w-[80%] md:w-[60%] mx-auto rounded-xl text-xl px-1 py-2`}>
                {cat ? `${cat} Blog` : `All Stories`}
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-8">
                    <CardList page={page} cat={cat}/>
                </div>
                <div className="lg:col-span-4 lg:sticky lg:top-20">
                    <MenuMP />
                </div>
            </div>
        </div>
    )
}
