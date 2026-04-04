import { useState } from 'react';
import {
  CATEGORY_TABS,
  type Category,
  CategoryTab,
} from '@/components/header/category-tab';
import { SearchBar } from '@/components/header/search-bar';
import { Globe, Menu } from '@/components/ui/icon';
import { ASSET_SRC } from '@/shared/asset';

const AirbnbLogo = () => (
  <a
    href="#"
    className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-shrink-0 cursor-pointer items-center gap-0.5"
  >
    <img className="w-30" src={ASSET_SRC.LOGO} alt="Airbnb" />
  </a>
);

const RightNav = () => (
  <nav className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
    <button
      type="button"
      className="cursor-pointer whitespace-nowrap rounded-3xl border-none bg-transparent px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100"
    >
      호스팅 하기
    </button>

    <button
      type="button"
      aria-label="언어 선택"
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-neutral-800 transition-colors hover:bg-neutral-100"
    >
      <Globe size={16} />
    </button>

    <button
      type="button"
      aria-label="메뉴"
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-neutral-800 transition-colors hover:bg-neutral-100"
    >
      <Menu size={16} />
    </button>
  </nav>
);

export const Header = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('STAYS');

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="relative px-12 pt-1 flex h-20.5 max-w-[1760px] items-center justify-center px-6">
        <AirbnbLogo />
        <div className="flex h-full gap-9 items-center">
          {CATEGORY_TABS.map((tab) => (
            <CategoryTab
              key={tab.id}
              data={tab}
              isSelected={selectedCategory === tab.id}
              onClick={() => setSelectedCategory(tab.id)}
            />
          ))}
        </div>
        <RightNav />
      </div>

      <div className="flex justify-center px-6 pb-10">
        <SearchBar />
      </div>
    </header>
  );
};
