import { useEffect, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { DatePanel } from '@/components/header/search-panel/date-panel';
import { DestinationPanel } from '@/components/header/search-panel/destination-panel';
import {
  type GuestCounts,
  GuestsPanel,
} from '@/components/header/search-panel/guests-panel';
import { Search } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type FilterType = 'DESTINATION' | 'DATE' | 'GUESTS';

const ANIMATION = {
  SLIDE_MS: 300,
  FADE_MS: 200,
  CONTENT_SWAP_MS: 50,
} as const;

const PANEL_SIZES: Record<FilterType, { width: number; height: number }> = {
  DESTINATION: { width: 400, height: 490 },
  DATE: { width: 672, height: 460 },
  GUESTS: { width: 320, height: 310 },
};

// 드롭다운이 어떤 전환 상태에 있는지를 명시적으로 표현
type DropdownPhase = 'closed' | 'opening' | 'sliding' | 'idle';

const getDropdownTransition = (phase: DropdownPhase) => {
  const s = `${ANIMATION.SLIDE_MS}ms`;
  const f = `${ANIMATION.FADE_MS}ms`;

  switch (phase) {
    case 'opening':
      return {
        property: 'left, width, height, opacity, transform',
        duration: `${s}, ${s}, ${s}, ${f}, ${f}`,
      };
    case 'sliding':
      return {
        property: 'left, opacity, transform',
        duration: `${s}, ${f}, ${f}`,
      };
    default:
      return {
        property: 'opacity, transform',
        duration: `${f}, ${f}`,
      };
  }
};

export const SearchBar = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [displayFilter, setDisplayFilter] = useState<FilterType | null>(null);
  const [dropdownPhase, setDropdownPhase] = useState<DropdownPhase>('closed');

  const [isContentVisible, setIsContentVisible] = useState(true);

  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(
    PANEL_SIZES.DESTINATION.width
  );
  const [dropdownHeight, setDropdownHeight] = useState(
    PANEL_SIZES.DESTINATION.height
  );
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState<GuestCounts>({
    ADULTS: 0,
    CHILDREN: 0,
    INFANTS: 0,
    PETS: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const filterRefs: Record<
    FilterType,
    React.RefObject<HTMLButtonElement | null>
  > = {
    DESTINATION: useRef<HTMLButtonElement>(null),
    DATE: useRef<HTMLButtonElement>(null),
    GUESTS: useRef<HTMLButtonElement>(null),
  };
  const contentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = activeFilter !== null;

  const clearContentTimer = () => {
    if (contentTimerRef.current !== null) {
      clearTimeout(contentTimerRef.current);
      contentTimerRef.current = null;
    }
  };

  const calcDropdownPosition = (filter: FilterType) => {
    const el = filterRefs[filter].current;
    const container = containerRef.current;
    const pill = pillRef.current;
    if (el === null || container === null || pill === null) {
      return null;
    }

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const panelWidth = PANEL_SIZES[filter].width;

    const buttonLeft = elRect.left - containerRect.left;
    const buttonRight = elRect.right - containerRect.left;
    const buttonCenter = buttonLeft + elRect.width / 2;

    let left: number;
    if (filter === 'DESTINATION') {
      left = buttonLeft;
    } else if (filter === 'DATE') {
      left = Math.max(
        0,
        Math.min(
          containerRect.width - panelWidth,
          buttonCenter - panelWidth / 2
        )
      );
    } else {
      left = Math.max(0, buttonRight - panelWidth);
    }

    return {
      left,
      width: panelWidth,
      height: PANEL_SIZES[filter].height,
      indicatorLeft: elRect.left - pillRect.left,
      indicatorWidth: elRect.width,
    };
  };

  const handleSectionClick = (filter: FilterType) => {
    clearContentTimer();

    if (activeFilter === filter) {
      setActiveFilter(null);
      setDropdownPhase('closed');
      return;
    }

    const pos = calcDropdownPosition(filter);
    if (pos !== null) {
      setDropdownLeft(pos.left);
      setDropdownWidth(pos.width);
      setDropdownHeight(pos.height);
      setIndicatorLeft(pos.indicatorLeft);
      setIndicatorWidth(pos.indicatorWidth);
    }

    if (activeFilter === null) {
      setDisplayFilter(filter);
      setIsContentVisible(true);
      setDropdownPhase('idle');
    } else {
      setIsContentVisible(false);
      setDropdownPhase('opening');

      contentTimerRef.current = setTimeout(() => {
        setDisplayFilter(filter);
        contentTimerRef.current = null;
        setIsContentVisible(true);
      }, ANIMATION.CONTENT_SWAP_MS);
    }

    setActiveFilter(filter);
  };

  const handleDropdownTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (e.propertyName === 'left' && dropdownPhase === 'opening') {
      setDropdownPhase('idle');
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        clearContentTimer();
        setActiveFilter(null);
        setDropdownPhase('closed');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => () => clearContentTimer(), []);

  const dropdownTransition = getDropdownTransition(dropdownPhase);
  const isSliding = dropdownPhase === 'opening' || dropdownPhase === 'sliding';

  return (
    <div ref={containerRef} className="relative w-full max-w-[860px]">
      {/* 검색 바 Pill */}
      <div
        ref={pillRef}
        className={cn(
          'relative flex w-full items-center rounded-full border transition-[border-color,background-color,box-shadow] duration-200',
          isOpen
            ? 'border-transparent bg-neutral-100 shadow-none'
            : 'border-neutral-300 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]'
        )}
      >
        {/* 슬라이딩 인디케이터 */}
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 z-0 rounded-full bg-white shadow-md',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            left: indicatorLeft,
            width: indicatorWidth,
            transitionProperty: isSliding ? 'left, width, opacity' : 'opacity',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease',
          }}
        />

        {/* 여행지 */}
        <button
          ref={filterRefs.DESTINATION}
          type="button"
          onClick={() => handleSectionClick('DESTINATION')}
          className={cn(
            'relative z-10 flex min-h-14 flex-1 cursor-pointer flex-col justify-center rounded-full px-6 text-left transition-colors',
            isOpen &&
              activeFilter !== 'DESTINATION' &&
              'hover:bg-neutral-200/60'
          )}
        >
          <span className="font-bold text-neutral-800 text-xs leading-none">
            여행지
          </span>
          <span className="mt-0.5 text-neutral-500 text-sm leading-none">
            여행지 검색
          </span>
        </button>

        {/* 구분선 1 */}
        <div
          className={cn(
            'z-10 h-6 w-px flex-shrink-0 bg-neutral-300 transition-opacity',
            (activeFilter === 'DESTINATION' || activeFilter === 'DATE') &&
              'opacity-0'
          )}
        />

        {/* 날짜 */}
        <button
          ref={filterRefs.DATE}
          type="button"
          onClick={() => handleSectionClick('DATE')}
          className={cn(
            'relative z-10 flex min-h-14 flex-1 cursor-pointer flex-col justify-center rounded-full px-6 text-left transition-colors',
            isOpen && activeFilter !== 'DATE' && 'hover:bg-neutral-200/60'
          )}
        >
          <span className="font-bold text-neutral-800 text-xs leading-none">
            날짜
          </span>
          <span className="mt-0.5 text-neutral-500 text-sm leading-none">
            날짜 추가
          </span>
        </button>

        {/* 구분선 2 */}
        <div
          className={cn(
            'z-10 h-6 w-px flex-shrink-0 bg-neutral-300 transition-opacity',
            (activeFilter === 'DATE' || activeFilter === 'GUESTS') &&
              'opacity-0'
          )}
        />

        {/* 여행자 */}
        <button
          ref={filterRefs.GUESTS}
          type="button"
          onClick={() => handleSectionClick('GUESTS')}
          className={cn(
            'relative z-10 flex min-h-14 flex-[1.2] cursor-pointer flex-col justify-center rounded-full py-3 pr-2 pl-6 text-left transition-colors',
            isOpen && activeFilter !== 'GUESTS' && 'hover:bg-neutral-200/60'
          )}
        >
          <span className="font-bold text-neutral-800 text-xs leading-none">
            여행자
          </span>
          {(() => {
            const total = guests.ADULTS + guests.CHILDREN + guests.INFANTS;
            const parts: string[] = [];
            if (total > 0) {
              parts.push(`게스트 ${total}명`);
            }
            if (guests.PETS > 0) {
              parts.push(`반려동물 ${guests.PETS}마리`);
            }
            return parts.length > 0 ? (
              <span className="mt-0.5 truncate text-neutral-800 text-sm leading-none">
                {parts.join(', ')}
              </span>
            ) : (
              <span className="mt-0.5 text-neutral-500 text-sm leading-none">
                게스트 추가
              </span>
            );
          })()}
        </button>

        {/* 검색 버튼 */}
        <button
          type="button"
          aria-label="검색"
          className="relative z-10 m-1 ml-0 flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-airbnb text-white transition-colors hover:bg-airbnb-hover"
        >
          <Search size={16} strokeWidth={3} />
        </button>
      </div>

      {/* 드롭다운 패널 */}
      <div
        onTransitionEnd={handleDropdownTransitionEnd}
        className={cn(
          'absolute top-full mt-3 overflow-hidden rounded-3xl bg-white',
          'shadow-[0_8px_28px_rgba(0,0,0,0.16)]',
          isOpen
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-[0.97] opacity-0'
        )}
        style={{
          left: dropdownLeft,
          width: dropdownWidth,
          height: dropdownHeight,
          transitionProperty: dropdownTransition.property,
          transitionDuration: dropdownTransition.duration,
          transitionTimingFunction: 'ease',
        }}
      >
        <div
          style={{
            opacity: isContentVisible ? 1 : 0,
            transition: `opacity ${ANIMATION.FADE_MS}ms ease`,
          }}
        >
          {displayFilter === 'DESTINATION' && <DestinationPanel />}
          {displayFilter === 'DATE' && (
            <DatePanel dateRange={dateRange} onDateRangeChange={setDateRange} />
          )}
          {displayFilter === 'GUESTS' && (
            <GuestsPanel guests={guests} onGuestsChange={setGuests} />
          )}
        </div>
      </div>
    </div>
  );
};
