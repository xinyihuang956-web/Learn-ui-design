import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export type MiniCalendarProps = {
  monthLabel: string
  weeks: (number | null)[][]
  selectedDate: number
  eventDots?: Record<number, string>
  onPrev?: () => void
  onNext?: () => void
  onDateSelect?: (day: number) => void
}

export default function MiniCalendar({
  monthLabel,
  weeks,
  selectedDate,
  eventDots = {},
  onPrev,
  onNext,
  onDateSelect,
}: MiniCalendarProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E6ECF3',
      borderRadius: 16,
      padding: '16px',
      boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
    }}>
      {/* Header: month label + nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#0A254F' }}>{monthLabel}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={onPrev}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '1px solid #E6ECF3', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7B8DA5', cursor: 'pointer',
            }}
          >
            <ChevronLeft size={14} strokeWidth={1.75} />
          </button>
          <button
            onClick={onNext}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '1px solid #E6ECF3', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7B8DA5', cursor: 'pointer',
            }}
          >
            <ChevronRight size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
        {DAY_LABELS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#B4C0D0', padding: '2px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weeks.flat().map((day, idx) => {
          const isSelected = day === selectedDate
          const dotColor = eventDots[day ?? -1]
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 0' }}>
              {day !== null ? (
                <>
                  <button
                    onClick={() => onDateSelect?.(day)}
                    style={{
                      width: 28, height: 28,
                      borderRadius: '50%',
                      border: 'none',
                      background: isSelected ? '#1B3FA0' : 'transparent',
                      color: isSelected ? '#fff' : '#0A254F',
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 400,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {day}
                  </button>
                  <span style={{
                    width: 5, height: 5,
                    borderRadius: '50%',
                    background: !isSelected && dotColor ? dotColor : 'transparent',
                    marginTop: 1,
                    display: 'block',
                  }} />
                </>
              ) : (
                <span style={{ width: 28, height: 33, display: 'block' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
