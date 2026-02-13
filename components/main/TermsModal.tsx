"use client";

interface TermsModalProps {
  onClose: () => void;
}

export default function TermsModal({ onClose }: TermsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-[#0f172a] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(59,130,246,0.2)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-6 right-6 float-right text-white/20 hover:text-white transition-colors z-10 p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-10">이용약관</h1>

          <div className="space-y-12 text-white/70 leading-relaxed font-light">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">제1조 (목적)</h2>
              <p>
                이 약관은 원포세븐(전자상거래 사업자)이 운영하는 타라사주 사이버 몰(이하 "몰"이라 한다)에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제2조 (정의)</h2>
              <div className="space-y-2">
                <p>① "몰"이란 원포세븐이 재화 또는 용역(이하 "재화 등")을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.</p>
                <p>② "이용자"란 "몰"에 접속하여 이 약관에 따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
                <p>③ '회원'이라 함은 "몰"에 회원등록을 한 자로서, 계속적으로 "몰"이 제공하는 서비스를 이용할 수 있는 자를 말합니다. 본 몰은 이용자의 편의를 위해 구글(Google) 및 카카오(Kakao) 등 외부 소셜 계정 연동을 통한 가입 방식을 제공합니다.</p>
                <p>④ '비회원'이라 함은 회원에 가입하지 않고 "몰"이 제공하는 서비스를 이용하는 자를 말합니다.</p>
                <p>⑤ '디지털 콘텐츠'라 함은 이용자가 제공한 사주 정보를 바탕으로 인공지능(AI) 알고리즘이 생성하여 PDF 등의 전자적 파일 형태로 제공하는 분석 리포트를 말합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제3조 (약관 등의 명시와 설명 및 개정)</h2>
              <p>
                ① "몰"은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소, 전화번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자 등을 이용자가 쉽게 알 수 있도록 초기 서비스화면에 게시합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제4조 (서비스의 제공 및 변경)</h2>
              <div className="space-y-2">
                <p>① "몰"은 다음과 같은 업무를 수행합니다.</p>
                <p className="ml-4">• 인공지능(AI) 기반 사주 분석 리포트 등 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</p>
                <p className="ml-4">• 구매계약이 체결된 디지털 콘텐츠의 배송(카카오 알림톡, 문자메시지, 전자우편 등)</p>
                <p className="ml-4">• 기타 "몰"이 정하는 업무</p>
                <p>② 본 서비스는 AI 알고리즘에 의한 자동화된 분석 결과를 제공하는 디지털 콘텐츠 서비스로, 상담사와의 실시간 직접 상담은 포함되지 않습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제5조 (서비스의 중단)</h2>
              <p>
                ① "몰"은 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제6조 (회원가입)</h2>
              <p>
                ① 이용자는 "몰"이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다. 본 몰은 구글 및 카카오 소셜 로그인 연동을 통한 간편 가입을 지원하며, 이 경우 해당 서비스 제공자로부터 필수 정보를 제공받는 것에 동의한 것으로 간주합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제7조 (회원 탈퇴 및 자격 상실 등)</h2>
              <p>
                ① 회원은 "몰"에 언제든지 탈퇴를 요청할 수 있으며 "몰"은 즉시 회원탈퇴를 처리합니다. 소셜 연동 회원의 경우 해당 소셜 계정 연동 해지를 통해 탈퇴 의사를 표시할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제8조 (회원에 대한 통지)</h2>
              <p>
                ① "몰"이 회원에 대한 통지를 하는 경우, 회원이 "몰"과 미리 약정하여 지정한 전자우편 주소 또는 휴대폰 번호(카카오 알림톡/문자메시지)로 할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제9조 (구매신청 및 개인정보 제공 동의 등)</h2>
              <div className="space-y-2">
                <p>① "몰" 이용자는 "몰"상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, "몰"은 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.</p>
                <p className="ml-4">• 재화 등의 검색 및 선택</p>
                <p className="ml-4">• 정확한 사주 정보(성별, 양력/음력, 생년월일시 등) 및 받는 사람의 성명, 전화번호, 전자우편주소 등의 입력</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제10조 (계약의 성립)</h2>
              <p>
                ① "몰"은 제9조와 같은 구매신청에 대하여 신청 내용에 허위, 기재누락, 오기가 있는 경우 승낙하지 않을 수 있습니다. 이용자가 사주 정보를 잘못 입력하여 발생하는 불이익에 대한 책임은 이용자에게 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제11조 (지급방법)</h2>
              <p>
                "몰"에서 구매한 재화 또는 용역에 대한 대금지급방법은 신용카드 결제, 실시간 계좌이체, 무통장 입금, 전자화폐 등 "몰"이 가용한 방법으로 할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제12조 (수신확인통지·구매신청 변경 및 취소)</h2>
              <p>
                ① "몰"은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지(알림톡, 문자 또는 이메일)를 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제13조 (재화 등의 공급)</h2>
              <div className="space-y-2">
                <p>① "몰"은 이용자가 구매한 리포트를 카카오 알림톡, 문자메시지(SMS/LMS), 또는 전자우편(E-mail)을 통해 PDF 파일 또는 다운로드 링크 형태로 발송합니다.</p>
                <p>② 디지털 콘텐츠의 특성상 발송이 완료된 시점에 배송이 완료된 것으로 봅니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제14조 (환급)</h2>
              <p>
                ① "몰"은 이용자가 구매신청한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 환급 절차를 취합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제15조 (청약철회 등)</h2>
              <div className="space-y-2">
                <p>① "몰"과 디지털 콘텐츠 구매에 관한 계약을 체결한 이용자는 콘텐츠를 공급받은 날로부터 7일 이내에 청약철회를 할 수 있습니다.</p>
                <p>② 단, 다음 각 호의 경우에는 이용자가 청약철회를 할 수 없습니다.</p>
                <p className="ml-4">• 디지털 콘텐츠의 공급이 시작된 경우 (카카오 알림톡, 문자, 이메일 등을 통해 리포트 파일이나 다운로드 링크가 전송된 경우)</p>
                <p className="ml-4">• 이용자의 주문에 따라 개별적으로 생성되는 맞춤형 서비스의 특성상 제작이 시작된 경우</p>
                <p className="ml-4">• 기타 전자상거래법 등 관련 법령에서 정하는 청약철회 제한 사유에 해당하는 경우</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제16조 (청약철회 등의 효과)</h2>
              <p>
                ① "몰"은 이용자로부터 청약철회 요청을 받은 경우, 리포트 제작 및 발송 전임이 확인되면 3영업일 이내에 이미 지급받은 대금을 환급합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제17조 (개인정보보호)</h2>
              <div className="space-y-2">
                <p>① "몰"은 서비스 제공을 위해 필요한 최소한의 개인정보(성별, 생년월일시, 연락처 등)를 수집합니다.</p>
                <p>② 구글 및 카카오 로그인을 통해 수집된 정보는 회원 관리 및 서비스 배송 목적으로만 사용됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제18조 ("몰"의 의무)</h2>
              <p>
                ① "몰"은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제19조 (이용자의 의무)</h2>
              <p>
                ① 이용자는 신청 또는 변경 시 허위 내용의 등록, 타인의 정보 도용, "몰"이 제공하는 리포트의 무단 복제·유출·재판매 등을 하여서는 안 됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제20조 (저작권의 귀속 및 이용제한)</h2>
              <div className="space-y-2">
                <p>① "몰"이 작성한 저작물 및 AI 분석 알고리즘에 대한 저작권 기타 지식재산권은 원포세븐에 귀속합니다.</p>
                <p>② 이용자는 서비스를 통해 얻은 정보를 "몰"의 사전 승낙 없이 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제21조 (AI 서비스의 면책 및 한계)</h2>
              <div className="space-y-2">
                <p>① 본 서비스는 인공지능(AI) 기술을 활용한 데이터 분석 결과를 제공하며, 이는 명리학적 이론에 기반한 확률적 해석입니다. 결과의 절대적 정확성이나 적중 여부를 보증하지 않습니다.</p>
                <p>② 리포트의 내용은 이용자의 판단을 돕기 위한 참고 자료일 뿐이며, 이를 신뢰하여 행한 이용자의 유무형적 결정(투자, 진로, 결혼 등) 및 그 결과에 대해 "몰"은 어떠한 법적 책임도 지지 않습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">제22조 (재판권 및 준거법)</h2>
              <p>
                ① "몰"과 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 대한민국법을 적용합니다.
              </p>
            </section>

            <section className="mt-16 pt-10 border-t border-white/10">
              <p className="text-sm text-white/40">
                <strong>부칙</strong><br />
                이 약관은 2026년 2월 13일부터 시행합니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
