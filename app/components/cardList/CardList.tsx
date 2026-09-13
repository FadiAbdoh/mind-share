"use client"

import useSWR from "swr";
import Card from "../card/Card";
import Pagination from "../pagination/Pagination";

import { Loader2 } from "lucide-react"

interface CardListProps {
    page?: string;
    cat?: string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if(!res.ok) {
        throw new Error("Failed to fetch posts in cardlist");
    }
    return res.json();
}

export default function CardList({ page = '1', cat }: CardListProps) {

    const apiURL = `/api/posts?page=${page}${cat ? `&cat=${cat}` : ""}`

    const { data, error, isLoading } = useSWR(apiURL, fetcher, {
        keepPreviousData: true
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 flex-2">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 py-10 text-center flex-2">
                Error loading posts.
            </div>
        );
    }

    const { posts, count } = data;
    const POST_PER_PAGE = 3;
    const currentPage = parseInt(page);
    const hasPrev = POST_PER_PAGE * (currentPage - 1) > 0;
    const hasNext = POST_PER_PAGE * (currentPage - 1) + POST_PER_PAGE < count;

    return (
        <div>
            <h1 className="text-xl md:text-xl font-bold">
                {cat ? `Recent Posts ${cat}` : 'Recent Posts'}
            </h1>

            {posts && posts.length > 0 ? (
                <div className="my-5 flex flex-col gap-8">
                    {posts.map((post: any) => (
                        <Card key={post.id} post={post}/>
                    ))}
                </div>
            ) : (
                <div className="my-10 py-12 text-center border border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl text-text-soft text-sm">
                    No posts published yet in this category.
                </div>
            )}

            

            <Pagination
                page={currentPage}
                cat={cat}
                hasPrev={hasPrev}
                hasNext={hasNext}
            />
        </div>
    )
}
