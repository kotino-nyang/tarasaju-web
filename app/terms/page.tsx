"use client";

import Link from "next/link";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">이용약관</h1>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                이 약관은 원포세븐(이하 "회사"라 합니다)이 운영하는 타라사주 웹사이트(이하 "사이트"라 합니다)에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 합니다)를 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제2조 (정의)</h2>
              <div className="space-y-2 text-gray-700">
                <p>1. "사이트"란 회사가 서비스를 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 설정한 가상의 영업장을 말하며, 아울러 사이트를 운영하는 사업자의 의미로도 사용합니다.</p>
                <p>2. "이용자"란 사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
                <p>3. "회원"이라 함은 사이트에 개인정보를 제공하여 회원등록을 한 자로서, 사이트의 정보를 지속적으로 제공받으며, 사이트가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</p>
                <p>4. "비회원"이라 함은 회원에 가입하지 않고 사이트가 제공하는 서비스를 이용하는 자를 말합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제3조 (약관의 명시와 개정)</h2>
              <div className="space-y-2 text-gray-700">
                <p>1. 회사는 이 약관의 내용과 상호, 영업소 소재지, 대표자의 성명, 사업자등록번호, 연락처 등을 이용자가 알 수 있도록 사이트의 초기 화면에 게시합니다.</p>
                <p>2. 회사는 약관의 규제에 관한 법률, 전자거래기본법, 전자서명법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
                <p>3. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 사이트의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
              <div className="space-y-2 text-gray-700">
                <p>1. 회사는 다음과 같은 업무를 수행합니다.</p>
                <p className="ml-4">가. 사주 분석 서비스 제공</p>
                <p className="ml-4">나. 기타 회사가 정하는 업무</p>
                <p>2. 회사는 서비스의 내용을 변경할 수 있으며, 변경사항은 사이트에 공지합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제5조 (서비스의 중단)</h2>
              <div className="space-y-2 text-gray-700">
                <p>1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
                <p>2. 제1항에 의한 서비스 중단의 경우에는 회사는 사이트 초기화면에 통지합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제6조 (회원가입)</h2>
              <div className="space-y-2 text-gray-700">
                <p>1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
                <p>2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.</p>
                <p className="ml-4">가. 등록 내용에 허위, 기재누락, 오기가 있는 경우</p>
                <p className="ml-4">나. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제7조 (결제 및 환불)</h2>
              <div className="space-y-2 text-gray-700">
                <p>1. 회사는 무통장 입금 방식으로 결제를 제공합니다.</p>
                <p>2. 서비스 이용 전 환불 요청 시 100% 환불합니다.</p>
                <p>3. 서비스 이용 후 불만족 시 100% 환불 정책을 적용합니다.</p>
                <p>4. 환불은 영업일 기준 3-5일 이내에 처리됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제8조 (개인정보보호)</h2>
              <p className="text-gray-700">
                회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다. 자세한 사항은 개인정보처리방침을 확인해주시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제9조 (회사의 의무)</h2>
              <div className="space-y-2 text-gray-700">
                <p>1. 회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.</p>
                <p>2. 회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보 보호를 위한 보안 시스템을 갖추어야 합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제10조 (이용자의 의무)</h2>
              <div className="space-y-2 text-gray-700">
                <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
                <p>1. 신청 또는 변경시 허위 내용의 등록</p>
                <p>2. 회사에 게시된 정보의 변경</p>
                <p>3. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</p>
                <p>4. 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>
                <p>5. 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
                <p>6. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 사이트에 공개 또는 게시하는 행위</p>
              </div>
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
