"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050d1a]/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between md:h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <img
              src="https://i.imgur.com/x2I0GIX.png"
              alt="타라사주 로고"
              className="h-14 w-auto md:h-16"
              onError={(e) => {
                e.currentTarget.src = "https://i.imgur.com/x2I0GIX.jpg";
              }}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <Link
              href="/analysis"
              className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white md:text-base"
            >
              종합사주분석
            </Link>
            {!isLoading && user && (
              <Link
                href="/mypage"
                className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white md:text-base"
              >
                My Page
              </Link>
            )}
            {!isLoading && (
              user ? (
                <motion.button
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/20 hover:shadow-[0_4px_16px_rgba(255,255,255,0.1)] md:px-6 md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              ) : (
                <Link href="/auth">
                  <motion.button
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/20 hover:shadow-[0_4px_16px_rgba(255,255,255,0.1)] md:px-6 md:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
