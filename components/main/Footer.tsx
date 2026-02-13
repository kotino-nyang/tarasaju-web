"use client";

import { useState } from "react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

export default function Footer() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="relative bg-gray-900 py-8 text-white">
        {/* Gradient divider */}
        <div
          className="absolute left-0 top-0 h-px w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.3) 50%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            {/* Company Info - 가로 한 줄 */}
            <p className="text-xs text-gray-400">
              상호: 원포세븐 | 대표: 고수빈 | 사업자번호: 601-05-84230 | 통신판매업 신고번호: 2025-경기양주-0763 | 주소: 경기도 양주시 옥정동로7다길 12-21, 301호-A431호 | 고객센터: 010-4648-0046
            </p>

            {/* Links */}
            <div className="flex gap-3 text-xs">
              <button
                onClick={() => setShowTermsModal(true)}
                className="text-gray-400 hover:text-white transition-colors underline cursor-pointer"
              >
                이용약관
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-gray-400 hover:text-white transition-colors underline cursor-pointer"
              >
                개인정보처리방침
              </button>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">이메일무단수집거부</span>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-500">
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
