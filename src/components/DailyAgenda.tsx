import StatusPill from './StatusPill'

export type AgendaCategory =
  | 'Class' | 'Task' | 'Personal' | 'Deadline'
  | 'Seminar' | 'Meeting' | 'Workshop'

export type DailyAgendaItem = {
  id: string | number
  time: string
  endTime?: string
  title: string
  subtitle: string
  category: AgendaCategory
}

type PillVariant = 'blue' | 'red' | 'green' | 'orange' | 'purple'

const CAT_VARIANT: Record<AgendaCategory, PillVariant> = {
  Class:    'blue',
  Deadline: 'red',
  Personal: 'green',
  Meeting:  'orange',
  Task:     'orange',
  Seminar:  'purple',
  Workshop: 'purple',
}

export type DailyAgendaProps = {
  dateLabel: string
  showTodayBadge?: boolean
  items: DailyAgendaItem[]
  bottomAction?: React.ReactNode
  onItemClick?: (item: DailyAgendaItem) => void
}

export default function DailyAgenda({
  dateLabel,
  showTodayBadge = false,
  items,
  bottomAction,
  onItemClick,
}: DailyAgendaProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E6ECF3',
      borderRadius: 16,
      boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 14px' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#0A254F' }}>{dateLabel}</span>
        {showTodayBadge && (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#1B3FA0', borderRadius: 999, padding: '3px 10px' }}>
            Today
          </span>
        )}
      </div>
      <div style={{ height: 1, background: '#EEF2F7' }} />

      {/* Agenda rows */}
      <div style={{ padding: '4px 20px 0' }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '11px 0',
              borderBottom: i < items.length - 1 ? '1px solid #EEF2F7' : 'none',
              cursor: onItemClick ? 'pointer' : 'default',
              borderRadius: 8,
            }}
          >
            {/* Time column */}
            <div style={{ width: 60, flexShrink: 0, paddingTop: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0A254F', lineHeight: '16px' }}>
                {item.time}
              </div>
              {item.endTime && (
                <div style={{ fontSize: 11, color: '#B4C0D0', lineHeight: '15px' }}>
                  {item.endTime}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#0A254F',
                lineHeight: '18px', marginBottom: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: 12, color: '#7B8DA5',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.subtitle}
              </div>
            </div>

            {/* Category pill */}
            <div style={{ flexShrink: 0, paddingTop: 1 }}>
              <StatusPill label={item.category} variant={CAT_VARIANT[item.category]} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom action slot */}
      {bottomAction && (
        <div style={{ padding: '6px 20px 16px' }}>
          {bottomAction}
        </div>
      )}
    </div>
  )
}
