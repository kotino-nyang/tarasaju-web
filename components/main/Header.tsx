"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-woody-brown/20 bg-white/95 backdrop-blur-lg">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <img
              src="/logo_brown.png"
              alt="타라사주 로고"
              className="h-14 w-auto md:h-16"
              onError={(e) => {
                e.currentTarget.src = "/logo_brown.png";
              }}
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center text-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 md:flex md:gap-6 lg:gap-8">
            <Link
              href="/analysis"
              className="text-sm font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-base"
            >
              종합사주분석
            </Link>
            {!isLoading && user && (
              <Link
                href="/mypage"
                className="text-sm font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-base"
              >
                My Page
              </Link>
            )}
            {!isLoading && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-base"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="text-sm font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-base"
                >
                  로그인
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white border-b border-woody-brown/20 md:hidden"
          >
            <nav className="flex flex-col gap-4 p-6">
              <Link
                href="/analysis"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                종합사주분석
              </Link>
              {!isLoading && user && (
                <Link
                  href="/mypage"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  My Page
                </Link>
              )}
              <div className="mt-4 pt-4 border-t border-woody-brown/20">
                {!isLoading && (
                  user ? (
                    <button
                      onClick={handleLogout}
                      className="text-lg font-medium text-foreground/70 transition-colors hover:text-foreground text-left"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium text-foreground/70 transition-colors hover:text-foreground"
                    >
                      로그인
                    </Link>
                  )
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
