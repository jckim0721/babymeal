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
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500">아직 저장된 레시피가 없어요</p>
          <a href="/recipe" className="mt-4 inline-block text-sm text-amber-600 underline">
            레시피 만들러 가기
          </a>
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
