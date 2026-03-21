'use client';

import { useState, useEffect, useRef } from 'react';
import { getProfile, getAgeMonths, saveRecipe, incrementRegenCount } from '@/lib/localStorage';
import AdBanner from '@/components/AdBanner';

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

type AnimState = 'idle' | 'spinning' | 'result';

const SPIN_EMOJIS = ['🥕', '🥦', '🍗', '🐟', '🥚', '🍎', '🥔', '🌽', '🫐', '🍓'];

export default function GachaPage() {
  const [ageMonths, setAgeMonths] = useState(12);
  const [babyName, setBabyName] = useState('');
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [displayEmojis, setDisplayEmojis] = useState(['🍳', '🍳', '🍳']);
  const [result, setResult] = useState<{ recipe: RecipeResult; warnings: Warning[]; stage: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setAgeMonths(getAgeMonths(p.birthDate));
      setBabyName(p.name);
    }
  }, []);

  const startSpin = () => {
    setAnimState('spinning');
    setResult(null);
    setSaved(false);

    // 슬롯머신 애니메이션
    let tick = 0;
    spinRef.current = setInterval(() => {
      setDisplayEmojis([
        SPIN_EMOJIS[Math.floor(Math.random() * SPIN_EMOJIS.length)],
        SPIN_EMOJIS[Math.floor(Math.random() * SPIN_EMOJIS.length)],
        SPIN_EMOJIS[Math.floor(Math.random() * SPIN_EMOJIS.length)],
      ]);
      tick++;
      if (tick > 20) {
        if (spinRef.current) clearInterval(spinRef.current);
      }
    }, 80);
  };

  const handleGacha = async () => {
    const count = incrementRegenCount();
    if (count > 3) {
      alert('오늘 무료 뽑기 횟수(3회)를 초과했습니다.\n(광고 시청 기능 준비 중)');
      return;
    }

    startSpin();

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: [], ageMonths, isRandom: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 애니메이션이 최소 1.5초 돌게
      await new Promise(r => setTimeout(r, 1500));
      if (spinRef.current) clearInterval(spinRef.current);

      // 결과 재료로 슬롯 멈추기
      const mainIngredients = data.recipe.ingredients.slice(0, 3).map(() =>
        SPIN_EMOJIS[Math.floor(Math.random() * SPIN_EMOJIS.length)]
      );
      setDisplayEmojis(mainIngredients.length >= 3 ? mainIngredients : ['🍳', '🍳', '🍳']);

      setResult(data);
      setAnimState('result');
    } catch {
      if (spinRef.current) clearInterval(spinRef.current);
      setAnimState('idle');
      alert('레시피 생성에 실패했습니다. 다시 시도해주세요.');
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
      triedIngredients: result.recipe.ingredients.map(i => i.split(' ')[0]),
    });
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-amber-50 p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <a href="/" className="text-amber-600 text-sm">← 홈</a>
        <h1 className="text-xl font-bold text-gray-800">오늘의 이유식 뽑기</h1>
      </div>

      <div className="bg-white rounded-xl p-3 mb-6 shadow-sm text-sm text-gray-600">
        {babyName && `${babyName} · `}{ageMonths}개월 맞춤 레시피를 AI가 뽑아드려요
      </div>

      {/* 슬롯머신 */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm text-center">
        <div className="flex justify-center gap-3 mb-6">
          {displayEmojis.map((emoji, i) => (
            <div
              key={i}
              className={`w-20 h-20 bg-amber-50 rounded-xl border-2 border-amber-200 flex items-center justify-center text-4xl transition-all ${
                animState === 'spinning' ? 'animate-bounce' : ''
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <button
          onClick={handleGacha}
          disabled={animState === 'spinning'}
          className="w-full py-4 bg-amber-400 text-white font-bold rounded-xl text-lg disabled:opacity-50 transition-transform active:scale-95"
        >
          {animState === 'spinning' ? '뽑는 중...' : animState === 'result' ? '🎰 다시 뽑기' : '🎰 레시피 뽑기!'}
        </button>

        {animState === 'idle' && (
          <p className="text-xs text-gray-400 mt-2">재료 선택 없이 AI가 알아서 추천해드려요</p>
        )}
      </div>

      {/* 결과 */}
      {result && animState === 'result' && (
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

          <a
            href={`https://www.coupang.com/np/search?q=${encodeURIComponent(result.recipe.coupangKeyword)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 border border-amber-300 text-amber-700 text-center rounded-lg text-sm mb-3"
          >
            🛒 {result.recipe.coupangKeyword} 쿠팡에서 보기
          </a>

          <button
            onClick={handleSave}
            disabled={saved}
            className="w-full py-2 bg-amber-400 text-white rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {saved ? '✅ 저장됨' : '💾 레시피 저장'}
          </button>

          <AdBanner slot="ADSENSE_SLOT_GACHA" className="mt-4 rounded-xl overflow-hidden" />
        </div>
      )}
    </main>
  );
}
