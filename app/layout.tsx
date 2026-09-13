import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import AuthProvider from "@/providers/AuthProvider";
import { UserProvider } from "./context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIND SHARE | Deep Dives into Tech, Ideas & Web Development",
  description: "Explore insightful articles, software engineering tutorials, and creative thoughts shared by the MIND SHARE community.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" }, // الأيقونة الكلاسيكية للمتصفحات القديمة
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
  // لربط ملف الـ manifest المسؤول عن إعدادات الـ PWA وظهور الموقع كتطبيق على الأندرويد
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
        <body className="min-h-full flex flex-col">
          <AuthProvider>
            <UserProvider>
              <ThemeProvider>
                <div className="flex-1 flex flex-col min-h-screen">
                  <NavBar />
                  <main className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ThemeProvider>
            </UserProvider>
          </AuthProvider>
        </body>
      
    </html>
  );
}
// container max-w-4xl mx-auto px-3 py-8 md:px-6