import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '베이비밀 소개 | 우리 아이 이유식 레시피 AI',
  description: '베이비밀은 인공지능이 아기의 개월수와 알레르기를 고려해 안전한 이유식 레시피를 추천해주는 서비스입니다.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="text-orange-500 text-sm mb-6 inline-block">← 홈으로</Link>

        <h1 className="text-3xl font-bold text-orange-600 mb-2">베이비밀 소개</h1>
        <p className="text-gray-500 text-sm mb-8">BabyMeal — AI 이유식 레시피 서비스</p>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">서비스 소개</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            베이비밀은 부모님들이 아기에게 안전하고 영양 있는 이유식을 손쉽게 만들 수 있도록 돕기 위해 탄생했습니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            아기의 생년월일을 입력하면 현재 개월수에 맞는 이유식 단계(초기·중기·후기·완료기)를 자동으로 계산하고,
            냉장고에 있는 재료를 선택하는 것만으로 AI가 맞춤형 레시피를 즉시 생성해드립니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            47가지 식품 안전 규칙을 기반으로 꿀, 생우유, 날것 식품 등 개월수별 위험 식재료를 자동으로 감지하고
            경고해드려 부모님의 걱정을 덜어드립니다.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">주요 기능</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">🍳</span>
              <div>
                <p className="font-semibold">AI 이유식 레시피 생성</p>
                <p className="text-sm text-gray-500">개월수와 재료를 선택하면 Claude AI가 적합한 레시피를 즉시 만들어드립니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold">식품 안전 경고</p>
                <p className="text-sm text-gray-500">꿀(보툴리눔독소), 생선회, 날계란 등 월령별 위험 식품을 자동으로 알려드립니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">🎰</span>
              <div>
                <p className="font-semibold">랜덤 레시피 뽑기</p>
                <p className="text-sm text-gray-500">오늘 뭐 먹이지 고민될 때, 가차 기능으로 재미있게 메뉴를 정해보세요.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">🏆</span>
              <div>
                <p className="font-semibold">100가지 식재료 챌린지</p>
                <p className="text-sm text-gray-500">아기가 경험한 식재료를 기록하고 배지를 모아보세요.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">기술 및 데이터</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            베이비밀은 Anthropic의 Claude AI 모델을 활용하여 레시피를 생성합니다. 입력하신 재료와 아기의 개월수 정보를
            바탕으로 안전하고 영양 균형 잡힌 이유식 레시피를 만들어드립니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            아기 프로필(이름, 생년월일, 알레르기), 저장된 레시피, 배지 기록은 모두 사용자의 기기(브라우저 로컬 스토리지)에만
            저장되며, 서버로 전송되거나 외부에 공개되지 않습니다.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">안전 안내</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            베이비밀이 제공하는 레시피는 일반적인 이유식 가이드라인을 기반으로 AI가 생성한 참고 자료입니다.
            아기마다 발달 속도, 알레르기 반응, 소화 능력이 다를 수 있으므로 반드시 보호자가 판단하여 적용해 주세요.
          </p>
          <p className="text-gray-700 leading-relaxed">
            새로운 식재료를 처음 시도할 때는 소량씩 시작하고 3~5일간 알레르기 반응을 관찰하는 것을 권장합니다.
            의료적 조언이 필요한 경우 소아과 전문의와 상담하시기 바랍니다.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">문의</h2>
          <p className="text-gray-700 leading-relaxed">
            서비스 이용 중 불편한 점이나 개선 의견이 있으시면 피드백을 남겨주세요.
            소중한 의견 하나하나가 서비스 개선에 반영됩니다.
          </p>
          <a
            href="https://forms.gle/feedback"
            className="inline-block mt-3 text-orange-500 font-semibold hover:underline"
          >
            피드백 보내기 →
          </a>
        </section>

        <footer className="text-center text-gray-400 text-sm mt-8 space-x-4">
          <Link href="/privacy-policy" className="hover:text-orange-500">개인정보처리방침</Link>
          <span>·</span>
          <Link href="/terms-of-service" className="hover:text-orange-500">이용약관</Link>
          <span>·</span>
          <Link href="/" className="hover:text-orange-500">홈</Link>
        </footer>
      </div>
    </main>
  );
}
