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
