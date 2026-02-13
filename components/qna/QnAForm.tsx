"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hashPassword } from "@/lib/utils/passwordHash";

interface QnAFormProps {
  productName?: string;
  orderId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function QnAForm({ productName, orderId, onSuccess, onClose }: QnAFormProps) {
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    password: "",
    passwordConfirm: "",
    question: "",
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.authorName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!formData.authorEmail.trim() || !formData.authorEmail.includes("@")) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      alert("비밀번호는 4자 이상 입력해주세요.");
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.question.trim()) {
      alert("질문 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Hash password
    const passwordHash = await hashPassword(formData.password);

    const { error } = await supabase.from("qna").insert({
      user_id: user?.id || null,
      author_name: formData.authorName.trim(),
      author_email: formData.authorEmail.trim(),
      password_hash: passwordHash,
      question: formData.question.trim(),
      is_public: formData.isPublic,
      product_name: productName || null,
      order_id: orderId || null,
    });

    if (error) {
      alert("문의 등록 실패: " + error.message);
    } else {
      alert("문의가 등록되었습니다. 마이페이지에서 답변을 확인하실 수 있습니다.");
      setFormData({
        authorName: "",
        authorEmail: "",
        password: "",
        passwordConfirm: "",
        question: "",
        isPublic: true,
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050d1a]/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 bg-[#0f172a]/90 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-all hover:rotate-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">문의하기</h3>
        {productName && (
          <p className="text-sm font-bold text-blue-400/80 mb-8">서비스: {productName}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-white/60 mb-2">
                성함 <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="홍길동"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/60 mb-2">
                이메일 <span className="text-blue-400">*</span>
              </label>
              <input
                type="email"
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                placeholder="example@email.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                maxLength={200}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-white/60 mb-2">
                비밀번호 <span className="text-blue-400">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="4자 이상 숫자/문자"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                minLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/60 mb-2">
                비밀번호 확인 <span className="text-blue-400">*</span>
              </label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                placeholder="한 번 더 입력"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                minLength={4}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/60 mb-2">
              문의 내용 <span className="text-blue-400">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="궁금하신 내용을 입력해주세요. 상세하게 작성할수록 정확한 답변이 가능합니다."
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed"
              rows={6}
              maxLength={2000}
            />
            <div className="flex justify-end mt-2">
              <p className="text-[10px] font-bold text-white/20">{formData.question.length} / 2,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600/50"></div>
              <span className="ms-3 text-xs font-bold text-white/40 peer-checked:text-white transition-colors">
                다른 사용자도 볼 수 있도록 공개합니다
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "등록 중..." : "문의 등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
