"use client";

interface PrivacyModalProps {
  onClose: () => void;
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
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
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-10">개인정보처리방침</h1>

          <div className="space-y-12 text-white/70 leading-relaxed font-light">
            <section>
              <p className="mb-4">
                원포세븐(타라사주)(이하 "회사")은 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률, 개인정보보호법 등 개인정보와 관련된 법령 상의 개인정보보호 규정과 방송통신위원회 및 행정안전부가 제정한 개인정보 보호지침을 준수하고 있습니다.
              </p>
              <p className="mb-4">
                회사는 개인정보 처리방침을 통하여 이용자께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
              </p>
              <p>
                본 개인정보 처리방침은 관련 법령 및 지침의 변경 또는 내부 운영방침의 변경에 따라 변경될 수 있습니다. 개인정보 처리방침이 변경되는 경우 회사는 그 변경사항을 본 웹사이트의 공지사항을 통하여 사전 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제1조 (수집하는 개인정보의 항목 및 수집 방법)</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">1. 수집하는 개인정보의 항목</p>
                  <p className="mb-3">회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.</p>

                  <div className="ml-4 space-y-3">
                    <div>
                      <p className="font-medium text-white">가. 회원가입 및 서비스 이용 시 수집하는 항목</p>
                      <div className="ml-4 space-y-2 mt-2">
                        <p><strong>[필수]</strong> 이메일 주소, 성명, 소셜 서비스 식별번호(Google UID 또는 Kakao UID), 프로필 이미지</p>
                        <p><strong>[선택]</strong> 프로필 정보 (닉네임, 프로필 사진 등)</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-white">나. 사주 분석 서비스 이용 시 수집하는 항목</p>
                      <div className="ml-4 space-y-2 mt-2">
                        <p><strong>[필수]</strong> 성명, 성별, 생년월일시(양력/음력), 휴대전화번호</p>
                        <p className="text-sm text-white/40">※ 사주 분석을 위한 기본 정보이며, 리포트 전송(알림톡/문자)을 위해 휴대전화번호가 필요합니다.</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-white">다. 결제 시 수집하는 항목</p>
                      <div className="ml-4 space-y-2 mt-2">
                        <p><strong>[필수]</strong> 주문자 정보(성명, 이메일, 휴대전화번호), 결제 정보</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-white">라. 서비스 이용 과정에서 자동으로 생성되어 수집되는 항목</p>
                      <div className="ml-4 mt-2">
                        <p>IP주소, 쿠키, 서비스 이용 기록, 방문 기록, 접속 로그, 불량 이용 기록, 기기 정보(OS, 브라우저 종류 등)</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-white">마. Q&A 및 리뷰 작성 시 수집하는 항목</p>
                      <div className="ml-4 space-y-2 mt-2">
                        <p><strong>[비회원 Q&A 작성]</strong> 작성자명, 이메일 주소, 비밀번호(해시 암호화), 문의 내용</p>
                        <p><strong>[리뷰 작성]</strong> 주문 정보, 리뷰 내용, 평점, 리뷰 이미지(선택)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">2. 개인정보 수집 방법</p>
                  <div className="ml-4 space-y-1">
                    <p>• 웹사이트 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력</p>
                    <p>• Google, Kakao 등 외부 소셜 로그인 서비스를 통한 자동 수집</p>
                    <p>• 서비스 이용 과정에서 자동 생성 및 수집 (쿠키, 로그 분석 도구 등)</p>
                    <p>• 고객센터를 통한 상담 과정에서 전화, 이메일 등을 통한 수집</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제2조 (개인정보의 수집 및 이용 목적)</h2>
              <div className="space-y-4">
                <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-medium">1. 회원 가입 및 관리</p>
                    <p className="text-sm ml-4 text-gray-600">회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고충처리</p>
                  </div>

                  <div>
                    <p className="font-medium">2. 재화 또는 서비스 제공</p>
                    <p className="text-sm ml-4 text-gray-600">AI 사주 분석 리포트(콘텐츠) 제공, 맞춤형 사주 분석 서비스 제공, 리포트 생성 및 전송(알림톡, 문자메시지, 이메일), 본인인증, 구매 및 요금 결제, 요금 추심</p>
                  </div>

