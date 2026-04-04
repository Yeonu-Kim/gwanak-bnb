import { Search } from '@/components/ui/icon';

export const SearchBar = () => (
  <div className="flex w-full max-w-[860px] items-center overflow-hidden rounded-full border border-neutral-300 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]">
    <div className="flex min-h-14 flex-1 cursor-pointer flex-col justify-center rounded-full px-6 transition-colors hover:bg-neutral-100">
      <span className="font-bold text-neutral-800 text-xs leading-none">
        여행지
      </span>
      <span className="mt-0.5 text-neutral-500 text-sm leading-none">
        여행지 검색
      </span>
    </div>

    <div className="h-6 w-px flex-shrink-0 bg-neutral-300" />

    <div className="flex min-h-14 flex-1 cursor-pointer flex-col justify-center rounded-full px-6 transition-colors hover:bg-neutral-100">
      <span className="font-bold text-neutral-800 text-xs leading-none">
        날짜
      </span>
      <span className="mt-0.5 text-neutral-500 text-sm leading-none">
        날짜 추가
      </span>
    </div>

    <div className="h-6 w-px flex-shrink-0 bg-neutral-300" />

    <div className="flex min-h-14 flex-[1.2] cursor-pointer flex-col justify-center rounded-full py-3 pr-2 pl-6 transition-colors hover:bg-neutral-100">
      <span className="font-bold text-neutral-800 text-xs leading-none">
        여행자
      </span>
      <span className="mt-0.5 text-neutral-500 text-sm leading-none">
        게스트 추가
      </span>
    </div>

    <button
      type="button"
      aria-label="검색"
      className="m-1 ml-0 flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-airbnb text-white transition-colors hover:bg-airbnb-hover"
    >
      <Search size={16} strokeWidth={3} />
    </button>
  </div>
);
