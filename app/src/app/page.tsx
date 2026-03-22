'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProfile, saveProfile, getAgeMonths, getSavedRecipes, BabyProfile } from '@/lib/localStorage';
import AdBanner from '@/components/AdBanner';

export default function Home() {
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [form, setForm] = useState({ name: '', birthDate: '' });
  const [recentRecipes, setRecentRecipes] = useState<{ title: string; id: string }[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setProfile(p);
      const recipes = getSavedRecipes().slice(0, 3);
      setRecentRecipes(recipes.map(r => ({ title: r.title, id: r.id })));
    } else {
      setShowSetup(true);
    }
  }, []);

  const handleSaveProfile = () => {
    if (!form.name || !form.birthDate) return;
    const p: BabyProfile = { name: form.name, birthDate: form.birthDate, allergies: [] };
    saveProfile(p);
    setProfile(p);
    setShowSetup(false);
  };

  const ageMonths = profile ? getAgeMonths(profile.birthDate) : 0;

  return (
    <main className="min-h-screen bg-amber-50 p-4 max-w-md mx-auto">
      {/* 헤더 */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-amber-700">🍼 베이비밀</h1>
        <p className="text-amber-600 mt-1 text-sm">오늘 뭐 먹이지? 고민 끝!</p>
      </div>

      {/* 프로필 카드 */}
      {profile && (
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800">{profile.name}</p>
            <p className="text-sm text-gray-500">{ageMonths}개월 · {getStageLabel(ageMonths)}</p>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className="text-xs text-gray-400 underline"
          >
            변경
          </button>
        </div>
      )}

      {/* 메인 버튼 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/recipe" className="bg-white rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🥕</div>
          <p className="font-bold text-gray-800">재료로 만들기</p>
          <p className="text-xs text-gray-400 mt-1">냉장고 재료 선택</p>
        </Link>
        <Link href="/gacha" className="bg-amber-400 rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🎰</div>
          <p className="font-bold text-white">오늘의 뽑기</p>
          <p className="text-xs text-amber-100 mt-1">랜덤 레시피 추천</p>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/history" className="bg-white rounded-2xl p-4 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="text-2xl mb-1">📋</div>
          <p className="font-semibold text-gray-700 text-sm">저장된 레시피</p>
        </Link>
        <Link href="/badge" className="bg-white rounded-2xl p-4 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="text-2xl mb-1">🏅</div>
          <p className="font-semibold text-gray-700 text-sm">식재료 뱃지</p>
        </Link>
      </div>

      {/* 광고 배너 */}
      <AdBanner slot="ADSENSE_SLOT_HOME" className="mb-4 rounded-xl overflow-hidden" />

      {/* 최근 레시피 */}
      {recentRecipes.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-bold text-gray-700 mb-3">최근 레시피</p>
          {recentRecipes.map(r => (
            <div key={r.id} className="py-2 border-b last:border-0 text-sm text-gray-600">
              {r.title}
            </div>
          ))}
        </div>
      )}

      {/* 이유식 단계 가이드 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mt-4">
        <h2 className="font-bold text-gray-800 mb-3">📖 이유식 단계 가이드</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="border-l-4 border-amber-200 pl-3">
            <p className="font-semibold text-gray-700">초기 이유식 (6~8개월)</p>
            <p>쌀미음으로 시작해 채소·과일 퓨레를 도입합니다. 한 가지 재료씩 4일 이상 먹여보며 알레르기 반응을 확인하세요. 하루 1~2회, 한 번에 1~2 티스푼부터 시작합니다.</p>
          </div>
          <div className="border-l-4 border-amber-300 pl-3">
            <p className="font-semibold text-gray-700">중기 이유식 (9~11개월)</p>
            <p>다양한 재료를 조합할 수 있습니다. 으깬 형태의 죽과 부드러운 핑거푸드를 시도해보세요. 소고기·닭고기 등 단백질 식품도 이 시기에 꼭 넣어주세요. 하루 2~3회 규칙적으로 먹입니다.</p>
          </div>
          <div className="border-l-4 border-amber-400 pl-3">
            <p className="font-semibold text-gray-700">후기 이유식 (12~15개월)</p>
            <p>무른밥·진밥으로 넘어가는 시기입니다. 가족 식사에 가까운 형태로 점차 전환하며, 다양한 요리를 경험시켜 주세요. 편식이 시작될 수 있으니 색깔·질감 다양성이 중요합니다.</p>
          </div>
          <div className="border-l-4 border-amber-500 pl-3">
            <p className="font-semibold text-gray-700">완료기·유아식 (16개월+)</p>
            <p>가족과 거의 같은 음식을 먹을 수 있습니다. 단, 염분·당분은 아직 줄여주세요. 잔치국수, 프리타타, 리조또 등 다양한 메뉴를 즐길 수 있는 시기입니다.</p>
          </div>
        </div>
      </div>

      {/* 이유식 TIP */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm mt-4">
        <h2 className="font-bold text-gray-800 mb-3">💡 이유식 꿀팁</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>🥩 <strong>철분이 풍부한 소고기</strong>는 6개월부터 꼭 먹이세요. 모유 속 철분이 부족해지는 시기입니다.</li>
          <li>🥜 <strong>알레르기 유발 식품</strong>(계란, 땅콩, 생선 등)은 오히려 일찍 도입할수록 알레르기 예방에 도움이 됩니다.</li>
          <li>🧂 <strong>1세 미만</strong>에는 소금·설탕·꿀을 넣지 마세요. 아이 신장에 부담이 됩니다.</li>
          <li>🌿 <strong>채소 거부</strong> 시 소고기 육수에 채소를 섞거나, 으깨서 죽에 숨겨보세요.</li>
          <li>❄️ <strong>냉동 보관</strong>이 가능한 이유식은 주 1~2회 대량 조리해 얼려두면 편리합니다.</li>
          <li>🍳 <strong>재료를 바꿔가며</strong> 다양한 맛을 경험시켜주는 것이 편식 예방의 핵심입니다.</li>
        </ul>
      </div>

      {/* 피드백 */}
      <div className="mt-6 text-center">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfVHPGPiZYdd0XRIaU0WsbAyB5JB5jkNWlb5Kq4OHTlIXYutA/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 underline"
        >
          💬 불편사항 / 개선 의견 보내기
        </a>
      </div>

      {/* 프로필 설정 모달 */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">아이 정보 입력</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">이름</label>
                <input
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="아이 이름"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">생년월일</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2 mt-1"
                  value={form.birthDate}
                  onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {profile && (
                <button
                  onClick={() => setShowSetup(false)}
                  className="flex-1 py-2 border rounded-lg text-gray-600"
                >
                  취소
                </button>
              )}
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2 bg-amber-400 text-white rounded-lg font-bold"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function getStageLabel(months: number): string {
  if (months < 6) return '모유/분유';
  if (months < 9) return '초기 이유식';
  if (months < 12) return '중기 이유식';
  if (months < 16) return '후기 이유식';
  if (months < 24) return '완료기';
  return '유아식';
}
