'use client';

import { useState, useEffect } from 'react';
import { getProfile, getAgeMonths, saveRecipe, incrementRegenCount } from '@/lib/localStorage';
import AdBanner from '@/components/AdBanner';

const INGREDIENTS_BY_CATEGORY: Record<string, string[]> = {
  '탄수화물': ['쌀', '찹쌀', '감자', '고구마', '단호박', '옥수수', '식빵', '오트밀'],
  '단백질': ['소고기', '닭고기', '돼지고기', '달걀', '두부', '연두부', '검은콩', '렌틸콩'],
  '채소': ['당근', '애호박', '브로콜리', '시금치', '양배추', '배추', '무', '파프리카', '버섯'],
  '과일': ['사과', '바나나', '배', '딸기', '블루베리', '복숭아', '수박', '참외'],
  '해산물': ['연어', '대구', '명태', '미역', '김'],
};

interface RecipeResult {
  title: string;
  ingredients: string[];
  steps: string[];
  nutritionNote: string;
  coupangKeyword: string;
}

interface Warning {
  ingredient: string;
  level: 'danger' | 'caution';
  reason: string;
}

export default function RecipePage() {
  const [ageMonths, setAgeMonths] = useState(12);
  const [babyName, setBabyName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('탄수화물');
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ recipe: RecipeResult; warnings: Warning[]; stage: string } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setAgeMonths(getAgeMonths(p.birthDate));
      setBabyName(p.name);
    }
  }, []);

  const toggleIngredient = (item: string) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
    }
    setCustomInput('');
  };

  const handleGenerate = async () => {
    if (selected.length === 0) return;
    const count = incrementRegenCount();
    if (count > 3) {
      alert('오늘 무료 생성 횟수(3회)를 초과했습니다.\n(광고 시청 기능 준비 중)');
      return;
    }
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selected, ageMonths }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      alert('레시피 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    saveRecipe({
      title: result.recipe.title,
      ingredients: result.recipe.ingredients,
      steps: result.recipe.steps,
      nutritionNote: result.recipe.nutritionNote,
      ageMonths,
      triedIngredients: selected,
    });
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-amber-50 p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <a href="/" className="text-amber-600 text-sm">← 홈</a>
        <h1 className="text-xl font-bold text-gray-800">재료로 만들기</h1>
      </div>

      {/* 개월수 표시 */}
      <div className="bg-white rounded-xl p-3 mb-4 shadow-sm text-sm text-gray-600">
        {babyName && `${babyName} · `}{ageMonths}개월 기준으로 레시피를 만들어요
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {Object.keys(INGREDIENTS_BY_CATEGORY).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-amber-400 text-white'
                : 'bg-white text-gray-600 border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 재료 선택 */}
      <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {INGREDIENTS_BY_CATEGORY[activeCategory].map(item => (
            <button
              key={item}
              onClick={() => toggleIngredient(item)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selected.includes(item)
                  ? 'bg-amber-400 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        {/* 직접 입력 */}
        <div className="flex gap-2 mt-3">
          <input
            className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
            placeholder="직접 입력..."
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
          />
          <button
            onClick={handleAddCustom}
            className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
          >
            추가
          </button>
        </div>
      </div>

      {/* 선택된 재료 */}
      {selected.length > 0 && (
        <div className="bg-amber-100 rounded-xl p-3 mb-4 flex flex-wrap gap-2">
          {selected.map(item => (
            <span
              key={item}
              onClick={() => toggleIngredient(item)}
              className="bg-white px-2 py-1 rounded-full text-sm cursor-pointer flex items-center gap-1"
            >
              {item} <span className="text-gray-400">✕</span>
            </span>
          ))}
        </div>
      )}

      {/* 생성 버튼 */}
      <button
        onClick={handleGenerate}
        disabled={selected.length === 0 || loading}
        className="w-full py-3 bg-amber-400 text-white font-bold rounded-xl disabled:opacity-50 mb-6"
      >
        {loading ? '레시피 만드는 중...' : `🍳 레시피 만들기 (${selected.length}가지 재료)`}
      </button>

      {/* 결과 */}
      {result && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-bold mb-1">{result.recipe.title}</h2>
          <p className="text-sm text-amber-600 mb-3">{result.stage}</p>

          {/* 안전 경고 */}
          {result.warnings.length > 0 ? (
            <div className="mb-3 space-y-1">
              {result.warnings.map((w, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-xs ${
                    w.level === 'danger' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  {w.level === 'danger' ? '🚨' : '⚠️'} {w.ingredient}: {w.reason}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg mb-3">
              ✅ 안전 체크 이상 없음
            </div>
          )}

          <div className="mb-3">
            <p className="font-semibold text-gray-700 mb-1">📝 재료</p>
            <ul className="text-sm text-gray-600 space-y-0.5">
              {result.recipe.ingredients.map((ing, i) => (
                <li key={i}>· {ing}</li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <p className="font-semibold text-gray-700 mb-1">👨‍🍳 조리법</p>
            <ol className="text-sm text-gray-600 space-y-1">
              {result.recipe.steps.map((step, i) => (
                <li key={i}>{i + 1}. {step}</li>
              ))}
            </ol>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 mb-4 text-sm text-amber-700">
            💡 {result.recipe.nutritionNote}
          </div>

          {/* 쿠팡 링크 */}
          <a
            href={`https://www.coupang.com/np/search?q=${encodeURIComponent(result.recipe.coupangKeyword.replace(/,\s*/g, ' '))}&affiliate=${process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 border border-amber-300 text-amber-700 text-center rounded-lg text-sm mb-3"
          >
            🛒 {result.recipe.coupangKeyword} 쿠팡에서 보기
          </a>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              className="flex-1 py-2 border rounded-lg text-sm text-gray-600"
            >
              🔄 다시 만들기
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex-1 py-2 bg-amber-400 text-white rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saved ? '✅ 저장됨' : '💾 저장'}
            </button>
          </div>

          <AdBanner slot="ADSENSE_SLOT_RECIPE" className="mt-4 rounded-xl overflow-hidden" />
        </div>
      )}
    </main>
  );
}