                  <div>
                    <p className="font-medium">3. 민원 처리</p>
                    <p className="text-sm ml-4 text-gray-600">민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보, Q&A 답변 알림</p>
                  </div>

                  <div>
                    <p className="font-medium">4. 마케팅 및 광고 활용 (선택)</p>
                    <p className="text-sm ml-4 text-gray-600">신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제3조 (개인정보의 보유 및 이용기간)</h2>
              <div className="space-y-4">
                <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>

                <div className="ml-4 space-y-4">
                  <div>
                    <p className="font-medium">1. 회원 정보</p>
                    <p className="text-sm ml-4 text-gray-600">회원 탈퇴 시까지 보유·이용</p>
                    <p className="text-sm ml-4 text-gray-600">단, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지 보유·이용</p>
                  </div>

                  <div>
                    <p className="font-medium">2. 사주 분석 서비스 이용 정보</p>
                    <p className="text-sm ml-4 text-gray-600">서비스 제공 완료 시까지 보유·이용</p>
                    <p className="text-sm ml-4 text-gray-600">단, 아래 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보유</p>
                  </div>

                  <div>
                    <p className="font-medium">3. 관련 법령에 의한 정보 보유</p>
                    <p className="text-sm ml-4 mb-2 text-gray-600">상법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
                    <div className="ml-4 space-y-1 text-sm">
                      <p>• 계약 또는 청약철회 등에 관한 기록: 5년 보관 (전자상거래법)</p>
                      <p>• 대금결제 및 재화 등의 공급에 관한 기록: 5년 보관 (전자상거래법)</p>
                      <p>• 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보관 (전자상거래법)</p>
                      <p>• 표시·광고에 관한 기록: 6개월 보관 (전자상거래법)</p>
                      <p>• 웹사이트 방문기록(로그인 기록, 접속 기록): 3개월 보관 (통신비밀보호법)</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/40 mt-6">※ 회원 탈퇴 시 개인정보는 지체 없이 파기되나, 상기 법령에 따라 일정 기간 보관이 필요한 정보는 별도의 데이터베이스(DB)로 옮겨져 내부 방침 및 기타 관련 법령에 따라 안전하게 보관된 후 파기됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제4조 (개인정보의 파기절차 및 방법)</h2>
              <div className="space-y-4">
                <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.</p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-medium">1. 파기절차</p>
                    <p className="text-sm ml-4 text-gray-600">이용자가 서비스 이용 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유 목적 이외의 다른 목적으로 이용되지 않습니다.</p>
                  </div>

                  <div>
                    <p className="font-medium">2. 파기방법</p>
                    <p className="text-sm ml-4 text-gray-600">전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법(Low Level Format 등)을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제5조 (이용자 및 법정대리인의 권리와 그 행사방법)</h2>
              <div className="space-y-6">
                <div>
                  <p className="font-medium text-white">1. 이용자의 권리</p>
                  <div className="ml-4 space-y-2 text-sm text-gray-600">
                    <p>① 이용자는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
                    <div className="ml-4 space-y-1">
                      <p>• 개인정보 열람 요구</p>
                      <p>• 개인정보에 오류 등이 있을 경우 정정 요구</p>
                      <p>• 개인정보 삭제 요구</p>
                      <p>• 개인정보 처리정지 요구</p>
                    </div>
                    <p className="mt-2">② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 팩스 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
                    <p>③ 이용자가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</p>
                    <p>④ 제1항에 따른 권리 행사는 이용자의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>
                    <p>⑤ 이용자는 개인정보보호법 등 관계법령을 위반하여 회사가 처리하고 있는 이용자 본인이나 타인의 개인정보 및 사생활을 침해하여서는 아니 됩니다.</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-medium">2. 만 14세 미만 아동의 개인정보 처리</p>
                  <p className="text-sm ml-4 text-gray-600">회사는 만 14세 미만 아동의 개인정보를 수집하지 않습니다. 다만, 만 14세 미만 아동의 개인정보 처리가 필요한 경우 법정대리인의 동의를 받아 처리합니다.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제6조 (개인정보의 안전성 확보 조치)</h2>
              <div className="space-y-4">
                <p>회사는 개인정보보호법 제29조에 따라 개인정보의 안전성 확보를 위해 다음과 같은 기술적·관리적·물리적 조치를 하고 있습니다.</p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-medium">1. 관리적 조치</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 내부관리계획 수립 및 시행</p>
                      <p>• 개인정보 취급 직원의 최소화 및 교육</p>
                      <p>• 정기적인 자체 감사 실시</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">2. 기술적 조치</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 개인정보처리시스템 등의 접근권한 관리 (Supabase RLS 정책 적용)</p>
                      <p>• 개인정보의 암호화: 이용자의 비밀번호는 SHA-256 해시 암호화하여 저장 및 관리</p>
                      <p>• 개인정보에 대한 접근 제한: 데이터베이스 접근 권한을 최소한으로 제한</p>
                      <p>• HTTPS 통신 암호화를 통한 데이터 전송 보안</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">3. 물리적 조치</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 클라우드 서비스 제공업체(Vercel, Supabase)의 물리적 보안 시설 활용</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제7조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-white mb-2">1. 쿠키(Cookie)의 사용</p>
                  <p className="text-sm text-gray-600 mb-2">회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
                </div>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-medium">가. 쿠키란?</p>
                    <p className="text-sm ml-4 text-gray-600">쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 텍스트 파일로서 이용자의 컴퓨터 하드디스크에 저장됩니다. 이후 이용자가 웹 사이트에 방문할 경우 웹 사이트 서버는 이용자의 하드 디스크에 저장되어 있는 쿠키의 내용을 읽어 이용자의 환경설정을 유지하고 맞춤화된 서비스를 제공하기 위해 이용됩니다.</p>
                  </div>

