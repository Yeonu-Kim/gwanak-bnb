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

type VideoState = 'TWIRL' | 'SELECTED' | 'THUMBNAIL';

const resolveVideoState = (
  twirlDone: boolean,
  isSelected: boolean,
  hasBeenSelected: boolean
): VideoState => {
  if (!twirlDone) {
    return 'TWIRL';
  }
  if (isSelected) {
    return 'SELECTED';
  }
  if (hasBeenSelected) {
    return 'THUMBNAIL';
  }
  return 'TWIRL';
};

const resolveVideoSrc = (
  videoState: VideoState,
  data: CategoryTabData
): string | null => {
  if (videoState === 'TWIRL') {
    return data.twirlSrc;
  }
  if (videoState === 'SELECTED') {
    return data.selectedSrc;
  }
  return null;
};

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
  const [twirlDone, setTwirlDone] = useState(false);
  const [hasBeenSelected, setHasBeenSelected] = useState(false);

  const videoState = resolveVideoState(twirlDone, isSelected, hasBeenSelected);
  const videoSrc = resolveVideoSrc(videoState, data);

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
        if (!twirlDone) {
          setTwirlDone(true);
        } else {
          setHasBeenSelected(true);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  const handleVideoEnded = () => {
    if (!twirlDone) {
      setTwirlDone(true);
    } else {
      setHasBeenSelected(true);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'flex cursor-pointer items-center justify-end gap-3 border-transparent border-b-3 bg-transparent pb-1 text-neutral-500 transition-colors',
        isSelected && 'border-neutral-800 text-neutral-800'
      )}
    >
      <div className="relative flex items-center justify-center">
        {data.showNewBadge && (
          <span className="pointer-events-none absolute -top-1 -right-6 z-10 rounded-full bg-neutral-900 px-1.5 py-0.5 font-extrabold text-[8px] text-white tracking-[0.4px]">
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
              onEnded={handleVideoEnded}
              onError={handleVideoEnded}
              className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 object-cover"
            >
              <source src={videoSrc} type="video/webm" />
            </video>
          </span>
        ) : (
          <span className="relative h-10 w-10 overflow-hidden">
            <img
              src={data.thumbnail}
              alt={data.label}
              className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 object-cover"
            />
          </span>
        )}
      </div>
      <span className="whitespace-nowrap font-semibold text-sm leading-none">
        {data.label}
      </span>
    </button>
  );
};
