import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '재료로 이유식 만들기 | 베이비밀',
  description: '냉장고 재료를 선택하면 아기 개월수에 맞는 이유식 레시피를 AI가 만들어드려요. 알레르기 주의 재료도 자동으로 체크해요.',
};

export default function RecipeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
