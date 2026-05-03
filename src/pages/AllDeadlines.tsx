import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Clock, ChevronRight } from 'lucide-react'
import StatusPill from '../components/StatusPill'

type DeadlineStatus = 'Not started' | 'In progress' | 'Submitted'

type Deadline = {
  id: number
  title: string
  code: string
  course: string
  dueLabel: string
  time: string
  remaining: string
  status: DeadlineStatus
  color: string
  iconColor: string
  route: string
  thisWeek: boolean
}

const ALL_DEADLINES: Deadline[] = [
  {
    id: 1,
    title: 'Lab Report 2: Enzyme Kinetics',
    code: 'BIOL08019',
    course: 'Molecular Biology',
    dueLabel: 'Due tomorrow, 14 May',
    time: '11:59 PM',
    remaining: '18h 45m',
    status: 'Not started',
    color: '#FFECEC',
    iconColor: '#EF4444',
    route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics',
    thisWeek: true,
  },
  {
    id: 2,
    title: 'Critical Analysis: Globalisation and Culture',
    code: 'SOCI08001',
    course: 'Sociology',
    dueLabel: 'Due in 2 days, 16 May',
    time: '5:00 PM',
    remaining: '2d 5h',
    status: 'In progress',
    color: '#FFF3E6',
    iconColor: '#F97316',
    route: '/courses/sociology/assignments/critical-analysis-globalisation-culture',
    thisWeek: true,
  },
  {
    id: 3,
    title: 'Presentation: Marketing Strategy',
    code: 'MGTS08018',
    course: 'Marketing',
    dueLabel: 'Due 18 May',
    time: '3:00 PM',
    remaining: '4d left',
    status: 'Not started',
    color: '#F1F5F9',
    iconColor: '#48607A',
    route: '/courses/marketing/assignments/presentation-marketing-strategy',
    thisWeek: true,
  },
  {
    id: 4,
    title: 'Data Analysis Portfolio',
    code: 'DSCI08012',
    course: 'Data Science',
    dueLabel: 'Due 20 May',
    time: '5:00 PM',
    remaining: '6d left',
    status: 'Not started',
    color: '#F1F5F9',
    iconColor: '#48607A',
    route: '/courses/data-science/assignments/data-analysis-portfolio',
    thisWeek: false,
  },
  {
    id: 5,
    title: 'Design Prototype Submission',
    code: 'INFR08020',
    course: 'Design Informatics',
    dueLabel: 'Due 23 May',
    time: '2:00 PM',
    remaining: '9d left',
    status: 'In progress',
    color: '#FFF3E6',
    iconColor: '#F97316',
    route: '/courses/design-informatics/assignments/design-prototype-submission',
    thisWeek: false,
  },
]

const FILTERS = ['All', 'Due this week', 'Not started', 'In progress', 'Submitted'] as const
type Filter = typeof FILTERS[number]

function statusVariant(s: DeadlineStatus) {
  if (s === 'Not started') return 'red' as const
  if (s === 'In progress') return 'orange' as const
  return 'green' as const
}

export default function AllDeadlines() {
  const navigate = useNavigate()
  const [active, setActive] = useState<Filter>('All')

  const filtered = ALL_DEADLINES.filter((d) => {
    if (active === 'All') return true
    if (active === 'Due this week') return d.thisWeek
    if (active === 'Not started') return d.status === 'Not started'
    if (active === 'In progress') return d.status === 'In progress'
    if (active === 'Submitted') return d.status === 'Submitted'
    return true
  })

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto min-w-0">
        <div style={{ padding: '32px 40px 48px', maxWidth: 900 }}>

          {/* Back link */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2563EB] mb-6 hover:opacity-75 transition-opacity"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to Dashboard
          </button>

          {/* Title */}
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#0A254F', letterSpacing: '-0.02em', marginBottom: 20 }}>
            All Deadlines
          </h1>

          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                style={{
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 999,
                  border: `1px solid ${active === f ? '#1B3FA0' : '#E6ECF3'}`,
                  background: active === f ? '#1B3FA0' : '#fff',
                  color: active === f ? '#fff' : '#48607A',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Deadline list */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #E6ECF3',
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
              overflow: 'hidden',
            }}
          >
            {filtered.length === 0 && (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#7B8DA5', fontSize: 14 }}>
                No deadlines match this filter.
              </div>
            )}
            {filtered.map((d, i) => (
              <div key={d.id}>
                <div
                  onClick={() => navigate(d.route)}
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#F9FBFF] transition-colors"
                >
                  {/* Icon */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-xl"
                    style={{ width: 40, height: 40, background: d.color }}
                  >
                    <FileText size={18} strokeWidth={1.75} style={{ color: d.iconColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#0A254F] mb-0.5 truncate">
                      {d.title}
                    </div>
                    <div className="text-[12px] text-[#48607A]">
                      {d.code} – {d.course}
                    </div>
                  </div>

                  {/* Due info */}
                  <div className="shrink-0 text-right mr-4">
                    <div className="text-[12px] font-semibold mb-0.5" style={{ color: d.iconColor }}>
                      {d.dueLabel}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-[#7B8DA5]">
                      <Clock size={11} strokeWidth={1.75} />
                      <span>{d.remaining}</span>
                      <span className="mx-1 opacity-40">·</span>
                      <span>{d.time}</span>
                    </div>
                  </div>

                  {/* Status + chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusPill label={d.status} variant={statusVariant(d.status)} />
                    <ChevronRight size={15} strokeWidth={1.75} className="text-[#D7E0EA]" />
                  </div>
                </div>
                {i < filtered.length - 1 && <div className="border-t border-[#EEF2F7] mx-6" />}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
