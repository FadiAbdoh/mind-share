"use client";

import { useSession } from "next-auth/react";
import { useContext, createContext } from "react";
import useSWR from "swr";

interface UserProfile {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    createdAt: string;
}

export interface UpdateUserData {
    name: string;
    image: string;
    bio: string;
    currentPassword?: string;
    newPassword?: string;
}

interface UserContextType {
    userInfo: UserProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    updateUser: (data: UpdateUserData) => Promise<{ success: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | null>(null);

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    });

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    const shouldFetch = status === "authenticated";

    const { data, isLoading, mutate } = useSWR<UserProfile>(
        shouldFetch ? "/api/user/profile" : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    const refreshUser = async () => {
        await mutate();
    };

    const updateUser = async (dataToUpdate: UpdateUserData) => {
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToUpdate),
            });

            const resData = await res.json();

            if (res.ok) {
                await mutate(resData, false);
                return { success: true };
            }

            return {
                success: false,
                error: resData.error || "Failed to update profile",
            };
        } catch (e) {
            return {
                success: false,
                error: "Network error occurred. Please try again.",
            };
        }
    };

    return (
        <UserContext.Provider
            value={{
                userInfo: data || null,
                loading: status === "loading" || (shouldFetch && isLoading),
                refreshUser,
                updateUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};