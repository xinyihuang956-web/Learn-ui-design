import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, FileText, MessageSquare,
  Megaphone, Star, BookOpen, ChevronRight,
} from 'lucide-react'

type UpdateCategory = 'Announcement' | 'Material' | 'Feedback'

type Update = {
  id: number
  icon: React.ReactNode
  courseCode: string
  content: string
  time: string
  unread: boolean
  category: UpdateCategory
  route: string
}

const iconProps = { size: 15, strokeWidth: 1.75 } as const

const ALL_UPDATES: Update[] = [
  {
    id: 1,
    icon: <FileText {...iconProps} />,
    courseCode: 'BIOL08019',
    content: 'New slides uploaded · Week 4 – Cell Signalling',
    time: '2h ago',
    unread: true,
    category: 'Material',
    route: '/courses/biol08019',
  },
  {
    id: 2,
    icon: <MessageSquare {...iconProps} />,
    courseCode: 'SOCI08024',
    content: 'Room Change: Seminar on 15 May',
    time: '4h ago',
    unread: true,
    category: 'Announcement',
    route: '/courses',
  },
  {
    id: 3,
    icon: <Megaphone {...iconProps} />,
    courseCode: 'DESI08009',
    content: 'Announcement slides published',
    time: 'Yesterday',
    unread: false,
    category: 'Announcement',
    route: '/courses',
  },
  {
    id: 4,
    icon: <Star {...iconProps} />,
    courseCode: 'DATA08006',
    content: 'Assignment feedback released',
    time: 'Yesterday',
    unread: false,
    category: 'Feedback',
    route: '/courses',
  },
  {
    id: 5,
    icon: <BookOpen {...iconProps} />,
    courseCode: 'MKTG08012',
    content: 'Week 9 reading list updated',
    time: '2 days ago',
    unread: false,
    category: 'Material',
    route: '/courses',
  },
  {
    id: 6,
    icon: <FileText {...iconProps} />,
    courseCode: 'BIOL08019',
    content: 'Lab report rubric clarified',
    time: '3 days ago',
    unread: false,
    category: 'Announcement',
    route: '/courses/biol08019',
  },
  {
    id: 7,
    icon: <MessageSquare {...iconProps} />,
    courseCode: 'SOCI08024',
    content: 'New seminar discussion prompt posted',
    time: '3 days ago',
    unread: false,
    category: 'Announcement',
    route: '/courses',
  },
]

const FILTERS = ['All', 'Unread', 'Announcements', 'Materials', 'Feedback'] as const
type Filter = typeof FILTERS[number]

export default function CourseUpdates() {
  const navigate = useNavigate()
  const [active, setActive] = useState<Filter>('All')

  const filtered = ALL_UPDATES.filter((u) => {
    if (active === 'All') return true
    if (active === 'Unread') return u.unread
    if (active === 'Announcements') return u.category === 'Announcement'
    if (active === 'Materials') return u.category === 'Material'
    if (active === 'Feedback') return u.category === 'Feedback'
    return true
  })

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="w-full max-w-[1280px] mx-auto" style={{ padding: '32px 40px 48px' }}>

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
            Course Updates
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

          {/* Updates list */}
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
                No updates match this filter.
              </div>
            )}
            {filtered.map((u, i) => (
              <div key={u.id}>
                <div
                  onClick={() => navigate(u.route)}
                  className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-[#F9FBFF] transition-colors"
                >
                  {/* Unread dot */}
                  <div className="w-2 shrink-0 flex justify-center">
                    {u.unread
                      ? <span className="w-2 h-2 rounded-full bg-[#2563EB] block" />
                      : <span className="w-2 h-2 block" />
                    }
                  </div>

                  {/* Icon */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-lg"
                    style={{
                      width: 34,
                      height: 34,
                      background: u.unread ? '#EAF2FF' : '#F1F5F9',
                      color: u.unread ? '#2563EB' : '#7B8DA5',
                    }}
                  >
                    {u.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-semibold" style={{ color: u.unread ? '#0A254F' : '#48607A' }}>
                      {u.courseCode}
                    </span>
                    <span className="text-[13px] text-[#48607A]"> · {u.content}</span>
                  </div>

                  <span className="text-[12px] text-[#B4C0D0] shrink-0 ml-2">{u.time}</span>
                  <ChevronRight size={14} strokeWidth={1.75} className="text-[#D7E0EA] shrink-0" />
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
