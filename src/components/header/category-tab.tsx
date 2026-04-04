import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { ASSET_SRC } from '@/shared/asset';

export type Category = 'STAYS' | 'EXPERIENCES' | 'SERVICES';

type CategoryTabData = {
  id: Category;
  label: string;
  twirlSrc: string;
  selectedSrc: string;
  thumbnail: string;
  showNewBadge: boolean;
};

export const CATEGORY_TABS: CategoryTabData[] = [
  {
    id: 'STAYS',
    label: '숙소',
    twirlSrc: ASSET_SRC.CATEGORY.STAYS.TWIRL,
    selectedSrc: ASSET_SRC.CATEGORY.STAYS.SELECTED,
    thumbnail: ASSET_SRC.CATEGORY.STAYS.THUMBNAIL,
    showNewBadge: false,
  },
  {
    id: 'EXPERIENCES',
    label: '체험',
    twirlSrc: ASSET_SRC.CATEGORY.EXPERIENCES.TWIRL,
    selectedSrc: ASSET_SRC.CATEGORY.EXPERIENCES.SELECTED,
    thumbnail: ASSET_SRC.CATEGORY.EXPERIENCES.THUMBNAIL,
    showNewBadge: true,
  },
  {
    id: 'SERVICES',
    label: '서비스',
    twirlSrc: ASSET_SRC.CATEGORY.SERVICES.TWIRL,
    selectedSrc: ASSET_SRC.CATEGORY.SERVICES.SELECTED,
    thumbnail: ASSET_SRC.CATEGORY.SERVICES.THUMBNAIL,
    showNewBadge: true,
  },
];

type VideoState = 'twirl' | 'selected' | 'thumbnail';

export const CategoryTab = ({
  data,
  isSelected,
  onClick,
}: {
  data: CategoryTabData;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>('twirl');
  const prevIsSelectedRef = useRef(isSelected);

  useEffect(() => {
    const prev = prevIsSelectedRef.current;
    prevIsSelectedRef.current = isSelected;

    if (!prev && isSelected) {
      setVideoState('selected');
    } else if (prev && !isSelected) {
      setVideoState('thumbnail');
    }
  }, [isSelected]);

  const videoSrc =
    videoState === 'twirl'
      ? data.twirlSrc
      : videoState === 'selected'
        ? data.selectedSrc
        : null;

  useEffect(() => {
    if (videoSrc === null) {
      return;
    }
    let cancelled = false;
    const video = videoRef.current;
    if (video === null) {
      return () => {
        cancelled = true;
      };
    }
    void video.play().catch(() => {
      if (!cancelled) {
        setVideoState('thumbnail');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex gap-3 cursor-pointer items-center justify-end border-b-3 pb-1 border-transparent bg-transparent text-neutral-500 transition-colors',
        isSelected && 'border-neutral-800 text-neutral-800'
      )}
    >
      <div className="relative flex items-center justify-center">
        {data.showNewBadge && (
          <span className="pointer-events-none absolute -right-6 -top-1 z-10 rounded-full bg-neutral-900 px-1.5 py-0.5 text-[8px] font-extrabold tracking-[0.4px] text-white">
            NEW
          </span>
        )}
        {videoSrc !== null ? (
          <span className="relative h-10 w-10 overflow-hidden">
            <video
              key={videoSrc}
              ref={videoRef}
              muted
              playsInline
              onError={() => setVideoState('thumbnail')}
              onEnded={() => setVideoState('thumbnail')}
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 object-cover"
            >
              <source src={videoSrc} type="video/webm" />
            </video>
          </span>
        ) : (
          <span className="relative h-10 w-10 overflow-hidden">
            <img
              src={data.thumbnail}
              alt={data.label}
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 object-cover"
            />
          </span>
        )}
      </div>
      <span className="whitespace-nowrap text-sm font-semibold leading-none">
        {data.label}
      </span>
    </button>
  );
};
