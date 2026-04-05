import { Button } from '@/components/ui/button';
import { Minus, Plus } from '@/components/ui/icon';

export type GuestCounts = {
  ADULTS: number;
  CHILDREN: number;
  INFANTS: number;
  PETS: number;
};

type GuestsPanelProps = {
  guests: GuestCounts;
  onGuestsChange: (guests: GuestCounts) => void;
};

type GuestRowConfig = {
  key: keyof GuestCounts;
  label: string;
  description: string;
  max: number;
};

const GUEST_ROWS: GuestRowConfig[] = [
  { key: 'ADULTS', label: '성인', description: '13세 이상', max: 16 },
  { key: 'CHILDREN', label: '어린이', description: '2~12세', max: 5 },
  { key: 'INFANTS', label: '유아', description: '2세 미만', max: 5 },
  {
    key: 'PETS',
    label: '반려동물',
    description: '보조동물을 동반하시나요?',
    max: 5,
  },
];

export const GuestsPanel = ({ guests, onGuestsChange }: GuestsPanelProps) => {
  const handleChange = (key: keyof GuestCounts, delta: number) => {
    const targetInfo = GUEST_ROWS.find((r) => r.key === key);
    if (targetInfo === undefined) {
      return;
    }

    const next = Math.max(0, Math.min(targetInfo.max, guests[key] + delta));
    const updatedGuests: GuestCounts = { ...guests, [key]: next };

    if (
      (key === 'CHILDREN' || key === 'INFANTS' || key === 'PETS') &&
      next > 0 &&
      updatedGuests.ADULTS === 0
    ) {
      updatedGuests.ADULTS = 1;
    }

    onGuestsChange(updatedGuests);
  };

  return (
    <div className="w-80 divide-y divide-neutral-200 p-6">
      {GUEST_ROWS.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
        >
          <div>
            <p className="font-medium text-neutral-800 text-sm">{row.label}</p>
            <p className="mt-0.5 text-neutral-500 text-xs">{row.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={
                guests[row.key] === 0 ||
                (row.key === 'ADULTS' &&
                  guests.ADULTS === 1 &&
                  (guests.CHILDREN > 0 ||
                    guests.INFANTS > 0 ||
                    guests.PETS > 0))
              }
              onClick={() => handleChange(row.key, -1)}
              aria-label={`${row.label} 감소`}
            >
              <Minus size={14} />
            </Button>
            <span className="w-5 text-center font-medium text-neutral-800 text-sm">
              {guests[row.key]}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={guests[row.key] === row.max}
              onClick={() => handleChange(row.key, 1)}
              aria-label={`${row.label} 증가`}
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
