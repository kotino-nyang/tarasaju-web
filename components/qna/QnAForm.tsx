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
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-3xl font-black text-white mb-6">문의하기</h3>
        {productName && (
          <p className="text-blue-400 font-bold mb-8">상품: {productName}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white/60 mb-2 ml-1 uppercase tracking-widest">
                이름 <span className="text-blue-500">*</span>
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

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white/60 mb-2 ml-1 uppercase tracking-widest">
                이메일 <span className="text-blue-500">*</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white/60 mb-2 ml-1 uppercase tracking-widest">
                비밀번호 <span className="text-blue-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="4자 이상"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                minLength={4}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white/60 mb-2 ml-1 uppercase tracking-widest">
                비밀번호 확인 <span className="text-blue-500">*</span>
              </label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                placeholder="비밀번호 다시 입력"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                minLength={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-white/60 mb-2 ml-1 uppercase tracking-widest">
              문의 내용 <span className="text-blue-500">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="궁금하신 내용을 작성해주세요."
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed"
              rows={5}
              maxLength={2000}
            />
            <div className="flex justify-end pr-2">
              <span className={`text-xs font-bold ${formData.question.length > 1800 ? "text-blue-400" : "text-white/20"}`}>
                {formData.question.length.toLocaleString()} / 2,000자
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                />
                <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                  <svg className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                공개 문의로 등록하기
              </span>
            </label>
            <p className="text-[10px] text-white/20 mt-2 ml-8">
              *공개 선택 시 다른 사용자도 질문과 답변을 볼 수 있습니다.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:bg-white/10"
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
