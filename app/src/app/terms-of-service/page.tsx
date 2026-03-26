import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관 | 베이비밀',
  description: '베이비밀 서비스 이용약관',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="text-orange-500 text-sm mb-6 inline-block">← 홈으로</Link>

        <h1 className="text-3xl font-bold text-orange-600 mb-2">이용약관</h1>
        <p className="text-gray-500 text-sm mb-8">최종 수정일: 2026년 3월 26일</p>

        <div className="space-y-6">

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              이 약관은 베이비밀(이하 "서비스")이 제공하는 AI 이유식 레시피 서비스의 이용 조건 및 절차,
              서비스 제공자와 이용자의 권리·의무 등 기본적인 사항을 규정하는 것을 목적으로 합니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제2조 (서비스 내용)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">서비스는 다음 기능을 제공합니다.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>아기 개월수 및 선택 재료 기반 AI 이유식 레시피 생성</li>
              <li>개월수별 식품 안전 경고</li>
              <li>레시피 저장 및 이력 관리</li>
              <li>100가지 식재료 챌린지 및 배지 시스템</li>
              <li>랜덤 레시피 뽑기(가차)</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제3조 (면책 조항)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              서비스가 제공하는 이유식 레시피는 AI가 생성한 일반적인 참고 자료이며, 의학적·영양학적 전문 조언을 대체하지 않습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>아기마다 발달 속도, 알레르기 반응, 소화 기능이 다를 수 있습니다.</li>
              <li>새로운 식재료 도입 시 반드시 소량부터 시작하고 반응을 관찰하세요.</li>
              <li>의료적 조언이 필요한 경우 소아과 전문의와 상담하시기 바랍니다.</li>
              <li>서비스는 레시피 이용으로 인한 직접적·간접적 손해에 대해 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제4조 (AI 생성 콘텐츠)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              서비스의 레시피는 Anthropic Claude AI 모델이 생성합니다. AI 생성 특성상 다음 사항에 유의하시기 바랍니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>동일한 입력에도 결과가 다를 수 있습니다.</li>
              <li>레시피의 영양 수치는 참고용 추정값입니다.</li>
              <li>조리 시간 및 분량은 실제 상황에 맞게 조정이 필요할 수 있습니다.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제5조 (광고 및 제휴)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              서비스는 Google AdSense 광고 및 쿠팡 파트너스 제휴 링크를 포함할 수 있습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>광고 및 제휴 링크는 명확히 구분되어 표시됩니다.</li>
              <li>제휴 링크를 통한 구매는 사용자에게 추가 비용을 발생시키지 않습니다.</li>
              <li>서비스는 추천 상품의 품질에 대해 보증하지 않습니다.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제6조 (서비스 변경 및 중단)</h2>
            <p className="text-gray-700 leading-relaxed">
              서비스는 운영상 또는 기술적 사유로 서비스 내용을 변경하거나 중단할 수 있습니다.
              서비스 중단 시 사전 공지를 위해 노력하며, 로컬 스토리지의 데이터는 사용자 기기에 보관됩니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제7조 (이용자의 의무)</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>서비스를 불법적인 목적으로 이용하지 않습니다.</li>
              <li>서비스를 통해 생성된 레시피를 상업적으로 재판매하지 않습니다.</li>
              <li>서비스의 정상적인 운영을 방해하는 행위를 하지 않습니다.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">제8조 (약관 변경)</h2>
            <p className="text-gray-700 leading-relaxed">
              약관이 변경될 경우 이 페이지에 변경 내용과 시행일을 게시합니다.
              변경된 약관은 게시 후 서비스를 계속 이용하면 동의한 것으로 간주합니다.
            </p>
          </section>

        </div>

        <footer className="text-center text-gray-400 text-sm mt-10 space-x-4">
          <Link href="/about" className="hover:text-orange-500">서비스 소개</Link>
          <span>·</span>
          <Link href="/privacy-policy" className="hover:text-orange-500">개인정보처리방침</Link>
          <span>·</span>
          <Link href="/" className="hover:text-orange-500">홈</Link>
        </footer>
      </div>
    </main>
  );
}
