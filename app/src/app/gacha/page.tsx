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

const JACKPOT_CHANCE = 0.25; // 25% 확률

const SPIN_EMOJIS = ['🥕', '🥦', '🍗', '🐟', '🥚', '🍎', '🥔', '🌽', '🫐', '🍓'];

// 개월수에 따라 적합한 레시피 타입
function getRecipeTypes(ageMonths: number): string[] {
  if (ageMonths < 9) return [
    '쌀미음', '채소퓨레', '과일퓨레', '단호박죽', '감자퓨레', '브로콜리미음',
  ];
  if (ageMonths < 12) return [
    '야채죽', '닭고기죽', '소고기죽', '두부채소죽', '달걀노른자죽',
    '감자스프', '단호박스프', '브로콜리퓨레', '으깬 감자볼',
  ];
  if (ageMonths < 18) return [
    '무른 볶음밥', '달걀찜', '닭고기 완자탕', '소고기 채소전',
    '두부조림', '감자조림', '애호박전', '당근 팬케이크',
    '미역국 무른밥', '닭고기 리조또', '으깬 두부볼', '채소 수프',
    '달걀 스크램블', '찐 만두 (시판)', '연두부 샐러드',
  ];
  return [
    '프리타타', '잔치국수', '우동', '리조또', '된장국 진밥',
    '소고기 미역국', '닭갈비 순한 버전', '감자 크림수프',
    '채소 카레 (순한)', '달걀말이', '호박전', '두부구이',
    '닭고기 샌드위치', '오트밀 팬케이크', '수제비',
    '참치 채소볶음밥', '소고기 뭇국', '시금치 나물밥',
    '아보카도 달걀 덮밥', '치즈 감자전', '삼색 나물밥',
    '닭고기 야채 스튜', '바나나 오트밀 쿠키', '채소 달걀 머핀',
  ];
}

const RECENT_TITLES_KEY = 'gacha_recent_titles';
function getRecentTitles(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_TITLES_KEY) || '[]'); } catch { return []; }
}
function addRecentTitle(title: string) {
  const recent = getRecentTitles();
  const updated = [title, ...recent.filter(t => t !== title)].slice(0, 5);
  localStorage.setItem(RECENT_TITLES_KEY, JSON.stringify(updated));
}

const INGREDIENT_EMOJI: Record<string, string> = {
  '쌀': '🍚', '찹쌀': '🍚', '감자': '🥔', '고구마': '🍠', '단호박': '🎃', '옥수수': '🌽',
  '식빵': '🍞', '오트밀': '🌾', '소고기': '🥩', '닭고기': '🍗', '돼지고기': '🥓',
  '달걀': '🥚', '계란': '🥚', '두부': '⬜', '연두부': '⬜',
  '당근': '🥕', '애호박': '🥒', '브로콜리': '🥦', '시금치': '🌿', '양배추': '🥬',
  '파프리카': '🫑', '버섯': '🍄', '가지': '🍆', '토마토': '🍅',
  '사과': '🍎', '바나나': '🍌', '배': '🍐', '딸기': '🍓', '블루베리': '🫐',
  '복숭아': '🍑', '수박': '🍉', '포도': '🍇', '키위': '🥝', '망고': '🥭',
  '연어': '🐟', '대구': '🐟', '명태': '🐟', '미역': '🌊', '김': '🌊',
  '요거트': '🥛', '치즈': '🧀', '우유': '🥛', '두유': '🥛',
};

function getIngredientEmoji(ingredientStr: string): string {
  for (const [key, emoji] of Object.entries(INGREDIENT_EMOJI)) {
    if (ingredientStr.includes(key)) return emoji;
  }
  return SPIN_EMOJIS[Math.floor(Math.random() * SPIN_EMOJIS.length)];
}

