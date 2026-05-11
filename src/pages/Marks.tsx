import { useState } from 'react'
import { Award, FileText, Eye, Clock, X, ChevronRight } from 'lucide-react'

type FeedbackStatus = 'Available' | 'Pending' | 'Not released'

interface MarkRow {
  id: string
  assignment: string
  course: string
  code: string
  mark: number | null
  status: FeedbackStatus
  strengths?: string
  improve?: string
  comment?: string
}

const MARKS: MarkRow[] = [
  {
    id: 'mol-1',
    assignment: 'Lab Report 1',
    course: 'Molecular Biology', code: 'BIOL08019',
    mark: 72, status: 'Available',
    strengths: 'Excellent methodology and clear data presentation. Good use of spectrophotometric data.',
    improve: 'Discussion of limitations could be more thorough. Consider addressing systematic errors.',
    comment: 'Strong experimental design overall. A well-written report — well done.',
  },
  {
    id: 'soci-1',
    assignment: 'Critical Reading Response',
    course: 'Sociology', code: 'SOCI08001',
    mark: 68, status: 'Available',
    strengths: 'Good engagement with key theoretical frameworks and sociological concepts.',
    improve: 'More critical engagement with primary sources needed. Try to challenge authors\' assumptions.',
    comment: 'Solid work. Consider varying your source types more in future essays.',
  },
  {
    id: 'mktg-1',
    assignment: 'Group Presentation',
    course: 'Marketing', code: 'MGTS08018',
    mark: null, status: 'Pending',
  },
  {
    id: 'hist-1',
    assignment: 'Source Commentary',
    course: 'Global History', code: 'HIST08007',
    mark: 65, status: 'Available',
    strengths: 'Good historical context and confident engagement with primary source material.',
    improve: 'Add more historiographical perspective. Reference secondary literature more explicitly.',
    comment: 'Well researched. A good foundation — keep developing your analytical voice.',
  },
  {
    id: 'design-1',
    assignment: 'Prototype Review',
    course: 'Design Informatics', code: 'INFR08020',
    mark: 74, status: 'Available',
    strengths: 'Creative UI design with strong UX rationale. Clear user-centred approach throughout.',
    improve: 'Could enhance accessibility features. Consider WCAG guidelines more explicitly.',
    comment: 'Impressive prototype. Excellent work — your design decisions are well justified.',
  },
  {
    id: 'data-1',
    assignment: 'Portfolio Checkpoint',
    course: 'Data Science', code: 'DSCI08012',
    mark: null, status: 'Not released',
  },
]

function FeedbackModal({ row, onClose }: { row: MarkRow; onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 440, padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0A254F' }}>{row.assignment}</div>
            <div style={{ fontSize: 13, color: '#7B8DA5', marginTop: 2 }}>{row.course} · {row.code}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5', flexShrink: 0 }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {row.mark !== null && (
          <div style={{ background: '#EAF2FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '14px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#7B8DA5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Your mark</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#1B3FA0' }}>{row.mark}%</div>
          </div>
        )}

        {row.strengths && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1F9D55', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Strengths</div>
            <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>{row.strengths}</div>
          </div>
        )}
        {row.improve && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Areas to improve</div>
            <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>{row.improve}</div>
          </div>
        )}
        {row.comment && (
          <div style={{ marginBottom: 20, padding: '12px 14px', background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7B8DA5', marginBottom: 4 }}>Lecturer comment</div>
            <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px', fontStyle: 'italic' }}>{row.comment}</div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function Marks() {
  const [selected, setSelected] = useState<MarkRow | null>(null)

  const stats = [
    { icon: <Award size={20} strokeWidth={1.75} color="#2563EB" />, label: 'Average mark',       value: '68%',  bg: '#EAF2FF' },
    { icon: <FileText size={20} strokeWidth={1.75} color="#7C3AED" />, label: 'Submitted coursework', value: '8',   bg: '#F3E8FF' },
    { icon: <Eye size={20} strokeWidth={1.75} color="#1F9D55" />,    label: 'Feedback received', value: '5',    bg: '#EAF8F0' },
    { icon: <Clock size={20} strokeWidth={1.75} color="#F97316" />,  label: 'Pending feedback',  value: '3',    bg: '#FFF3E6' },
  ]

  const pillStyle = (status: FeedbackStatus) => ({
    fontSize: 12, fontWeight: 600, borderRadius: 999, padding: '4px 10px',
    background: status === 'Available' ? '#EAF8F0' : status === 'Pending' ? '#FFF3E6' : '#F1F5F9',
    color:      status === 'Available' ? '#1F9D55' : status === 'Pending' ? '#F97316' : '#7B8DA5',
    border:     `1px solid ${status === 'Available' ? '#86EFAC' : status === 'Pending' ? '#FDBA74' : '#E6ECF3'}`,
  })

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="w-full max-w-[1280px] mx-auto" style={{ padding: '28px 32px 40px' }}>

          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#0A254F', letterSpacing: '-0.02em', marginBottom: 28 }}>
            Marks
          </h1>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 28 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 14, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '20px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 12, color: '#7B8DA5', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#0A254F' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Marks table */}
          <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px 120px 40px', gap: 0, padding: '12px 24px', borderBottom: '1px solid #E6ECF3', background: '#F9FBFF' }}>
              {['Assignment', 'Mark', 'Status', '', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#7B8DA5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>

            {MARKS.map((row, i) => (
              <div key={row.id}>
                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px 120px 40px', gap: 0, padding: '16px 24px', alignItems: 'center', cursor: 'default', background: 'transparent', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FBFF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0A254F', marginBottom: 2 }}>{row.assignment}</div>
                    <div style={{ fontSize: 12, color: '#7B8DA5' }}>{row.course} · {row.code}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: row.mark !== null ? '#0A254F' : '#B4C0D0' }}>
                    {row.mark !== null ? `${row.mark}%` : '—'}
                  </div>
                  <div><span style={pillStyle(row.status)}>{row.status}</span></div>
                  <div>
                    {row.status === 'Available' && (
                      <button
                        onClick={() => setSelected(row)}
                        style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        View feedback
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ChevronRight size={15} strokeWidth={1.75} color="#D7E0EA" />
                  </div>
                </div>
                {i < MARKS.length - 1 && <div style={{ borderTop: '1px solid #EEF2F7', marginLeft: 24, marginRight: 24 }} />}
              </div>
            ))}
          </div>

        </div>
      </div>

      {selected && <FeedbackModal row={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
