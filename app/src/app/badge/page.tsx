'use client';

import { useState, useEffect } from 'react';
import { getTriedIngredients } from '@/lib/localStorage';

// 100가지 도전 재료 목록
const ALL_INGREDIENTS = [
  // 탄수화물 (10)
  '쌀', '찹쌀', '감자', '고구마', '단호박', '옥수수', '식빵', '오트밀', '보리', '퀴노아',
  // 단백질 (12)
  '소고기', '닭고기', '돼지고기', '달걀', '두부', '연두부', '검은콩', '렌틸콩', '병아리콩', '낫토', '흰살생선', '연어',
  // 채소 (22)
  '당근', '애호박', '브로콜리', '시금치', '양배추', '배추', '무', '파프리카', '버섯', '가지',
  '아욱', '근대', '청경채', '비트', '아스파라거스', '콜라비', '래디시', '케일', '방울토마토', '오이', '셀러리', '연근',
  // 과일 (15)
  '사과', '바나나', '배', '딸기', '블루베리', '복숭아', '수박', '참외', '포도', '키위',
  '망고', '파인애플', '자두', '감', '체리',
  // 해산물 (8)
  '대구', '명태', '미역', '김', '멸치', '가자미', '도미', '홍합',
  // 유제품/기타 (8)
  '요거트', '치즈', '버터', '들깨', '참깨', '아보카도', '올리브오일', '두유',
  // 곡물/간식 (10)
  '현미', '귀리', '기장', '수수', '팥', '완두콩', '강낭콩', '검은깨', '잣', '아마씨',
  // 향신채/조미 (5)
  '마늘', '양파', '파', '생강', '부추',
  // 특수 재료 (10)
  '흑미', '자색고구마', '비타민나무열매', '아사이베리', '카무카무', '시라', '모링가', '스피루리나', '클로렐라', '유산균분말',
];

const MILESTONE_BADGES = [
  { count: 10, emoji: '🌱', label: '새싹 탐험가', desc: '10가지 재료 도전!' },
  { count: 25, emoji: '🥗', label: '채소 친구', desc: '25가지 재료 도전!' },
  { count: 50, emoji: '🍱', label: '영양 마스터', desc: '50가지 재료 도전!' },
  { count: 75, emoji: '👨‍🍳', label: '이유식 요리사', desc: '75가지 재료 도전!' },
  { count: 100, emoji: '🏆', label: '100가지 챌린저', desc: '모든 재료 완료!' },
];

export default function BadgePage() {
  const [tried, setTried] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setTried(getTriedIngredients());
  }, []);

  const triedSet = new Set(tried);
  const triedCount = ALL_INGREDIENTS.filter(i => triedSet.has(i)).length;
  const progress = Math.round((triedCount / ALL_INGREDIENTS.length) * 100);

  const earnedBadges = MILESTONE_BADGES.filter(b => triedCount >= b.count);
  const nextBadge = MILESTONE_BADGES.find(b => triedCount < b.count);

  return (
    <main className="min-h-screen bg-amber-50 p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <a href="/" className="text-amber-600 text-sm">← 홈</a>
        <h1 className="text-xl font-bold text-gray-800">100가지 재료 챌린지</h1>
      </div>

      {/* 진행률 */}
      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold text-amber-500">{triedCount}</span>
          <span className="text-sm text-gray-400">/ 100가지</span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-3 mb-2">
          <div
            className="bg-amber-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-right">{progress}% 달성</p>

        {nextBadge && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            다음 뱃지까지 {nextBadge.count - triedCount}가지 더!
          </p>
        )}
      </div>

      {/* 획득 뱃지 */}
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <p className="font-semibold text-gray-700 mb-3">🏅 획득 뱃지</p>
        {earnedBadges.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-3">
            10가지 재료를 먹으면 첫 뱃지를 얻어요!
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {MILESTONE_BADGES.map(badge => {
              const earned = triedCount >= badge.count;
              return (
                <div
                  key={badge.count}
                  className={`rounded-xl p-3 text-center transition-all ${
                    earned ? 'bg-amber-50 border-2 border-amber-300' : 'bg-gray-50 opacity-30'
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-xs font-medium text-gray-700">{badge.label}</div>
                  <div className="text-xs text-gray-400">{badge.count}가지</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 재료 현황 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-gray-700">🥄 재료 현황</p>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-amber-600 underline"
          >
            {showAll ? '먹은 것만 보기' : '전체 보기'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_INGREDIENTS
            .filter(i => showAll || triedSet.has(i))
            .map(ingredient => (
              <span
                key={ingredient}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  triedSet.has(ingredient)
                    ? 'bg-amber-400 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {triedSet.has(ingredient) ? '✓ ' : ''}{ingredient}
              </span>
            ))}
        </div>
        {!showAll && tried.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            레시피를 저장하면 재료가 기록돼요!
          </p>
        )}
      </div>
    </main>
  );
}
