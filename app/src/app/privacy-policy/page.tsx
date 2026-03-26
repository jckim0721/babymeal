import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 베이비밀',
  description: '베이비밀 개인정보처리방침 — 수집 정보, 이용 목적, 보관 기간 안내',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="text-orange-500 text-sm mb-6 inline-block">← 홈으로</Link>

        <h1 className="text-3xl font-bold text-orange-600 mb-2">개인정보처리방침</h1>
        <p className="text-gray-500 text-sm mb-8">최종 수정일: 2026년 3월 26일</p>

        <div className="space-y-6">

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">1. 개요</h2>
            <p className="text-gray-700 leading-relaxed">
              베이비밀(이하 "서비스")은 사용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
              본 방침은 서비스가 수집하는 정보의 종류, 이용 목적, 보관 방법 등을 안내합니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">2. 수집하는 정보</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              서비스는 별도의 회원가입 없이 이용 가능하며, 다음 정보를 사용자의 기기(브라우저 로컬 스토리지)에만 저장합니다.
              해당 정보는 서버로 전송되거나 제3자에게 공유되지 않습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>아기 이름 (선택 입력)</li>
              <li>아기 생년월일 (개월수 계산 목적)</li>
              <li>알레르기 식품 목록 (안전 경고 목적)</li>
              <li>저장된 이유식 레시피 내역</li>
              <li>100가지 식재료 챌린지 진행 현황</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">3. AI 레시피 생성</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              레시피 생성 요청 시 다음 정보가 Anthropic(Claude AI) 서버로 전송됩니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>아기 개월수 (생년월일에서 계산된 수치)</li>
              <li>선택한 식재료 목록</li>
              <li>알레르기 식품 목록</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              아기 이름 등 직접적인 식별 정보는 전송되지 않습니다.
              Anthropic의 데이터 처리 방식은{' '}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                Anthropic 개인정보처리방침
              </a>
              을 참고하세요.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">4. 광고 및 쿠키</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              서비스는 Google AdSense를 통한 광고를 게재할 수 있습니다. Google은 광고 제공을 위해 쿠키를 사용하며,
              맞춤 광고 비활성화는{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                Google 광고 설정
              </a>
              에서 할 수 있습니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              서비스는 쿠팡 파트너스 제휴 링크를 포함할 수 있습니다. 해당 링크를 통해 구매 시 소정의 수수료가 지급될 수 있으며,
              이는 사용자에게 추가 비용을 발생시키지 않습니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">5. 정보 보관 및 삭제</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              로컬 스토리지에 저장된 모든 데이터는 사용자가 직접 삭제할 수 있습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>브라우저 설정 → 사이트 데이터 삭제</li>
              <li>또는 서비스 내 프로필 초기화 기능 이용</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              서버에는 개인 데이터가 저장되지 않으므로 별도의 서버 측 삭제 절차는 없습니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">6. 아동 개인정보</h2>
            <p className="text-gray-700 leading-relaxed">
              서비스는 14세 미만 아동의 직접 이용을 대상으로 하지 않으며, 보호자가 아기를 위해 이용하는 서비스입니다.
              입력되는 아기 정보는 사용자의 기기에만 저장되며 외부로 공유되지 않습니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">7. 방침 변경</h2>
            <p className="text-gray-700 leading-relaxed">
              본 방침이 변경될 경우 이 페이지에 변경 내용을 게시합니다. 최신 방침은 항상 이 페이지에서 확인하실 수 있습니다.
            </p>
          </section>

        </div>

        <footer className="text-center text-gray-400 text-sm mt-10 space-x-4">
          <Link href="/about" className="hover:text-orange-500">서비스 소개</Link>
          <span>·</span>
          <Link href="/terms-of-service" className="hover:text-orange-500">이용약관</Link>
          <span>·</span>
          <Link href="/" className="hover:text-orange-500">홈</Link>
        </footer>
      </div>
    </main>
  );
}
