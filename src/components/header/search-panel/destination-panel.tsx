import { type ComponentType, type ReactNode } from 'react';

import { MapPin, Navigation2 } from '@/components/ui/icon';
import { useGuardContext } from '@/shared/context/hooks';
import { ServiceContext } from '@/shared/context/service-context';

type DefaultSuggestion = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  title: string;
  description: string;
};

const DEFAULT_SUGGESTIONS: DefaultSuggestion[] = [
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

const highlightText = (text: string, query: string): ReactNode => {
  const queryChars = new Set(query.trim().split(''));

  const parts = [...text].reduce<{ text: string; bold: boolean }[]>(
    (acc, char) => {
      const bold = queryChars.has(char);
      const last = acc.at(-1);
      return last?.bold === bold
        ? [...acc.slice(0, -1), { text: last.text + char, bold }]
        : [...acc, { text: char, bold }];
    },
    []
  );

  return (
    <>
      {parts.map((part, i) =>
        part.bold ? (
          <strong key={i} className="font-semibold text-neutral-900">
            {part.text}
          </strong>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
};

export const DestinationPanel = ({ query }: { query: string }) => {
  const { destinationSearchService } = useGuardContext(ServiceContext);

  const isSearching = query.trim() !== '';
  const filtered = destinationSearchService.getFilteredDestinations({ query });

  return (
    <div className="w-[400px] p-6">
      {isSearching ? (
        <>
          <p className="mb-4 font-semibold text-neutral-800 text-xs">
            연관 검색어
          </p>
          {filtered.length === 0 ? (
            <p className="text-neutral-500 text-sm">
              일치하는 여행지가 없습니다.
            </p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-neutral-100"
                  >
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-200">
                      <img
                        src={d.thumbnail_image}
                        alt={d.place}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800 text-sm">
                        {highlightText(d.place, query)}
                      </p>
                      <p className="mt-0.5 text-neutral-500 text-xs">
                        {highlightText(d.category, query)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <p className="mb-4 font-semibold text-neutral-800 text-xs">
            추천 여행지
          </p>
          <ul className="space-y-1">
            {DEFAULT_SUGGESTIONS.map((s) => (
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
                    <p className="font-medium text-neutral-800 text-sm">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-neutral-500 text-xs">
                      {s.description}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
