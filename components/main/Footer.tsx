"use client";

import { useState } from "react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

export default function Footer() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="relative bg-sub-background py-8 text-foreground">
        {/* Gradient divider */}
        <div
          className="absolute left-0 top-0 h-px w-full hidden md:block"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(112, 94, 82, 0.3) 50%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            {/* Company Info - 가로 한 줄 -> 모바일 세로 */}
            <div className="text-xs text-foreground/60 max-w-2xl mx-auto">
              <p className="md:inline">상호: 원포세븐 | </p>
              <p className="md:inline">대표: 고수빈 | </p>
              <p className="md:inline">사업자번호: 601-05-84230 | </p>
              <p className="md:inline">통신판매업 신고번호: 2025-경기양주-0763 | </p>
              <br className="hidden md:block" />
              <p className="md:inline">주소: 경기도 양주시 옥정동로7다길 12-21, 301호-A431호 | </p>
              <p className="md:inline">고객센터: 010-4648-0046</p>
            </div>

            {/* Links */}
            <div className="flex gap-3 text-xs">
              <button
                onClick={() => setShowTermsModal(true)}
                className="text-foreground/60 hover:text-foreground transition-colors underline cursor-pointer"
              >
                이용약관
              </button>
              <span className="text-foreground/40">|</span>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-foreground/60 hover:text-foreground transition-colors underline cursor-pointer"
              >
                개인정보처리방침
              </button>
              <span className="text-foreground/40">|</span>
              <span className="text-foreground/60">이메일무단수집거부</span>
            </div>

            {/* Copyright */}
            <p className="text-xs text-foreground/50">
              © 2026 TARA SAJU. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
    </>
  );
}
