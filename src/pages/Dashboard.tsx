import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourseImage } from '../data/courseImages'
import {
  FileText, BookOpen, Megaphone, ChevronRight,
  Plus, Clock, MessageSquare, Star, X,
} from 'lucide-react'
import StatusPill from '../components/StatusPill'
import MiniCalendar from '../components/MiniCalendar'
import DailyAgenda from '../components/DailyAgenda'
import Toast from '../components/Toast'
import type { DailyAgendaItem } from '../components/DailyAgenda'

// ─── Types ────────────────────────────────────────────────────────────────────

type DeadlineStatus = 'Not started' | 'In progress'
type TodoType = 'Task' | 'Personal' | 'Meeting' | 'Deadline'

// ─── Static data ──────────────────────────────────────────────────────────────

const deadlines = [
  { id: 1, title: 'Lab Report 2: Enzyme Kinetics', course: 'BIOL08019 – Molecular Biology', dueLabel: 'Due tomorrow, 14 May', time: '11:59 PM', remaining: '18h 45m', status: 'Not started' as DeadlineStatus, color: '#FFECEC', iconColor: '#EF4444', route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
  { id: 2, title: 'Critical Analysis: Globalisation and Culture', course: 'SOCI08001 – Sociology', dueLabel: 'Due in 2 days, 16 May', time: '5:00 PM', remaining: '2d 5h', status: 'In progress' as DeadlineStatus, color: '#FFF3E6', iconColor: '#F97316', route: '/courses/sociology/assignments/critical-analysis-globalisation-culture' },
  { id: 3, title: 'Presentation: Marketing Strategy', course: 'MGTS08018 – Marketing', dueLabel: 'Due 18 May', time: '3:00 PM', remaining: '4d left', status: 'Not started' as DeadlineStatus, color: '#F1F5F9', iconColor: '#48607A', route: '/courses/marketing/assignments/presentation-marketing-strategy' },
]

const updates = [
  { id: 1, icon: <FileText size={15} strokeWidth={1.75} />, courseCode: 'BIOL08019', content: 'New slides uploaded · Week 4 – Cell Signalling', time: '2h ago', unread: true, route: '/courses/molecular-biology' },
  { id: 2, icon: <MessageSquare size={15} strokeWidth={1.75} />, courseCode: 'SOCI08001', content: 'Room Change: Seminar on 15 May', time: '4h ago', unread: true, route: '/updates' },
  { id: 3, icon: <Megaphone size={15} strokeWidth={1.75} />, courseCode: 'INFR08020', content: 'Announcement slides published', time: 'Yesterday', unread: false, route: '/courses/design-informatics' },
  { id: 4, icon: <Star size={15} strokeWidth={1.75} />, courseCode: 'DSCI08012', content: 'Assignment feedback released', time: 'Yesterday', unread: false, route: '/courses/data-science' },
  { id: 5, icon: <BookOpen size={15} strokeWidth={1.75} />, courseCode: 'MGTS08018', content: 'Week 9 reading list updated', time: '2 days ago', unread: false, route: '/updates' },
]

const courses = [
  { id: 1, code: 'BIOL08019', name: 'Molecular Biology', progress: 72, accent: '#2563EB', route: '/courses/molecular-biology' },
  { id: 2, code: 'SOCI08001', name: 'Sociology',          progress: 58, accent: '#7C3AED', route: '/courses/sociology' },
  { id: 3, code: 'MGTS08018', name: 'Marketing',          progress: 45, accent: '#F97316', route: '/courses/marketing' },
  { id: 4, code: 'HIST08007', name: 'Global History',     progress: 61, accent: '#1F9D55', route: '/courses/global-history' },
]

const upcoming = [
  { title: 'Lab Report 2: Enzyme Kinetics', sub: 'Due tomorrow 14 May, 11:59 PM', course: 'BIOL08019', pill: <StatusPill label="Not started" variant="red" />, route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
  { title: 'Seminar: Culture and Identity', sub: '16 May, 11:00 AM', course: 'SOCI08001', pill: <StatusPill label="Seminar" variant="purple" />, route: '/courses/sociology' },
]

// ─── Calendar data ────────────────────────────────────────────────────────────

const calendarWeeks = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
]

const BASE_DOTS: Record<number, string> = {
  7: '#2563EB', 9: '#F97316', 14: '#EF4444',
  15: '#2563EB', 16: '#EF4444', 18: '#EF4444', 21: '#2563EB', 23: '#F97316',
}

// ─── Agenda per date ──────────────────────────────────────────────────────────

const BASE_AGENDA: Record<number, DailyAgendaItem[]> = {
  14: [
    { id: 'd14-1', time: '09:00', endTime: '10:00', title: 'Molecular Biology Lecture', subtitle: 'David Hume Tower 2.12', category: 'Class', route: '/courses/molecular-biology' },
    { id: 'd14-2', time: '11:00', endTime: '12:00', title: 'Sociology Seminar', subtitle: 'Chrystal MacMillan G.06', category: 'Seminar', route: '/courses/sociology' },
    { id: 'd14-3', time: '13:00', title: 'Review notes', subtitle: 'BIOL08019', category: 'Task' },
    { id: 'd14-4', time: '14:00', title: 'Prepare slides for presentation', subtitle: 'MKTG08012', category: 'Task' },
    { id: 'd14-5', time: '23:59', title: 'Lab Report 2 Deadline', subtitle: 'BIOL08019', category: 'Deadline', route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
  ],
  15: [
    { id: 'd15-1', time: '09:00', endTime: '10:00', title: 'Molecular Biology Lecture', subtitle: 'David Hume Tower 2.12', category: 'Class', route: '/courses/molecular-biology' },
    { id: 'd15-2', time: '14:00', title: 'Lab Report Deadline', subtitle: 'LEARN Assignment', category: 'Deadline', route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
    { id: 'd15-3', time: '15:00', endTime: '16:00', title: 'Sociology Seminar', subtitle: 'Appleton Tower 1.05', category: 'Seminar', route: '/courses/sociology' },
  ],
  16: [
    { id: 'd16-1', time: '10:00', endTime: '12:00', title: 'Project Workshop', subtitle: 'George Square G.03', category: 'Workshop' },
    { id: 'd16-2', time: '16:00', title: 'Critical Analysis Deadline', subtitle: 'SOCI08001', category: 'Deadline', route: '/courses/sociology/assignments/critical-analysis-globalisation-culture' },
  ],
  21: [
    { id: 'd21-1', time: '10:00', endTime: '11:00', title: 'Molecular Biology Lecture', subtitle: 'David Hume Tower 2.12', category: 'Class', route: '/courses/molecular-biology' },
  ],
  23: [
    { id: 'd23-1', time: '13:00', title: 'Marketing Group Meeting', subtitle: 'Online', category: 'Meeting' },
  ],
}

// ─── Item detail modal ────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  Class:    { bg: '#EAF2FF', text: '#2563EB', border: '#93C5FD' },
  Seminar:  { bg: '#F3E8FF', text: '#7C3AED', border: '#C4B5FD' },
  Task:     { bg: '#FFF3E6', text: '#F97316', border: '#FDBA74' },
  Personal: { bg: '#EAF8F0', text: '#1F9D55', border: '#86EFAC' },
  Deadline: { bg: '#FFECEC', text: '#EF4444', border: '#FDA4AF' },
  Meeting:  { bg: '#FFF3E6', text: '#F97316', border: '#FDBA74' },
  Workshop: { bg: '#F3E8FF', text: '#7C3AED', border: '#C4B5FD' },
}

function ItemDetailModal({ item, onClose }: { item: DailyAgendaItem; onClose: () => void }) {
  const c = CAT_COLOR[item.category] ?? CAT_COLOR.Task
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 360, padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: c.text, background: c.bg, borderRadius: 999, padding: '3px 10px', border: `1px solid ${c.border}` }}>{item.category}</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5' }}>
            <X size={14} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0A254F', marginBottom: 10 }}>{item.title}</div>
        <div style={{ fontSize: 13, color: '#7B8DA5', marginBottom: 4 }}>
          <Clock size={12} strokeWidth={1.75} style={{ display: 'inline', marginRight: 5 }} />
          {item.time}{item.endTime ? ` – ${item.endTime}` : ''}
        </div>
        {item.subtitle && <div style={{ fontSize: 13, color: '#7B8DA5', marginBottom: 20 }}>{item.subtitle}</div>}
        <button onClick={onClose} style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  )
}

