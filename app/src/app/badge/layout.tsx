import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '100가지 식재료 챌린지 | 베이비밀',
  description: '아기가 먹어본 재료를 기록하고 배지를 모아보세요. 다양한 식재료 도전으로 편식 없는 아이로 키워요.',
};

export default function BadgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
