"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in with Google:', error);
            alert('Google 로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050d1a] font-light text-white antialiased"
            style={{
                background: "linear-gradient(135deg, #050d1a 0%, #0f172a 100%)",
            }}
        >
            {/* Background gradients */}
            <div
                className="absolute right-0 top-0 h-1/2 w-1/2"
                style={{
                    background:
                        "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, rgba(5, 13, 26, 0) 60%)",
                }}
            />
            <div
                className="absolute left-0 top-0 h-1/2 w-1/2 -scale-x-100"
                style={{
                    background:
                        "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, rgba(5, 13, 26, 0) 60%)",
                }}
            />

            {/* Floating stars decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        <svg width="4" height="4" viewBox="0 0 4 4">
                            <circle cx="2" cy="2" r="1" fill="#3b82f6" />
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(59,130,246,0.2)] md:p-10"
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="mb-8 flex justify-center transition-opacity duration-200 hover:opacity-80"
                    >
                        <img
                            src="https://i.imgur.com/x2I0GIX.png"
                            alt="타라사주 로고"
                            className="h-16 w-auto"
                            onError={(e) => {
                                e.currentTarget.src = "https://i.imgur.com/x2I0GIX.jpg";
                            }}
                        />
                    </Link>

                    {/* Welcome text */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-2xl font-light md:text-3xl">
                            환영합니다
                        </h1>
                        <p className="text-sm text-white/60 md:text-base">
                            간편하게 로그인하고 <br />
                            나만의 사주 분석을 시작하세요
                        </p>

                    </div>

                    {/* Login buttons */}
                    <div className="flex flex-col gap-3">
                        {/* Google Login Button */}
                        <motion.button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-4 font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/20 hover:shadow-[0_4px_16px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19.8055 10.2292C19.8055 9.55558 19.7501 8.85831 19.6394 8.18469H10.2002V12.0492H15.6015C15.3746 13.2911 14.6455 14.3898 13.5747 15.1171V17.6579H16.8202C18.7127 15.9165 19.8055 13.3202 19.8055 10.2292Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M10.2002 20.1029C12.9597 20.1029 15.2692 19.2073 16.8202 17.6579L13.5747 15.1171C12.6791 15.7352 11.5309 16.0951 10.2002 16.0951C7.5407 16.0951 5.28601 14.3316 4.48085 11.9463H1.13379V14.5652C2.70779 17.6911 6.20355 20.1029 10.2002 20.1029Z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M4.48085 11.9463C4.05646 10.7044 4.05646 9.32977 4.48085 8.08783V5.46899H1.13379C-0.378182 8.47345 -0.378182 12.5608 1.13379 15.5653L4.48085 11.9463Z"
                                    fill="#FBBC04"
                                />
                                <path
                                    d="M10.2002 3.93779C11.6066 3.91469 12.9597 4.46199 13.9751 5.42257L16.8479 2.54977C15.1861 0.987775 12.9374 0.107727 10.2002 0.130824C6.20355 0.130824 2.70779 2.54263 1.13379 5.46893L4.48085 8.08777C5.28601 5.70248 7.5407 3.93779 10.2002 3.93779Z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Google로 시작하기</span>
                        </motion.button>

                    </div>

                    {/* Terms */}
                    <p className="mt-8 text-center text-xs text-white/40">
                        로그인 시{" "}
                        <Link href="/terms" className="text-white/60 hover:text-white/80 underline">
                            이용약관
                        </Link>{" "}
                        및{" "}
                        <Link href="/privacy" className="text-white/60 hover:text-white/80 underline">
                            개인정보처리방침
                        </Link>
                        에<br />
                        동의하는 것으로 간주됩니다.
                    </p>
                </motion.div>

                {/* Back to home link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-6 text-center"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        <span>메인으로 돌아가기</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
