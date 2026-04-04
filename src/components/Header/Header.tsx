import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';

type Category = 'STAYS' | 'EXPERIENCES' | 'SERVICES';

type CategoryTabData = {
  id: Category;
  label: string;
  twirlSrc: string;
  selectedSrc: string;
  thumbnail: string;
  showNewBadge: boolean;
};

const CATEGORY_TABS: CategoryTabData[] = [
  {
    id: 'STAYS',
    label: '숙소',
    twirlSrc: '/header/house-twirl-selected.webm',
    selectedSrc: '/header/house-selected.webm',
    thumbnail: '/header/house.avif',
    showNewBadge: false,
  },
  {
    id: 'EXPERIENCES',
    label: '체험',
    twirlSrc: '/header/balloon-twirl.webm',
    selectedSrc: '/header/balloon-selected.webm',
    thumbnail: '/header/balloon.avif',
    showNewBadge: true,
  },
  {
    id: 'SERVICES',
    label: '서비스',
    twirlSrc: '/header/consierge-twirl.webm',
    selectedSrc: '/header/consierge-selected.webm',
    thumbnail: '/header/consierge.avif',
    showNewBadge: true,
  },
];

type CategoryTabProps = {
  data: CategoryTabData;
  isSelected: boolean;
  onClick: () => void;
};

const CategoryTab = ({ data, isSelected, onClick }: CategoryTabProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showThumbnail, setShowThumbnail] = useState(false);

  const currentSrc = isSelected ? data.selectedSrc : data.twirlSrc;

  useEffect(() => {
    setShowThumbnail(false);
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.load();
    void video.play().catch(() => setShowThumbnail(true));
  }, [currentSrc]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.categoryTab} ${isSelected ? styles.categoryTabSelected : ''}`}
    >
      <div className={styles.videoContainer}>
        {data.showNewBadge && <span className={styles.newBadge}>NEW</span>}
        {showThumbnail ? (
          <img
            src={data.thumbnail}
            alt={data.label}
            className={styles.categoryIcon}
          />
        ) : (
          <video
            key={currentSrc}
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onError={() => setShowThumbnail(true)}
            onEnded={() => setShowThumbnail(true)}
            className={styles.categoryIcon}
          >
            <source src={currentSrc} type="video/webm" />
          </video>
        )}
      </div>
      <span className={styles.categoryLabel}>{data.label}</span>
    </button>
  );
};

const AirbnbLogo = () => (
  <div className={styles.logo}>
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="#FF385C"
      aria-label="Airbnb"
    >
      {/*
        Bélo symbol: two upper lobes meeting at a center notch, tapering to a
        bottom point. Inner circle subtracted via evenodd fill rule.
      */}
      <path
        fillRule="evenodd"
        d="M16 27
           C12 21 7 17 7 11
           C7 6 10.5 3 14 4
           C15 4.5 15.5 5.5 16 6.5
           C16.5 5.5 17 4.5 18 4
           C21.5 3 25 6 25 11
           C25 17 20 21 16 27Z
           M16 9
           C14.3 9 13 10.3 13 12
           C13 13.7 14.3 15 16 15
           C17.7 15 19 13.7 19 12
           C19 10.3 17.7 9 16 9Z"
      />
    </svg>
    <span className={styles.logoText}>airbnb</span>
  </div>
);

const SearchBar = () => (
  <div className={styles.searchBar}>
    <div className={styles.searchSection}>
      <span className={styles.searchLabel}>여행지</span>
      <span className={styles.searchPlaceholder}>여행지 검색</span>
    </div>
    <div className={styles.searchDivider} />
    <div className={styles.searchSection}>
      <span className={styles.searchLabel}>날짜</span>
      <span className={styles.searchPlaceholder}>날짜 추가</span>
    </div>
    <div className={styles.searchDivider} />
    <div className={`${styles.searchSection} ${styles.searchSectionLast}`}>
      <span className={styles.searchLabel}>여행자</span>
      <span className={styles.searchPlaceholder}>게스트 추가</span>
    </div>
    <button type="button" className={styles.searchButton} aria-label="검색">
      <svg viewBox="0 0 32 32" width="16" height="16" fill="white">
        <path d="M13 24C7.477 24 3 19.523 3 14S7.477 4 13 4s10 4.477 10 10a9.959 9.959 0 0 1-2.065 6.099l6.983 6.983-1.414 1.414-6.983-6.983A9.959 9.959 0 0 1 13 24zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
      </svg>
    </button>
  </div>
);

const RightNav = () => (
  <nav className={styles.rightNav}>
    <button type="button" className={styles.hostingButton}>
      호스팅 하기
    </button>
    <button type="button" className={styles.iconButton} aria-label="언어 선택">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M8 .5a7.5 7.5 0 1 0 0 15A7.5 7.5 0 0 0 8 .5zM1.5 8a6.5 6.5 0 0 1 .08-1h2.05c-.04.33-.06.66-.06 1s.02.67.06 1H1.58A6.5 6.5 0 0 1 1.5 8zm.73 2h1.69c.18.72.44 1.38.76 1.93A6.51 6.51 0 0 1 2.23 10zm1.69-4H2.23a6.51 6.51 0 0 1 2.45-1.93A8.53 8.53 0 0 0 3.92 6zM8 14.4c-.7 0-1.6-1.18-2.1-3.4h4.2C9.6 13.22 8.7 14.4 8 14.4zm-2.27-4.4A9.63 9.63 0 0 1 5.5 8c0-.35.08-.69.23-1h4.54c.15.31.23.65.23 1s-.08.69-.23 1H5.73zm.13-3C6.36 4.78 7.26 3.6 8 3.6c.74 0 1.64 1.18 2.14 3.4H5.86zM10.4 10h1.68a6.51 6.51 0 0 1-2.44 1.93c.32-.55.58-1.21.76-1.93zm1.68-4H10.4a8.53 8.53 0 0 0-.76-1.93A6.51 6.51 0 0 1 12.08 6zm.34 2h-2.06c.04-.33.06-.66.06-1s-.02-.67-.06-1h2.06c.05.32.08.66.08 1s-.03.68-.08 1z" />
      </svg>
    </button>
    <button type="button" className={styles.menuButton} aria-label="메뉴">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <rect x="1" y="3.5" width="14" height="1.25" rx="0.625" />
        <rect x="1" y="7.375" width="14" height="1.25" rx="0.625" />
        <rect x="1" y="11.25" width="14" height="1.25" rx="0.625" />
      </svg>
      <svg viewBox="0 0 32 32" width="24" height="24" fill="currentColor">
        <path d="M16 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 2C10.477 19 5 21.686 5 26v1h22v-1c0-4.314-5.477-7-11-7z" />
      </svg>
    </button>
  </nav>
);

const Header = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('STAYS');

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <AirbnbLogo />
        <div className={styles.categoryTabs}>
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
      <div className={styles.headerBottom}>
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
