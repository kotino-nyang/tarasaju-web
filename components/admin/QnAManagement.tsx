"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { maskName, maskEmail } from "@/lib/utils/nameMask";

interface QnA {
  id: string;
  user_id: string | null;
  author_name: string;
  author_email: string;
  question: string;
  answer: string | null;
  is_answered: boolean;
  is_public: boolean;
  is_deleted: boolean;
  product_name: string | null;
  order_id: string | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
}

type QnAFilter = "all" | "unanswered" | "answered";

export default function QnAManagement() {
  const [qnaList, setQnaList] = useState<QnA[]>([]);
  const [filteredQnaList, setFilteredQnaList] = useState<QnA[]>([]);
  const [filter, setFilter] = useState<QnAFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQnA, setSelectedQnA] = useState<QnA | null>(null);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    loadQnA();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [qnaList, filter]);

  const loadQnA = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("qna")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQnaList(data);
    } else {
      console.error("Q&A 로딩 실패:", error);
    }
    setIsLoading(false);
  };

  const applyFilter = () => {
    let filtered = [...qnaList];

    if (filter === "unanswered") {
      filtered = filtered.filter((q) => !q.is_answered);
    } else if (filter === "answered") {
      filtered = filtered.filter((q) => q.is_answered);
    }

    setFilteredQnaList(filtered);
  };

  const submitAnswer = async (qnaId: string) => {
    if (!answerText.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("qna")
      .update({
        answer: answerText,
        is_answered: true,
        answered_at: new Date().toISOString(),
      })
      .eq("id", qnaId);

    if (error) {
      alert("답변 등록 실패: " + error.message);
    } else {
      alert("답변이 등록되었습니다.");
      setAnswerText("");
      setSelectedQnA(null);
      loadQnA();
    }
  };

  const deleteQnA = async (qnaId: string) => {
    if (!confirm("이 Q&A를 삭제하시겠습니까?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("qna")
      .update({ is_deleted: true })
      .eq("id", qnaId);

    if (error) {
      alert("삭제 실패: " + error.message);
    } else {
      alert("Q&A가 삭제되었습니다.");
      loadQnA();
    }
  };

  const toggleVisibility = async (qnaId: string, currentStatus: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("qna")
      .update({ is_public: !currentStatus })
      .eq("id", qnaId);

    if (error) {
      alert("공개 설정 변경 실패: " + error.message);
    } else {
      alert("공개 설정이 변경되었습니다.");
      loadQnA();
    }
  };

  const getStats = () => {
    const total = qnaList.length;
    const unanswered = qnaList.filter((q) => !q.is_answered).length;
    const answered = qnaList.filter((q) => q.is_answered).length;
    const members = qnaList.filter((q) => q.user_id !== null).length;
    const nonMembers = total - members;

    return { total, unanswered, answered, members, nonMembers };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">전체 Q&A</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.total}개</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">답변대기</p>
          <p className="text-lg md:text-2xl font-bold text-yellow-600">
            {stats.unanswered}개
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">답변완료</p>
          <p className="text-lg md:text-2xl font-bold text-green-600">{stats.answered}개</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">회원</p>
          <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.members}개</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">비회원</p>
          <p className="text-lg md:text-2xl font-bold text-purple-600">
            {stats.nonMembers}개
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {[
          { value: "all", label: "전체" },
          { value: "unanswered", label: "답변대기" },
          { value: "answered", label: "답변완료" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as QnAFilter)}
            className={`whitespace-nowrap rounded-lg px-3 md:px-4 py-2.5 md:py-2 text-xs md:text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-blue-600 text-white active:bg-blue-700"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 active:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Q&A List */}
      <div className="grid gap-4">
        {filteredQnaList.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">해당하는 Q&A가 없습니다.</p>
          </div>
        ) : (
          filteredQnaList.map((qna) => (
            <div
              key={qna.id}
              className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <p className="font-medium text-gray-900">
                      {maskName(qna.author_name)}
                    </p>
                    {qna.user_id ? (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        회원
                      </span>
                    ) : (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                        비회원
                      </span>
                    )}
                    {qna.is_answered ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        답변완료
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                        답변대기
                      </span>
                    )}
                    {qna.is_public ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                        공개
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                        비공개
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {maskEmail(qna.author_email)}
                    {qna.product_name && ` | ${qna.product_name}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(qna.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">질문</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {qna.question}
                </p>
              </div>

              {qna.answer && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-1">답변</p>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">{qna.answer}</p>
                  <p className="text-xs text-green-600 mt-2">
                    {qna.answered_at &&
                      new Date(qna.answered_at).toLocaleString("ko-KR")}
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedQnA(selectedQnA?.id === qna.id ? null : qna);
                    setAnswerText(qna.answer || "");
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
                >
                  {selectedQnA?.id === qna.id
                    ? "답변 취소"
                    : qna.is_answered
                    ? "답변 수정"
                    : "답변하기"}
                </button>
                <button
                  onClick={() => toggleVisibility(qna.id, qna.is_public)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  {qna.is_public ? "비공개" : "공개"}
                </button>
                <button
                  onClick={() => deleteQnA(qna.id)}
                  className="rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100"
                >
                  삭제
                </button>
              </div>

              {selectedQnA?.id === qna.id && (
                <div className="mt-4">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="답변 내용을 입력하세요..."
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={6}
                  />
                  <button
                    onClick={() => submitAnswer(qna.id)}
                    className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
                  >
                    답변 등록
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
