'use client';

export interface BabyProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  allergies: string[];
}

export interface SavedRecipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  nutritionNote: string;
  ageMonths: number;
  savedAt: string;
  triedIngredients: string[];
}

const PROFILE_KEY = 'babymeal_profile';
const RECIPES_KEY = 'babymeal_recipes';
const TRIED_KEY = 'babymeal_tried_ingredients';
const REGEN_KEY = 'babymeal_regen_count';

// 아이 프로필
export function getProfile(): BabyProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile: BabyProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// 개월수 계산
export function getAgeMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

// 저장된 레시피
export function getSavedRecipes(): SavedRecipe[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(RECIPES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveRecipe(recipe: Omit<SavedRecipe, 'id' | 'savedAt'>): void {
  const recipes = getSavedRecipes();
  const newRecipe: SavedRecipe = {
    ...recipe,
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
  };
  recipes.unshift(newRecipe);
  // 최대 100개 유지
  if (recipes.length > 100) recipes.pop();
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  // 시도한 재료 업데이트
  addTriedIngredients(recipe.triedIngredients);
}

// 시도한 식재료 (뱃지용)
export function getTriedIngredients(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(TRIED_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addTriedIngredients(ingredients: string[]): void {
  const tried = new Set(getTriedIngredients());
  ingredients.forEach(i => tried.add(i));
  localStorage.setItem(TRIED_KEY, JSON.stringify([...tried]));
}

// 재생성 횟수 (광고 게이트용)
export function getRegenCount(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toDateString();
  const raw = localStorage.getItem(REGEN_KEY);
  if (!raw) return 0;
  const data = JSON.parse(raw);
  return data.date === today ? data.count : 0;
}

export function incrementRegenCount(): number {
  const today = new Date().toDateString();
  const count = getRegenCount() + 1;
  localStorage.setItem(REGEN_KEY, JSON.stringify({ date: today, count }));
  return count;
}