// ─── Add To-do modal ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', height: 38, borderRadius: 10, border: '1px solid #E6ECF3',
  background: '#F9FBFF', padding: '0 12px', fontSize: 13, color: '#0A254F',
  outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#48607A', marginBottom: 5 }

interface AddTodoModalProps { selectedDate: number; onClose: () => void; onAdd: (item: DailyAgendaItem, date: number) => void }

function AddTodoModal({ selectedDate, onClose, onAdd }: AddTodoModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(`2025-05-${String(selectedDate).padStart(2, '0')}`)
  const [time, setTime] = useState('10:00')
  const [type, setType] = useState<TodoType>('Task')
  const [source, setSource] = useState('')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')

  function handleAdd() {
    if (!title.trim()) { setErr('Title is required'); return }
    const dateNum = parseInt(date.split('-')[2] || '0')
    const item: DailyAgendaItem = {
      id: `todo-${Date.now()}`,
      time,
      title: title.trim(),
      subtitle: source.trim() || note.trim() || '',
      category: type,
    }
    onAdd(item, dateNum)
    onClose()
  }

  const types: TodoType[] = ['Task', 'Personal', 'Meeting', 'Deadline']

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,63,160,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.10)', width: '100%', maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 14px', borderBottom: '1px solid #EEF2F7' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>Add to agenda</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5' }}>
            <X size={14} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div>
            <label style={labelStyle}>Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input style={{ ...inputStyle, borderColor: err ? '#EF4444' : '#E6ECF3' }} placeholder="e.g. Review lecture notes" value={title} onChange={e => { setTitle(e.target.value); setErr('') }} />
            {err && <div style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{err}</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input type="time" style={inputStyle} value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {types.map(t => (
                <button key={t} onClick={() => setType(t)} style={{ flex: 1, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${type === t ? '#1B3FA0' : '#E6ECF3'}`, background: type === t ? '#EAF2FF' : '#F9FBFF', color: type === t ? '#1B3FA0' : '#48607A', cursor: 'pointer' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Course / source (optional)</label>
            <input style={inputStyle} placeholder="e.g. BIOL08019" value={source} onChange={e => setSource(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Note (optional)</label>
            <input style={inputStyle} placeholder="Any notes…" value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 22px 18px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ height: 38, padding: '0 18px', borderRadius: 10, border: '1px solid #D7E0EA', background: '#fff', color: '#0A254F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleAdd} style={{ height: 38, padding: '0 18px', borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Add to agenda</button>
        </div>
      </div>
    </div>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#E6ECF3] rounded-2xl ${className}`} style={{ boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}>
      {children}
    </div>
  )
}

function CardHeader({ title, action, badge, onAction }: { title: string; action?: string; badge?: React.ReactNode; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-[14px]">
      <div className="flex items-center gap-2">
        <h2 className="text-[17px] font-bold text-[#0A254F] leading-[26px]">{title}</h2>
        {badge}
      </div>
      {action && (
        <button onClick={onAction} className="text-[13px] font-semibold text-[#2563EB] hover:underline transition-all cursor-pointer">
          {action}
        </button>
      )}
    </div>
  )
}

function Divider() { return <div className="border-t border-[#EEF2F7]" /> }

function UoECrestWatermark() {
  return (
    <img src="/edinburgh-logo.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)', width: 190, height: 190, filter: 'invert(1)', mixBlendMode: 'screen', opacity: 0.2, pointerEvents: 'none', userSelect: 'none', draggable: false } as React.CSSProperties} />
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(14)
  const [extraItems, setExtraItems] = useState<Record<number, DailyAgendaItem[]>>({})
  const [extraDots, setExtraDots] = useState<Record<number, string>>({})
  const [addTodoOpen, setAddTodoOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<DailyAgendaItem | null>(null)
  const [toast, setToast] = useState(false)

  const dots = { ...BASE_DOTS, ...extraDots }

  const agendaForDate: DailyAgendaItem[] = [
    ...(BASE_AGENDA[selectedDate] ?? []),
    ...(extraItems[selectedDate] ?? []),
  ]

  const monthDayLabel = (d: number) => `${d} May 2026`

  function handleAddTodo(item: DailyAgendaItem, date: number) {
    setExtraItems(prev => ({ ...prev, [date]: [...(prev[date] ?? []), item] }))
    setExtraDots(prev => ({ ...prev, [date]: '#F97316' }))
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  function handleAgendaClick(item: DailyAgendaItem) {
    if (item.route) { navigate(item.route); return }
    setDetailItem(item)
  }

  return (
    <div className="flex h-full overflow-hidden">

      {/* Center: scrolls */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div style={{ padding: '28px 32px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Hero Banner */}
          <div className="relative overflow-hidden text-white flex-shrink-0" style={{ background: '#1B3FA0', borderRadius: 18, minHeight: 160, padding: '28px 36px' }}>
            <UoECrestWatermark />
            <p className="text-[12px] font-medium opacity-60 mb-2" style={{ letterSpacing: '0.07em', textTransform: 'uppercase' }}>Wednesday, 14 May 2025</p>
            <h1 className="font-semibold leading-[1.2] mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 30 }}>Good morning, Xinyi 👋</h1>
            <p className="text-[13px] leading-[22px] opacity-75 max-w-md">
              You have <span className="font-semibold opacity-100">2 deadlines</span> this week, <span className="font-semibold opacity-100">1 new announcement</span>, and <span className="font-semibold opacity-100">3 tasks</span> today.
            </p>
          </div>

          {/* Urgent Deadlines */}
          <Card>
            <CardHeader title="Urgent Deadlines" action="View all" onAction={() => navigate('/deadlines')} />
            <Divider />
            {deadlines.map((d, i) => (
              <div key={d.id}>
                <div className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#F9FBFF] transition-colors" onClick={() => navigate(d.route)}>
                  <div className="shrink-0 flex items-center justify-center rounded-xl" style={{ width: 38, height: 38, background: d.color }}>
                    <FileText size={17} strokeWidth={1.75} style={{ color: d.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#0A254F] leading-snug mb-0.5 truncate">{d.title}</div>
                    <div className="text-[12px] text-[#48607A]">{d.course}</div>
                  </div>
                  <div className="shrink-0 text-right mr-4">
                    <div className="text-[12px] font-medium mb-0.5" style={{ color: d.iconColor }}>{d.dueLabel}</div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-[#7B8DA5]">
                      <Clock size={11} strokeWidth={1.75} />
                      <span>{d.remaining}</span>
                      <span className="mx-1 opacity-50">·</span>
                      <span>{d.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusPill label={d.status} variant={d.status === 'Not started' ? 'red' : 'orange'} />
                    <ChevronRight size={15} strokeWidth={1.75} className="text-[#D7E0EA]" />
                  </div>
                </div>
                {i < deadlines.length - 1 && <Divider />}
              </div>
            ))}
          </Card>

          {/* Course Updates */}
          <Card>
            <CardHeader title="Course Updates" action="View all" onAction={() => navigate('/updates')} />
            <Divider />
            {updates.map((u, i) => (
              <div key={u.id}>
                <div className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#F9FBFF] transition-colors" onClick={() => navigate(u.route)}>
                  <div className="w-2 shrink-0 flex justify-center">
                    {u.unread ? <span className="w-2 h-2 rounded-full bg-[#2563EB] block" /> : <span className="w-2 h-2 block" />}
                  </div>
                  <div className="shrink-0 flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: u.unread ? '#EAF2FF' : '#F1F5F9', color: u.unread ? '#2563EB' : '#7B8DA5' }}>
                    {u.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-semibold" style={{ color: u.unread ? '#0A254F' : '#48607A' }}>{u.courseCode}</span>
                    <span className="text-[13px] text-[#48607A]"> · {u.content}</span>
                  </div>
                  <span className="text-[12px] text-[#B4C0D0] shrink-0 ml-2">{u.time}</span>
                  <ChevronRight size={13} strokeWidth={1.75} className="text-[#D7E0EA] shrink-0" />
                </div>
                {i < updates.length - 1 && <Divider />}
              </div>
            ))}
          </Card>

          {/* My Courses */}
          <Card>
            <CardHeader title="My Courses" action="All courses" onAction={() => navigate('/courses')} />
            <Divider />
            <div className="px-5 py-4 grid grid-cols-4 gap-3">
              {courses.map((c) => (
                <div key={c.id} onClick={() => navigate(c.route)} className="rounded-[14px] border border-[#E6ECF3] cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md" style={{ background: '#FFFFFF', overflow: 'hidden' }}>
                  <div className="overflow-hidden" style={{ height: 88 }}>
                    <img src={getCourseImage(c.code)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div className="px-3 py-3">
                    <div className="text-[11px] text-[#7B8DA5] mb-0.5 font-medium">{c.code}</div>
                    <div className="text-[13px] font-semibold text-[#0A254F] mb-2.5 leading-snug">{c.name}</div>
                    <div className="w-full h-[5px] rounded-full bg-[#F1F5F9] overflow-hidden mb-1">
                      <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: c.accent }} />
                    </div>
                    <div className="text-[11px] font-medium" style={{ color: c.accent }}>{c.progress}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="flex-shrink-0 border-l border-[#E6ECF3] bg-[#F7F9FC] flex flex-col gap-4" style={{ width: 320, padding: '24px 16px', overflowY: 'auto' }}>

        <MiniCalendar
          monthLabel="May 2026"
          weeks={calendarWeeks}
          selectedDate={selectedDate}
          eventDots={dots}
          onDateSelect={setSelectedDate}
        />

        <DailyAgenda
          dateLabel={`${monthDayLabel(selectedDate)} Agenda`}
          showTodayBadge={selectedDate === 14}
          items={agendaForDate}
          onItemClick={handleAgendaClick}
          bottomAction={
            <button
              onClick={() => setAddTodoOpen(true)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#7B8DA5', background: 'none', border: '1.5px dashed #D7E0EA', borderRadius: 10, padding: '8px 0', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.color = '#2563EB' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#D7E0EA'; e.currentTarget.style.color = '#7B8DA5' }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Add new to-do
            </button>
          }
        />

        {/* Upcoming */}
        <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)' }}>
          <div style={{ padding: '16px 20px 13px', fontSize: 15, fontWeight: 700, color: '#0A254F' }}>Upcoming</div>
          <div style={{ height: 1, background: '#EEF2F7' }} />
          <div style={{ padding: '4px 12px 8px' }}>
            {upcoming.map((u, i) => (
              <div key={i}>
                <div
                  onClick={() => navigate(u.route)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0F4FF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  style={{ padding: '10px 8px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.12s', borderBottom: i < upcoming.length - 1 ? '1px solid #EEF2F7' : 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F', lineHeight: '18px', flex: 1 }}>{u.title}</div>
                    {u.pill}
                  </div>
                  <div style={{ fontSize: 11, color: '#7B8DA5' }}>{u.course} · {u.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {addTodoOpen && (
        <AddTodoModal selectedDate={selectedDate} onClose={() => setAddTodoOpen(false)} onAdd={handleAddTodo} />
      )}
      {detailItem && (
        <ItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
      <Toast message="To-do added" visible={toast} />
    </div>
  )
}
