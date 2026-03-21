// 개월수별 위험/주의 식재료 데이터
// 식약처 및 소아과 권장 기준 기반

export interface SafetyWarning {
  ingredient: string;
  minMonth: number; // 이 개월수 미만이면 위험
  level: 'danger' | 'caution'; // danger=금지, caution=주의
  reason: string;
}

export const SAFETY_RULES: SafetyWarning[] = [
  // 전 연령 금지
  { ingredient: '꿀', minMonth: 12, level: 'danger', reason: '보툴리누스균 위험 (12개월 미만 절대 금지)' },
  { ingredient: '생꿀', minMonth: 12, level: 'danger', reason: '보툴리누스균 위험' },
  { ingredient: '벌꿀', minMonth: 12, level: 'danger', reason: '보툴리누스균 위험' },

  // 우유 관련
  { ingredient: '생우유', minMonth: 12, level: 'danger', reason: '12개월 미만 소화 불가, 철분 흡수 방해' },
  { ingredient: '우유', minMonth: 12, level: 'caution', reason: '12개월 미만은 분유만 권장' },

  // 견과류
  { ingredient: '땅콩', minMonth: 12, level: 'danger', reason: '알레르기 및 질식 위험' },
  { ingredient: '견과류', minMonth: 12, level: 'danger', reason: '알레르기 및 질식 위험' },
  { ingredient: '호두', minMonth: 12, level: 'danger', reason: '알레르기 및 질식 위험' },
  { ingredient: '아몬드', minMonth: 12, level: 'danger', reason: '알레르기 및 질식 위험' },

  // 날것/익히지 않은 것
  { ingredient: '날달걀', minMonth: 24, level: 'danger', reason: '살모넬라 위험, 완숙만 권장' },
  { ingredient: '생선회', minMonth: 36, level: 'danger', reason: '기생충 및 세균 위험' },
  { ingredient: '날생선', minMonth: 36, level: 'danger', reason: '기생충 및 세균 위험' },

  // 자극적인 것
  { ingredient: '고추', minMonth: 24, level: 'danger', reason: '위장 자극' },
  { ingredient: '마늘', minMonth: 9, level: 'caution', reason: '소량만 사용 권장' },
  { ingredient: '양파', minMonth: 9, level: 'caution', reason: '익혀서 소량 사용' },

  // 가공식품
  { ingredient: '소시지', minMonth: 12, level: 'caution', reason: '나트륨 과다, 12개월 이후 소량' },
  { ingredient: '햄', minMonth: 12, level: 'caution', reason: '나트륨 과다' },
  { ingredient: '베이컨', minMonth: 18, level: 'danger', reason: '나트륨 과다, 가공육' },
  { ingredient: '라면', minMonth: 36, level: 'danger', reason: '나트륨 극과다' },

  // 해산물
  { ingredient: '새우', minMonth: 9, level: 'caution', reason: '알레르기 주의, 처음엔 소량' },
  { ingredient: '조개', minMonth: 9, level: 'caution', reason: '알레르기 주의' },
  { ingredient: '굴', minMonth: 12, level: 'caution', reason: '알레르기 및 식중독 주의' },
];

export function checkSafety(ingredients: string[], ageMonths: number): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  for (const ingredient of ingredients) {
    for (const rule of SAFETY_RULES) {
      if (
        ingredient.includes(rule.ingredient) ||
        rule.ingredient.includes(ingredient)
      ) {
        if (ageMonths < rule.minMonth) {
          warnings.push(rule);
        }
      }
    }
  }

  return warnings;
}

// 개월수 → 이유식 단계
export function getStage(ageMonths: number): string {
  if (ageMonths < 6) return '모유/분유만';
  if (ageMonths < 9) return '초기 이유식 (미음)';
  if (ageMonths < 12) return '중기 이유식 (죽)';
  if (ageMonths < 16) return '후기 이유식 (진밥)';
  if (ageMonths < 24) return '완료기 이유식 (밥)';
  return '유아식';
}

export function getTexture(ageMonths: number): string {
  if (ageMonths < 9) return '곱게 갈아서 미음 형태로';
  if (ageMonths < 12) return '으깨거나 잘게 다져서 죽 형태로';
  if (ageMonths < 16) return '작게 잘라 진밥 형태로';
  if (ageMonths < 24) return '작게 썰어 부드럽게 조리';
  return '일반 조리 (단, 작게 썰어 제공)';
}
