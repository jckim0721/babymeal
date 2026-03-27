import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '오늘의 이유식 뽑기 | 베이비밀',
  description: '아기 개월수에 맞는 이유식을 AI가 랜덤 추천해드려요. 매일 다른 레시피로 편식 예방에 도움을 드려요.',
};

export default function GachaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
