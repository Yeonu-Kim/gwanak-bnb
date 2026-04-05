import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';

import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type DateMode = 'specific' | 'flexible';

type DatePanelProps = {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
};

export const DatePanel = ({ dateRange, onDateRangeChange }: DatePanelProps) => {
  const [dateMode, setDateMode] = useState<DateMode>('specific');

  return (
    <div className="p-6">
      {/* Mode Toggle */}
      <div className="mb-6 flex justify-center">
        <div className="flex rounded-full border border-neutral-300 p-1">
          <button
            type="button"
            onClick={() => setDateMode('specific')}
            className={cn(
              'cursor-pointer rounded-full px-5 py-2 font-medium text-sm transition-colors',
              dateMode === 'specific'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            날짜 지정
          </button>
          <button
            type="button"
            onClick={() => setDateMode('flexible')}
            className={cn(
              'cursor-pointer rounded-full px-5 py-2 font-medium text-sm transition-colors',
              dateMode === 'flexible'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            유연한 일정
          </button>
        </div>
      </div>

      {dateMode === 'specific' ? (
        <div className="flex justify-center">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={dateRange}
            onSelect={onDateRangeChange}
            locale={ko}
            disabled={{ before: new Date() }}
            className="[--cell-size:2.25rem]"
          />
        </div>
      ) : (
        <div className="flex h-40 w-[640px] items-center justify-center text-neutral-500 text-sm">
          유연한 일정 선택 기능은 준비 중입니다.
        </div>
      )}
    </div>
  );
};
