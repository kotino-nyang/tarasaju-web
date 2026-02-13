"use client";

import Link from "next/link";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-8">
            <section>
              <p className="text-gray-700 leading-relaxed mb-4">
                원포세븐(이하 "회사"라 합니다)은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제1조 (개인정보의 처리 목적)</h2>
              <div className="space-y-2 text-gray-700">
                <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                <p className="font-medium mt-3">1. 회원 가입 및 관리</p>
                <p className="ml-4">회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 목적으로 개인정보를 처리합니다.</p>
                <p className="font-medium mt-3">2. 재화 또는 서비스 제공</p>
                <p className="ml-4">서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증, 요금결제·정산을 목적으로 개인정보를 처리합니다.</p>
                <p className="font-medium mt-3">3. 고충처리</p>
                <p className="ml-4">민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보의 목적으로 개인정보를 처리합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
              <div className="space-y-2 text-gray-700">
                <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
                <p className="font-medium mt-3">1. 회원가입 및 관리 : 회원 탈퇴시까지</p>
                <p className="ml-4">다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료시까지</p>
                <p className="ml-8">가. 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지</p>
                <p className="ml-8">나. 서비스 이용에 따른 채권·채무관계 잔존시에는 해당 채권·채무관계 정산시까지</p>
                <p className="font-medium mt-3">2. 재화 또는 서비스 제공 : 재화·서비스 공급완료 및 요금결제·정산 완료시까지</p>
                <p className="ml-4">다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료시까지</p>
                <p className="ml-8">가. 「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 표시·광고, 계약내용 및 이행 등 거래에 관한 기록</p>
                <p className="ml-12">- 표시·광고에 관한 기록 : 6월</p>
                <p className="ml-12">- 계약 또는 청약철회, 대금결제, 재화 등의 공급기록 : 5년</p>
                <p className="ml-12">- 소비자 불만 또는 분쟁처리에 관한 기록 : 3년</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제3조 (개인정보의 제3자 제공)</h2>
              <p className="text-gray-700">
                회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제4조 (개인정보처리의 위탁)</h2>
              <p className="text-gray-700">
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
              </p>
              <div className="mt-3 text-gray-700">
                <p className="font-medium">1. Supabase (데이터베이스 및 인증 서비스)</p>
                <p className="ml-4">- 위탁받는 자 (수탁자) : Supabase Inc.</p>
                <p className="ml-4">- 위탁하는 업무의 내용 : 회원 정보 저장 및 관리, 사용자 인증</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제5조 (정보주체의 권리·의무 및 행사방법)</h2>
              <div className="space-y-2 text-gray-700">
                <p>① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
                <p className="ml-4">1. 개인정보 열람요구</p>
                <p className="ml-4">2. 오류 등이 있을 경우 정정 요구</p>
                <p className="ml-4">3. 삭제요구</p>
                <p className="ml-4">4. 처리정지 요구</p>
                <p>② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제6조 (처리하는 개인정보 항목)</h2>
              <div className="space-y-2 text-gray-700">
                <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                <p className="font-medium mt-3">1. 회원가입 및 관리</p>
                <p className="ml-4">- 필수항목 : 이메일 주소, 이름</p>
                <p className="ml-4">- 선택항목 : 프로필 사진</p>
                <p className="font-medium mt-3">2. 재화 또는 서비스 제공</p>
                <p className="ml-4">- 필수항목 : 이름, 연락처, 생년월일, 출생시간, 성별</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제7조 (개인정보의 파기)</h2>
              <div className="space-y-2 text-gray-700">
                <p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                <p>② 개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
                <p className="ml-4">1. 파기절차 : 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</p>
                <p className="ml-4">2. 파기방법 : 회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제8조 (개인정보 보호책임자)</h2>
              <div className="space-y-2 text-gray-700">
                <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">▶ 개인정보 보호책임자</p>
                  <p className="ml-4">성명 : 고수빈</p>
                  <p className="ml-4">직책 : 대표</p>
                  <p className="ml-4">연락처 : 010-4648-0046, binzzz010101@gmail.com</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제9조 (개인정보 처리방침 변경)</h2>
              <p className="text-gray-700">
                이 개인정보 처리방침은 2026. 1. 1부터 적용됩니다. 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