                  <div>
                    <p className="font-medium">나. 쿠키의 사용 목적</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태 파악</p>
                      <p>• 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공</p>
                      <p>• 이용자의 관심 분야에 따라 차별화된 정보 제공</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">다. 쿠키의 설치·운영 및 거부</p>
                    <p className="text-sm ml-4 text-gray-600 mb-2">이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</p>
                    <p className="text-sm ml-4 text-gray-600 mb-2 font-medium">쿠키 설정 거부 방법 (브라우저별)</p>
                    <div className="ml-4 text-sm space-y-1">
                      <p>• <strong>크롬(Chrome):</strong> 설정 → 개인정보 및 보안 → 서드파티 쿠키 → 서드파티 쿠키 차단 여부 선택</p>
                      <p>• <strong>사파리(Safari):</strong> 설정 → Safari → 개인정보 보호 및 보안 → 모든 쿠키 차단 활성화</p>
                      <p>• <strong>엣지(Edge):</strong> 설정 → 쿠키 및 사이트 권한 → 쿠키 및 사이트 데이터 관리 및 삭제 → 타사 쿠키 차단 선택</p>
                      <p>• <strong>파이어폭스(Firefox):</strong> 설정 → 개인정보 및 보안 → 쿠키 및 사이트 데이터 → 사용자 지정 설정</p>
                    </div>
                    <p className="text-sm ml-4 text-gray-600 mt-2">※ 쿠키의 저장을 거부할 경우 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제8조 (행태정보의 수집·이용·제공 및 거부 등에 관한 사항)</h2>
              <div className="space-y-4">
                <p>회사는 서비스 이용과정에서 정보주체에게 최적화된 맞춤형 서비스 및 혜택, 온라인 맞춤형 광고 등을 제공하기 위하여 행태정보를 수집·이용하고 있습니다.</p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-medium">1. 행태정보 자동 수집 현황</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• <strong>수집하는 행태정보 항목:</strong> 이용자의 웹/앱 방문 이력, 검색 이력, 구매 이력</p>
                      <p>• <strong>수집 방법:</strong> 이용자의 웹/앱 방문 및 실행 시 자동 수집 (쿠키, 웹로그 분석)</p>
                      <p>• <strong>수집 목적:</strong> 이용자 맞춤형 상품 추천 서비스 제공, 서비스 이용 통계·분석</p>
                      <p>• <strong>보유 및 이용기간:</strong> 수집일로부터 최대 2년</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">2. 이용자의 권리 및 거부 방법</p>
                    <p className="text-sm ml-4 text-gray-600">이용자는 위와 같은 행태정보 수집·이용·제공에 대하여 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하는 경우에도 서비스 이용은 가능하나 이용자 맞춤형 서비스 및 혜택 제공에 제한이 있을 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제9조 (웹 사이트 분석 도구 (Google Analytics) 사용)</h2>
              <div className="space-y-4">
                <p>본 웹사이트는 웹 분석 서비스인 구글 애널리틱스(Google Analytics)를 사용하고 있습니다. 구글 애널리틱스는 웹사이트의 이용 분석을 위해 '쿠키'를 사용합니다. 쿠키를 통해 생성되는 귀하의 웹사이트 이용에 관한 정보는 미국에 소재한 구글 서버로 전송되어 저장됩니다.</p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-medium">1. 수집 정보</p>
                    <p className="text-sm ml-4 text-gray-600">페이지뷰, 세션 지속시간, 사용 환경(디바이스, 브라우저, OS 등), 대략적인 위치 정보(IP 주소 기반, 익명화 처리)</p>
                  </div>