export default function GachaPage() {
  const [ageMonths, setAgeMonths] = useState(12);
  const [babyName, setBabyName] = useState('');
  const [hasProfile, setHasProfile] = useState(true);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [displayEmojis, setDisplayEmojis] = useState(['🍳', '🍳', '🍳']);
  const [result, setResult] = useState<{ recipe: RecipeResult; warnings: Warning[]; stage: string } | null>(null);
  const [bonusResult, setBonusResult] = useState<{ recipe: RecipeResult; warnings: Warning[]; stage: string } | null>(null);
  const [isJackpot, setIsJackpot] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedBonus, setSavedBonus] = useState(false);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [allergies, setAllergies] = useState<string[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setAgeMonths(getAgeMonths(p.birthDate));
      setBabyName(p.name);
      setAllergies(p.allergies ?? []);
    } else {
      setHasProfile(false);
    }
  }, []);

  const startSpin = () => {
    setAnimState('spinning');
    setResult(null);
    setBonusResult(null);
    setIsJackpot(false);
    setSaved(false);
    setSavedBonus(false);

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
      const types = getRecipeTypes(ageMonths);
      const recentTitles = getRecentTitles();
      const jackpot = Math.random() < JACKPOT_CHANCE;

      // 첫 번째 레시피 (+ 잭팟이면 두 번째도 동시에)
      const type1 = types[Math.floor(Math.random() * types.length)];
      let type2 = types[Math.floor(Math.random() * types.length)];
      while (type2 === type1 && types.length > 1) {
        type2 = types[Math.floor(Math.random() * types.length)];
      }

      const fetches = [
        fetch('/api/recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: [], ageMonths, isRandom: true, recipeType: type1, recentTitles, allergies }),
        }),
        ...(jackpot ? [fetch('/api/recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: [], ageMonths, isRandom: true, recipeType: type2, recentTitles, allergies }),
        })] : []),
      ];

      const responses = await Promise.all(fetches);
      const [data, bonusData] = await Promise.all(responses.map(r => r.json()));
      if (data.error) throw new Error(data.error);

      // 애니메이션이 최소 1.5초 돌게
      await new Promise(r => setTimeout(r, 1500));
      if (spinRef.current) clearInterval(spinRef.current);

      if (jackpot) {
        // 잭팟: 슬롯 이모지 3개 같은 걸로 (🎉🎉🎉)
        setDisplayEmojis(['🎉', '🎉', '🎉']);
        setIsJackpot(true);
        if (bonusData && !bonusData.error) {
          if (bonusData.recipe?.title) addRecentTitle(bonusData.recipe.title);
          setBonusResult(bonusData);
        }
      } else {
        // 실제 재료 이모지로 슬롯 멈추기
        const mainIngredients = data.recipe.ingredients.slice(0, 3).map((ing: string) =>
          getIngredientEmoji(ing)
        );
        while (mainIngredients.length < 3) mainIngredients.push('🍳');
        setDisplayEmojis(mainIngredients);
      }

      if (data.recipe?.title) addRecentTitle(data.recipe.title);
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

      {/* 프로필 없음 경고 */}
      {!hasProfile && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 mb-3 text-sm text-yellow-800">
          ⚠️ 아이 정보가 없어요. <strong>12개월(완료기) 기준</strong>으로 레시피를 뽑아드려요.
          <a href="/" className="ml-1 underline text-yellow-700">홈에서 정보 입력 →</a>
        </div>
      )}

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
            href={`https://www.coupang.com/np/search?q=${encodeURIComponent(result.recipe.coupangKeyword.replace(/[,/]\s*/g, ' '))}&affiliate=${process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID || ''}`}
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
      {/* 잭팟 보너스 레시피 */}
      {isJackpot && bonusResult && animState === 'result' && (
        <div className="mt-4">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl p-4 text-center mb-3 shadow-md">
            <p className="text-2xl font-black text-white">🎊 더블 레시피 당첨! 🎊</p>
            <p className="text-white text-sm mt-1">오늘 운이 좋네요! 보너스 레시피가 하나 더!</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-amber-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full font-bold">BONUS</span>
              <h2 className="text-xl font-bold">{bonusResult.recipe.title}</h2>
            </div>
            <p className="text-sm text-amber-600 mb-3">{bonusResult.stage}</p>

            <div className="mb-3">
              <p className="font-semibold text-gray-700 mb-1">📝 재료</p>
              <ul className="text-sm text-gray-600 space-y-0.5">
                {bonusResult.recipe.ingredients.map((ing, i) => (
                  <li key={i}>· {ing}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <p className="font-semibold text-gray-700 mb-1">👨‍🍳 조리법</p>
              <ol className="text-sm text-gray-600 space-y-1">
                {bonusResult.recipe.steps.map((step, i) => (
                  <li key={i}>{i + 1}. {step}</li>
                ))}
              </ol>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 mb-3 text-sm text-amber-700">
              💡 {bonusResult.recipe.nutritionNote}
            </div>

            <a
              href={`https://www.coupang.com/np/search?q=${encodeURIComponent(bonusResult.recipe.coupangKeyword.replace(/[,/]\s*/g, ' '))}&affiliate=${process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 border border-amber-300 text-amber-700 text-center rounded-lg text-sm mb-3"
            >
              🛒 {bonusResult.recipe.coupangKeyword} 쿠팡에서 보기
            </a>

            <button
              onClick={() => {
                if (!bonusResult) return;
                saveRecipe({
                  title: bonusResult.recipe.title,
                  ingredients: bonusResult.recipe.ingredients,
                  steps: bonusResult.recipe.steps,
                  nutritionNote: bonusResult.recipe.nutritionNote,
                  ageMonths,
                  triedIngredients: bonusResult.recipe.ingredients.map(i => i.split(' ')[0]),
                });
                setSavedBonus(true);
              }}
              disabled={savedBonus}
              className="w-full py-2 bg-amber-400 text-white rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {savedBonus ? '✅ 저장됨' : '💾 보너스 레시피 저장'}
            </button>
          </div>
        </div>
      )}

      {/* 이유식 TIP */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mt-4">
        <h2 className="font-bold text-gray-700 mb-3 text-sm">💡 오늘의 이유식 TIP</h2>
        <ul className="space-y-2 text-xs text-gray-500">
          <li>🎲 매일 다른 레시피로 다양한 맛을 경험시켜주세요. 편식 예방에 도움이 됩니다.</li>
          <li>🥄 새로운 재료는 오전에 먹여야 알레르기 반응을 낮에 확인할 수 있어요.</li>
          <li>😊 아이가 처음 거부해도 10~15번 이상 시도해보세요. 익숙해지면 먹게 됩니다.</li>
          <li>🌡️ 이유식 온도는 체온과 비슷한 36~37°C가 적당합니다.</li>
        </ul>
      </div>
    </main>
  );
}
