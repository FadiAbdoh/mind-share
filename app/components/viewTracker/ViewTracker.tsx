"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
    
    useEffect(() => {
        fetch(`/api/posts/${slug}/view`, { method: 'POST'})
    }, [slug]);

    return null;
} 