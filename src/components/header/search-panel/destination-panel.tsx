import type { ComponentType } from 'react';

import { MapPin, Navigation2 } from '@/components/ui/icon';

type Suggestion = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  title: string;
  description: string;
};

const SUGGESTIONS: Suggestion[] = [
  {
    id: 'nearby',
    icon: Navigation2,
    iconBg: 'bg-blue-100 text-blue-600',
    title: '근처 체험 찾기',
    description: '가까운 곳에서 즐길 수 있는 체험을 찾아보세요.',
  },
  {
    id: 'busan',
    icon: MapPin,
    iconBg: 'bg-neutral-100 text-neutral-600',
    title: '부산, 부산',
    description: '부산 숙소가 저장된 위시리스트에 기반한 추천',
  },
  {
    id: 'gwangan',
    icon: MapPin,
    iconBg: 'bg-neutral-100 text-neutral-600',
    title: '광안리해수욕장',
    description: '해변으로 인기 있는 곳',
  },
  {
    id: 'osaka',
    icon: MapPin,
    iconBg: 'bg-neutral-100 text-neutral-600',
    title: '오사카시, 일본',
    description: '관광 명소: 오사카성',
  },
  {
    id: 'jeju',
    icon: MapPin,
    iconBg: 'bg-neutral-100 text-neutral-600',
    title: '제주',
    description: '자연을 만끽하기 좋은 곳',
  },
  {
    id: 'tokyo',
    icon: MapPin,
    iconBg: 'bg-neutral-100 text-neutral-600',
    title: '도쿄, 일본',
    description: '화려한 나이트라이프로 유명한 곳',
  },
];

export const DestinationPanel = () => (
  <div className="w-[400px] p-6">
    <p className="mb-4 font-semibold text-neutral-800 text-xs">추천 여행지</p>
    <ul className="space-y-1">
      {SUGGESTIONS.map((s) => (
        <li key={s.id}>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-neutral-100"
          >
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}
            >
              <s.icon size={20} />
            </div>
            <div>
              <p className="font-medium text-neutral-800 text-sm">{s.title}</p>
              <p className="mt-0.5 text-neutral-500 text-xs">{s.description}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  </div>
);
