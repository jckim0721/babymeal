import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '저장된 레시피 | 베이비밀',
  description: '생성한 이유식 레시피를 저장하고 관리해보세요. 아기 개월수별 식단 이력을 한눈에 확인할 수 있어요.',
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
