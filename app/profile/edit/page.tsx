"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, User, ArrowLeft, Save, Lock, Loader2, EyeOff, Eye } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
    // حالات كلمة المرور
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState({
        currPass: false,
        newPass: false
    })
    const [passwordError, setPasswordError] = useState("");
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_\-\.])[A-Za-z\d@$!%*?&#_\-\.]{8,}$/;

    const { userInfo, loading, updateUser } = useUser();
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();
    // معالجة تغيير الصورة (معاينة محلية)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            if (avatar) URL.revokeObjectURL(avatar);
            setImageFile(file)
            setAvatar(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordError("");
        if (newPassword && !currentPassword) {
            setPasswordError("Please enter your current password to set a new one.");
            return;
        }

        if (currentPassword && !newPassword) {
            setPasswordError("Please enter a new password.");
            return;
        }
        if(newPassword && !strongPasswordRegex.test(newPassword)) {
            setPasswordError("The password must be at least 8 characters long, and contain an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&#).")
            return;
        }
        
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const bio = formData.get("bio") as string;
        let finalImageURL = userInfo?.image || '';
        
        if(imageFile) {
            const uploadData = new FormData();
            uploadData.append("file", imageFile);

            const uploadRes = await fetch('/api/uploadimg',{
                method: "POST",
                body: uploadData
            })

            if(uploadRes.ok) {
                const { url } = await uploadRes.json()
                finalImageURL = url;
            }
        }

        const updatePayload: {
            name: string;
            image: string;
            bio: string;
            currentPassword?: string;
            newPassword?: string;
        } = {
            name,
            image: finalImageURL,
            bio,
        };

        if (currentPassword.trim() && newPassword.trim()) {
            updatePayload.currentPassword = currentPassword;
            updatePayload.newPassword = newPassword;
        }

        const result = await updateUser(updatePayload);
        setIsSaving(false);
        if(result.success) {
            router.push('/profile');
            router.refresh();
        } else if (result.error) {
            setPasswordError(result.error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    const currentImage = avatar || userInfo?.image || "/def-profile-svg.svg";

    return (
        <div className="mx-auto py-6 space-y-8">
            {/* 🟢 الهيدر العلوي ورابط العودة */}
            <div className="flex items-center justify-between">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-soft hover:text-text-main transition-colors duration-200 min-h-[44px] px-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Profile</span>
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold text-text-main">
                    Edit Profile
                </h1>
            </div>

            <form key={userInfo?.id} onSubmit={handleSubmit} className="space-y-8">
                {/* 🟢 قسم الصورة الشخصية (Avatar Upload) */}
                <div className="p-6 rounded-3xl bg-gray-50/80 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-md flex-shrink-0 group">
                        <Image
                            src={currentImage}
                            alt="Profile Picture"
                            fill
                            className="object-cover"
                        />
                        {/* طبقة التراكب وزر الرفع */}
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                        >
                            <Camera className="w-6 h-6 text-white" />
                            <span className="sr-only">Upload Profile Picture</span>
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="text-center sm:text-left space-y-2">
                        <h2 className="text-base font-bold text-text-main">
                            Profile Photo
                        </h2>
                        <p className="text-xs text-text-soft">
                            Recommended: Square JPG or PNG, at least 300x300 pixels.
                        </p>
                        <label
                            htmlFor="avatar-upload-btn"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-text-main text-xs font-semibold cursor-pointer transition-colors duration-200 min-h-[44px]"
                        >
                            <Camera className="w-4 h-4" />
                            <span>Change Photo</span>
                        </label>
                        <input
                            id="avatar-upload-btn"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* 🟢 قسم المعلومات الأساسية */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gray-50/80 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 space-y-6">
                    <h2 className="text-lg font-bold text-text-main border-b border-gray-200 dark:border-neutral-800 pb-3">
                        Personal Information
                    </h2>

                    <div className="">
                        {/* حقل الاسم */}
                        <div className="space-y-1">
                            <label
                                htmlFor="name"
                                className="text-xs font-semibold text-text-main"
                            >
                                Full Name
                            </label>
                            <div className="relative flex items-center">
                                <User className="w-5 h-5 absolute left-3.5 text-text-soft pointer-events-none" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    defaultValue={userInfo?.name || ''}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 min-h-[44px]"
                                />
                            </div>
                        </div>
                    </div>

                    

                    {/* حقل السيرة الذاتية (Bio) */}
                    <div className="space-y-1">
                        <label
                            htmlFor="bio"
                            className="text-xs font-semibold text-text-main"
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            defaultValue={userInfo?.bio || ''}
                            placeholder="Tell us a little bit about yourself..."
                            className="w-full p-4 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 resize-none"
                        />
                    </div>
                </div>

                {/* 🟢 قسم تغيير كلمة المرور (اختياري) */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gray-50/80 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 space-y-6">
                    <div>    
                        <h2 className="text-lg font-bold text-text-main border-b border-gray-200 dark:border-neutral-800 pb-3">
                            Change Password
                        </h2>
                        <p className="text-xs text-text-soft mt-1">
                            Leave these blank if you do not want to change your password.
                        </p>
                    </div>
                    {passwordError && (
                        <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-medium">
                            {passwordError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* current password */}
                        <div className="space-y-1">
                            <label
                                htmlFor="currentPassword"
                                className="text-xs font-semibold text-text-main"
                            >
                                Current Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="w-5 h-5 absolute left-3.5 text-text-soft pointer-events-none" />
                                <input
                                    id="currentPassword"
                                    type={showPassword.currPass? "text" : 'password'}
                                    placeholder="••••••••"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 min-h-[44px]"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword.currPass ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((prev) => ({
                                        ...prev,
                                        currPass: !prev.currPass,
                                    }))}
                                    className="absolute right-3.5 text-text-soft hover:text-text-main transition-colors duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                                >
                                    {showPassword.currPass? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* new password */}
                        <div className="space-y-1">
                            <label
                                htmlFor="newPassword"
                                className="text-xs font-semibold text-text-main"
                            >
                                New Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="w-5 h-5 absolute left-3.5 text-text-soft pointer-events-none" />
                                <input
                                    id="newPassword"
                                    type={showPassword.newPass? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 min-h-[44px]"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword.newPass ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((prev) => ({
                                        ...prev,
                                        newPass: !prev.newPass,
                                    }))}
                                    className="absolute right-3.5 text-text-soft hover:text-text-main transition-colors duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                                >
                                    {showPassword.newPass? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🟢 أزرار الإلغاء والحفظ */}
                <div className="flex items-center justify-end gap-4 pt-2">
                    <Link href="/profile">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 text-text-soft hover:text-text-main font-medium text-sm transition-colors duration-200 min-h-[44px] cursor-pointer"
                        >
                            Cancel
                        </button>
                    </Link>

                    <motion.button
                        type="submit"
                        disabled={isSaving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-medium px-6 py-2.5 rounded-xl min-h-[44px] shadow-sm transition-colors duration-200 cursor-pointer text-sm"
                    >
                        {isSaving? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </motion.button>
                </div>
            </form>
        </div>
    );
}