                  <div>
                    <p className="font-medium">2. 사용 목적</p>
                    <p className="text-sm ml-4 text-gray-600">웹사이트 이용 현황 분석, 웹사이트 성능 개선, 이용자 편의성 향상</p>
                  </div>

                  <div>
                    <p className="font-medium">3. 개인정보 보호</p>
                    <p className="text-sm ml-4 text-gray-600">구글 애널리틱스는 IP 익명화 기능을 사용하고 있어 수집된 IP 주소는 익명화되어 처리됩니다. 따라서 특정 개인을 식별할 수 없습니다.</p>
                  </div>

                  <div>
                    <p className="font-medium">4. 거부 방법</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>이용자는 다음의 방법으로 구글 애널리틱스의 데이터 수집을 거부할 수 있습니다.</p>
                      <p>• 브라우저 쿠키 설정 변경을 통한 거부</p>
                      <p>• 구글 애널리틱스 차단 브라우저 애드온 설치 (<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://tools.google.com/dlpage/gaoptout</a>)</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">5. 추가 정보</p>
                    <p className="text-sm ml-4 text-gray-600">구글의 개인정보처리방침 및 이용약관은 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a> 에서 확인하실 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제10조 (개인정보 처리 업무의 위탁)</h2>
              <div className="space-y-3">
                <p>회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.</p>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="min-w-full divide-y divide-white/10 text-sm">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-5 py-4 text-left font-bold text-white uppercase tracking-wider">위탁받는 자<br />(수탁자)</th>
                        <th className="px-5 py-4 text-left font-bold text-white uppercase tracking-wider">위탁 업무 내용</th>
                        <th className="px-5 py-4 text-left font-bold text-white uppercase tracking-wider">보유 및 이용기간</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-white/2">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">알리고 (ALIGO)</td>
                        <td className="px-4 py-3">알림톡, 문자메시지(SMS/LMS) 전송 및 리포트 링크 배송</td>
                        <td className="px-4 py-3">회원탈퇴 또는 위탁계약 종료 시까지</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Vercel Inc.</td>
                        <td className="px-4 py-3">클라우드 서버 호스팅 및 웹 인프라 운영</td>
                        <td className="px-4 py-3">회원탈퇴 또는 위탁계약 종료 시까지</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Google LLC</td>
                        <td className="px-4 py-3">구글 애널리틱스 웹 로그 분석 및 소셜 로그인 서비스 제공</td>
                        <td className="px-4 py-3">회원탈퇴 또는 위탁계약 종료 시까지</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">카카오 (Kakao Corp.)</td>
                        <td className="px-4 py-3">카카오 소셜 로그인 연동 서비스 제공</td>
                        <td className="px-4 py-3">회원탈퇴 또는 위탁계약 종료 시까지</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Supabase, Inc.</td>
                        <td className="px-4 py-3">사용자 인증 관리 및 데이터베이스 저장 (서버 위치: 싱가포르)</td>
                        <td className="px-4 py-3">회원탈퇴 또는 위탁계약 종료 시까지</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-gray-600 mt-3">※ 회사는 위탁계약 체결 시 개인정보보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
                <p className="text-sm text-gray-600 mt-2">※ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제11조 (개인정보의 제3자 제공)</h2>
              <div className="space-y-4">
                <p>회사는 원칙적으로 이용자의 개인정보를 제1조(수집하는 개인정보의 항목)에서 명시한 범위 내에서 처리하며, 이용자의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.</p>
                <p>다만, 다음의 경우에는 예외로 합니다.</p>
                <div className="ml-4 text-sm text-gray-600 space-y-1">
                  <p>• 이용자가 사전에 동의한 경우</p>
                  <p>• 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</p>
                  <p>• 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 제공하는 경우</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제12조 (개인정보의 국외 이전)</h2>
              <div className="space-y-4">
                <p>회사는 서비스 제공을 위해 이용자의 개인정보를 국외로 이전하여 처리하고 있습니다. 개인정보가 국외로 이전되는 경우는 다음과 같습니다.</p>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <p className="font-bold text-white mb-4">▶ Supabase, Inc.</p>
                    <div className="ml-4 text-sm space-y-1.5">
                      <p>• <strong>이전받는 자:</strong> Supabase, Inc.</p>
                      <p>• <strong>이전되는 국가:</strong> 싱가포르 (Singapore)</p>
                      <p>• <strong>이전 일시 및 방법:</strong> 서비스 이용 시점에 네트워크를 통한 전송</p>
                      <p>• <strong>이전되는 개인정보 항목:</strong> 이메일 주소, 성명, 생년월일시, 성별, 휴대전화번호, 주문 정보</p>
                      <p>• <strong>이전받는 자의 개인정보 이용 목적:</strong> 사용자 인증 관리 및 데이터베이스 저장 (제3자 공유 없음, 저장 목적으로만 사용)</p>
                      <p>• <strong>이전받는 자의 개인정보 보유 및 이용 기간:</strong> 회원 탈퇴 시 또는 위탁 계약 종료 시까지</p>
                      <p>• <strong>연락처:</strong> support@supabase.io</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <p className="font-bold text-white mb-4">▶ Google LLC</p>
                    <div className="ml-4 text-sm space-y-1.5">
                      <p>• <strong>이전받는 자:</strong> Google LLC</p>
                      <p>• <strong>이전되는 국가:</strong> 미국 (United States)</p>
                      <p>• <strong>이전 일시 및 방법:</strong> 서비스 이용 시점에 네트워크를 통한 전송</p>
                      <p>• <strong>이전되는 개인정보 항목:</strong> 쿠키, 서비스 이용 기록, 접속 로그, 기기 정보 (Google Analytics), 이메일 주소, 성명, 프로필 이미지 (Google 로그인)</p>
                      <p>• <strong>이전받는 자의 개인정보 이용 목적:</strong> 웹사이트 이용 통계 분석 및 소셜 로그인 서비스 제공</p>
                      <p>• <strong>이전받는 자의 개인정보 보유 및 이용 기간:</strong> Google 개인정보처리방침에 따름 (최대 26개월)</p>
                      <p>• <strong>참고:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:underline">https://policies.google.com/privacy</a></p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <p className="font-bold text-white mb-4">▶ Vercel Inc.</p>
                    <div className="ml-4 text-sm space-y-1.5">
                      <p>• <strong>이전받는 자:</strong> Vercel Inc.</p>
                      <p>• <strong>이전되는 국가:</strong> 미국 (United States)</p>
                      <p>• <strong>이전 일시 및 방법:</strong> 서비스 이용 시점에 네트워크를 통한 전송</p>
                      <p>• <strong>이전되는 개인정보 항목:</strong> IP 주소, 접속 로그, 쿠키</p>
                      <p>• <strong>이전받는 자의 개인정보 이용 목적:</strong> 웹 호스팅 및 CDN 서비스 제공</p>
                      <p>• <strong>이전받는 자의 개인정보 보유 및 이용 기간:</strong> 위탁 계약 종료 시까지</p>
                      <p>• <strong>참고:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:underline">https://vercel.com/legal/privacy-policy</a></p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4">※ 이용자는 위 개인정보의 국외 이전에 대한 동의를 거부할 권리가 있으나, 동의를 거부하는 경우 서비스 이용이 제한될 수 있습니다.</p>
                <p className="text-sm text-gray-600">※ 회사는 국외 이전 시 개인정보보호법 제39조의13에 따라 개인정보가 안전하게 관리될 수 있도록 필요한 조치를 취하고 있습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제13조 (개인정보 보호책임자 및 담당자)</h2>
              <div className="space-y-4">
                <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>

                <div className="bg-blue-500/5 rounded-2xl border border-blue-500/20 p-6">
                  <p className="font-bold text-[#60a5fa] mb-4">▶ 개인정보 보호책임자</p>
                  <div className="ml-4 text-sm space-y-2 text-white/60">
                    <p><strong className="text-white/80">성명:</strong> 고수빈</p>
                    <p><strong className="text-white/80">직책:</strong> 대표</p>
                    <p><strong>연락처:</strong> 010-4648-0046</p>
                    <p><strong>이메일:</strong> binzzz010101@gmail.com</p>
                    <p><strong>주소:</strong> 경기도 양주시 옥정동로7다길 12-21, 301호-A431호</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3">정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제14조 (개인정보 열람 청구)</h2>
              <div className="space-y-4">
                <p>정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.</p>

                <div className="ml-4 space-y-2">
                  <p className="font-medium">▶ 개인정보 열람청구 접수·처리 부서</p>
                  <div className="ml-4 text-sm text-gray-600 space-y-1">
                    <p>• <strong>담당자:</strong> 고수빈</p>
                    <p>• <strong>연락처:</strong> 010-4648-0046</p>
                    <p>• <strong>이메일:</strong> binzzz010101@gmail.com</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">제15조 (권익침해 구제방법)</h2>
              <div className="space-y-6">
                <p>정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.</p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-medium">1. 개인정보분쟁조정위원회</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 소관업무: 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)</p>
                      <p>• 홈페이지: <a href="https://www.koprico.go.kr" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:underline">www.koprico.go.kr</a></p>
                      <p>• 전화: (국번없이) 1833-6972</p>
                      <p>• 주소: (03171) 서울특별시 종로구 세종대로 209 정부서울청사 4층</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">2. 개인정보침해신고센터 (한국인터넷진흥원 운영)</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 소관업무: 개인정보 침해사실 신고, 상담 신청</p>
                      <p>• 홈페이지: <a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:underline">privacy.kisa.or.kr</a></p>
                      <p>• 전화: (국번없이) 118</p>
                      <p>• 주소: (58324) 전남 나주시 진흥길 9(빛가람동 301-2) 3층 개인정보침해신고센터</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">3. 대검찰청 사이버범죄수사단</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 홈페이지: <a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:underline">www.spo.go.kr</a></p>
                      <p>• 전화: (국번없이) 1301</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">4. 경찰청 사이버안전국</p>
                    <div className="ml-4 text-sm text-gray-600 space-y-1">
                      <p>• 홈페이지: <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:underline">ecrm.cyber.go.kr</a></p>
                      <p>• 전화: (국번없이) 182</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4">※ 개인정보보호법 제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.</p>
                <p className="text-sm text-white/40">※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(<a href="https://www.simpan.go.kr" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:underline">www.simpan.go.kr</a>) 홈페이지를 참고하시기 바랍니다.</p>
              </div>
            </section>



            <section>
              <h2 className="text-xl font-bold text-white mb-6">제16조 (개인정보 처리방침의 변경)</h2>
              <div className="space-y-4">
                <p>이 개인정보 처리방침은 2026년 2월 13일부터 적용됩니다.</p>
                <p>본 개인정보 처리방침의 내용 추가, 삭제 및 수정이 있을 경우에는 개정 최소 7일 전에 웹사이트의 '공지사항'을 통해 사전 공지를 할 것입니다. 다만, 수집하는 개인정보의 항목, 이용목적의 변경 등과 같이 이용자 권리의 중대한 변경이 발생할 때에는 최소 30일 전에 공지하며, 필요 시 이용자 동의를 다시 받을 수도 있습니다.</p>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="font-medium text-white/60">• 공고일자: 2026년 2월 13일</p>
                  <p className="font-medium text-white/60">• 시행일자: 2026년 2월 13일</p>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">개인정보 처리방침 이전 버전 보기</h2>
              <p className="text-sm text-white/40">• 2026년 2월 13일 ~ 현재 (현재 버전)</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
