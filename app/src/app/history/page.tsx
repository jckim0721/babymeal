'use client';

import { useState, useEffect } from 'react';
import { getSavedRecipes, SavedRecipe } from '@/lib/localStorage';

export default function HistoryPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setRecipes(getSavedRecipes());
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-amber-50 p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <a href="/" className="text-amber-600 text-sm">← 홈</a>
        <h1 className="text-xl font-bold text-gray-800">저장된 레시피</h1>
      </div>

      {recipes.length === 0 ? (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-600 font-medium mb-1">아직 저장된 레시피가 없어요</p>
            <p className="text-sm text-gray-400 mb-4">레시피를 생성하고 저장하면 이곳에 기록돼요</p>
            <a href="/recipe" className="inline-block px-5 py-2 bg-amber-400 text-white rounded-xl text-sm font-medium">
              첫 레시피 만들러 가기
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-700 mb-3">💡 레시피 저장 활용법</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-amber-500">✓</span>레시피 생성 후 '저장' 버튼을 누르면 자동 기록</li>
              <li className="flex gap-2"><span className="text-amber-500">✓</span>아기 개월수·재료·조리법이 함께 저장돼요</li>
              <li className="flex gap-2"><span className="text-amber-500">✓</span>저장된 레시피로 식단 다양성을 관리하세요</li>
              <li className="flex gap-2"><span className="text-amber-500">✓</span>같은 재료 반복을 피해 편식 예방에 도움돼요</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-700 mb-3">🥣 이유식 단계별 가이드</p>
            <div className="space-y-3 text-sm text-gray-600">
              <div><span className="font-medium text-amber-600">초기 (4~6개월)</span> — 묽은 쌀미음부터 시작. 새 재료는 3일 간격으로 하나씩 시도</div>
              <div><span className="font-medium text-amber-600">중기 (7~9개월)</span> — 죽 형태. 단백질(소고기·두부) 도입. 덩어리가 조금 남아도 OK</div>
              <div><span className="font-medium text-amber-600">후기 (10~12개월)</span> — 무른 밥 형태. 다양한 채소·과일 확대. 손가락 음식 시도</div>
              <div><span className="font-medium text-amber-600">완료기 (12개월~)</span> — 가족 식사와 비슷한 형태. 간은 최소화</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                className="w-full p-4 text-left flex justify-between items-center"
                onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
              >
                <div>
                  <p className="font-semibold text-gray-800">{recipe.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {recipe.ageMonths}개월 · {formatDate(recipe.savedAt)}
                  </p>
                </div>
                <span className="text-gray-400 text-sm">{expanded === recipe.id ? '▲' : '▼'}</span>
              </button>

              {expanded === recipe.id && (
                <div className="px-4 pb-4 border-t border-amber-50 pt-3">
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">재료</p>
                    <ul className="text-sm text-gray-600 space-y-0.5">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>· {ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">조리법</p>
                    <ol className="text-sm text-gray-600 space-y-1">
                      {recipe.steps.map((step, i) => (
                        <li key={i}>{i + 1}. {step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2 text-xs text-amber-700">
                    💡 {recipe.nutritionNote}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
