import { useNavigate } from 'react-router-dom'
import { getCourseImage } from '../data/courseImages'
import {
  FileText,
  BookOpen,
  Megaphone,
  ChevronRight,
  Plus,
  Clock,
  MessageSquare,
  Star,
} from 'lucide-react'
import StatusPill from '../components/StatusPill'
import MiniCalendar from '../components/MiniCalendar'
import DailyAgenda from '../components/DailyAgenda'
import type { DailyAgendaItem } from '../components/DailyAgenda'

// ─── Mock Data ────────────────────────────────────────────────────────────────

type DeadlineStatus = 'Not started' | 'In progress'

const deadlines = [
  {
    id: 1,
    title: 'Lab Report 2: Enzyme Kinetics',
    course: 'BIOL08019 – Molecular Biology',
    dueLabel: 'Due tomorrow, 14 May',
    time: '11:59 PM',
    remaining: '18h 45m',
    status: 'Not started' as DeadlineStatus,
    color: '#FFECEC',
    iconColor: '#EF4444',
    borderColor: '#EF4444',
    route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics',
  },
  {
    id: 2,
    title: 'Critical Analysis: Globalisation and Culture',
    course: 'SOCI08001 – Sociology',
    dueLabel: 'Due in 2 days, 16 May',
    time: '5:00 PM',
    remaining: '2d 5h',
    status: 'In progress' as DeadlineStatus,
    color: '#FFF3E6',
    iconColor: '#F97316',
    borderColor: '#F97316',
    route: '/courses/sociology/assignments/critical-analysis-globalisation-culture',
  },
  {
    id: 3,
    title: 'Presentation: Marketing Strategy',
    course: 'MGTS08018 – Marketing',
    dueLabel: 'Due 18 May',
    time: '3:00 PM',
    remaining: '4d left',
    status: 'Not started' as DeadlineStatus,
    color: '#F1F5F9',
    iconColor: '#48607A',
    borderColor: '#B4C0D0',
    route: '/courses/marketing/assignments/presentation-marketing-strategy',
  },
]

const updates = [
  {
    id: 1,
    icon: <FileText size={15} strokeWidth={1.75} />,
    courseCode: 'BIOL08019',
    content: 'New slides uploaded · Week 4 – Cell Signalling',
    time: '2h ago',
    unread: true,
    route: '/courses/molecular-biology',
  },
  {
    id: 2,
    icon: <MessageSquare size={15} strokeWidth={1.75} />,
    courseCode: 'SOCI08001',
    content: 'Room Change: Seminar on 15 May',
    time: '4h ago',
    unread: true,
    route: '/updates',
  },
  {
    id: 3,
    icon: <Megaphone size={15} strokeWidth={1.75} />,
    courseCode: 'INFR08020',
    content: 'Announcement slides published',
    time: 'Yesterday',
    unread: false,
    route: '/courses/design-informatics',
  },
  {
    id: 4,
    icon: <Star size={15} strokeWidth={1.75} />,
    courseCode: 'DSCI08012',
    content: 'Assignment feedback released',
    time: 'Yesterday',
    unread: false,
    route: '/courses/data-science',
  },
  {
    id: 5,
    icon: <BookOpen size={15} strokeWidth={1.75} />,
    courseCode: 'MGTS08018',
    content: 'Week 9 reading list updated',
    time: '2 days ago',
    unread: false,
    route: '/updates',
  },
]

const courses = [
  { id: 1, code: 'BIOL08019', name: 'Molecular Biology', progress: 72, accent: '#2563EB', route: '/courses/molecular-biology' },
  { id: 2, code: 'SOCI08001', name: 'Sociology',          progress: 58, accent: '#7C3AED', route: '/courses/sociology' },
  { id: 3, code: 'MGTS08018', name: 'Marketing',          progress: 45, accent: '#F97316', route: '/courses/marketing' },
  { id: 4, code: 'HIST08007', name: 'Global History',     progress: 61, accent: '#1F9D55', route: '/courses/global-history' },
]

// ─── Mini Calendar ────────────────────────────────────────────────────────────

const calendarWeeks = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
]
const today = 14

// Day → dot color: blue = class, red = deadline, orange = task
const dayDots: Record<number, string> = {
  7:  '#2563EB',
  9:  '#F97316',
  15: '#2563EB',
  16: '#EF4444',
  18: '#EF4444',
  21: '#2563EB',
  23: '#F97316',
}

// ─── Agenda ───────────────────────────────────────────────────────────────────

const agendaItems: DailyAgendaItem[] = [
  { id: 1, time: '09:00', endTime: '10:00', title: 'Molecular Biology Lecture', subtitle: 'David Hume Tower 2.12', category: 'Class' },
  { id: 2, time: '11:00', endTime: '12:00', title: 'Sociology Seminar', subtitle: 'Chrystal MacMillan G.06', category: 'Seminar' },
  { id: 3, time: '13:00', title: 'Review notes', subtitle: 'BIOL08019', category: 'Task' },
  { id: 4, time: '14:00', title: 'Prepare slides for presentation', subtitle: 'MKTG08012', category: 'Task' },
  { id: 5, time: '23:59', title: 'Lab Report 3', subtitle: 'BIOL08019', category: 'Deadline' },
]

const upcoming = [
  {
    title: 'Lab Report 2: Enzyme Kinetics',
    sub: 'Due tomorrow 14 May, 11:59 PM',
    course: 'BIOL08019',
    pill: <StatusPill label="Not started" variant="orange" />,
    route: '/courses/biol08019/assignment',
  },
  {
    title: 'Seminar Culture and Identity',
    sub: '16 May, 11:00 AM',
    course: 'SOCI08024',
    pill: <StatusPill label="Class" variant="blue" />,
    route: '/courses/biol08019',
  },
]

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white border border-[#E6ECF3] rounded-2xl ${className}`}
      style={{ boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}
    >
      {children}
    </div>
  )
}

function CardHeader({
  title,
  action,
  badge,
  onAction,
}: {
  title: string
  action?: string
  badge?: React.ReactNode
  onAction?: () => void
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-[14px]">
      <div className="flex items-center gap-2">
        <h2 className="text-[17px] font-bold text-[#0A254F] leading-[26px]">{title}</h2>
        {badge}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-[13px] font-semibold text-[#2563EB] hover:underline transition-all cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  )
}

function Divider() {
  return <div className="border-t border-[#EEF2F7]" />
}

// ─── UoE crest watermark ─────────────────────────────────────────────────────

function UoECrestWatermark() {
  return (
    <img
      src="/edinburgh-logo.jpg"
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 36,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 190,
        height: 190,
        filter: 'invert(1)',
        mixBlendMode: 'screen',
        opacity: 0.2,
        pointerEvents: 'none',
        userSelect: 'none',
        draggable: false,
      } as React.CSSProperties}
    />
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Center: only this scrolls ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
      <div className="px-7 py-6 flex flex-col gap-5">

        {/* Hero Banner */}
        <div
          className="relative overflow-hidden text-white flex-shrink-0"
          style={{
            background: '#1B3FA0',
            borderRadius: 18,
            minHeight: 174,
            padding: '32px 40px',
          }}
        >
          <UoECrestWatermark />

          <p
            className="text-[12px] font-medium opacity-60 mb-2"
            style={{ letterSpacing: '0.07em', textTransform: 'uppercase' }}
          >
            Wednesday, 14 May 2025
          </p>
          <h1
            className="font-semibold leading-[1.2] mb-3"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 34,
            }}
          >
            Good morning, Xinyi 👋
          </h1>
          <p className="text-[14px] leading-[22px] opacity-75 max-w-md">
            You have{' '}
            <span className="font-semibold opacity-100">2 deadlines</span> this week,{' '}
            <span className="font-semibold opacity-100">1 new announcement</span>, and{' '}
            <span className="font-semibold opacity-100">3 tasks</span> today.
          </p>
        </div>

        {/* ── Urgent Deadlines ── */}
        <Card>
          <CardHeader title="Urgent Deadlines" action="View all" onAction={() => navigate('/deadlines')} />
          <Divider />
          {deadlines.map((d, i) => (
            <div key={d.id}>
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#F9FBFF] transition-colors"
                onClick={() => navigate(d.route)}
              >
                {/* Colored icon block */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-xl"
                  style={{ width: 38, height: 38, background: d.color }}
                >
                  <FileText size={17} strokeWidth={1.75} style={{ color: d.iconColor }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#0A254F] leading-snug mb-0.5 truncate">
                    {d.title}
                  </div>
                  <div className="text-[12px] text-[#48607A]">{d.course}</div>
                </div>

                {/* Due info */}
                <div className="shrink-0 text-right mr-4">
                  <div
                    className="text-[12px] font-medium mb-0.5"
                    style={{ color: d.iconColor }}
                  >
                    {d.dueLabel}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px] text-[#7B8DA5]">
                    <Clock size={11} strokeWidth={1.75} />
                    <span>{d.remaining}</span>
                    <span className="mx-1 opacity-50">·</span>
                    <span>{d.time}</span>
                  </div>
                </div>

                {/* Status pill + chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <StatusPill
                    label={d.status}
                    variant={d.status === 'Not started' ? 'red' : 'orange'}
                  />
                  <ChevronRight size={15} strokeWidth={1.75} className="text-[#D7E0EA]" />
                </div>
              </div>
              {i < deadlines.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        {/* ── Course Updates ── */}
        <Card>
          <CardHeader title="Course Updates" action="View all" onAction={() => navigate('/updates')} />
          <Divider />
          {updates.map((u, i) => (
            <div key={u.id}>
              <div
                className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#F9FBFF] transition-colors"
                onClick={() => navigate(u.route)}
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
                    width: 30,
                    height: 30,
                    background: u.unread ? '#EAF2FF' : '#F1F5F9',
                    color: u.unread ? '#2563EB' : '#7B8DA5',
                  }}
                >
                  {u.icon}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: u.unread ? '#0A254F' : '#48607A' }}
                  >
                    {u.courseCode}
                  </span>
                  <span className="text-[13px] text-[#48607A]"> · {u.content}</span>
                </div>
                <span className="text-[12px] text-[#B4C0D0] shrink-0 ml-2">{u.time}</span>
                <ChevronRight size={13} strokeWidth={1.75} className="text-[#D7E0EA] shrink-0" />
              </div>
              {i < updates.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        {/* ── My Courses ── */}
        <Card>
          <CardHeader title="My Courses" action="All courses" onAction={() => navigate('/courses')} />
          <Divider />
          <div className="px-5 py-4 grid grid-cols-4 gap-3">
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(c.route)}
                className="rounded-[14px] border border-[#E6ECF3] cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: '#FFFFFF', overflow: 'hidden' }}
              >
                {/* Thumbnail */}
                <div className="overflow-hidden" style={{ height: 88 }}>
                  <img
                    src={getCourseImage(c.code)}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {/* Card body */}
                <div className="px-3 py-3">
                  <div className="text-[11px] text-[#7B8DA5] mb-0.5 font-medium">{c.code}</div>
                  <div className="text-[13px] font-semibold text-[#0A254F] mb-2.5 leading-snug">{c.name}</div>
                  <div className="w-full h-[5px] rounded-full bg-[#F1F5F9] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.progress}%`, background: c.accent }}
                    />
                  </div>
                  <div className="text-[11px] font-medium" style={{ color: c.accent }}>
                    {c.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </div>

      {/* ── Right Sidebar: fixed, never scrolls ── */}
      <aside
        className="flex-shrink-0 border-l border-[#E6ECF3] bg-[#F7F9FC] flex flex-col gap-4 overflow-y-auto"
        style={{ width: 310, padding: '24px 16px' }}
      >

        {/* Mini Calendar */}
        <MiniCalendar
          monthLabel="May 2025"
          weeks={calendarWeeks}
          selectedDate={today}
          eventDots={dayDots}
        />

        {/* Daily Agenda */}
        <DailyAgenda
          dateLabel="14 May Agenda"
          showTodayBadge
          items={agendaItems}
          onItemClick={(item) => {
            if (item.category === 'Deadline') navigate('/courses/biol08019/assignment')
            else if (item.category === 'Class' || item.category === 'Seminar') navigate('/courses/biol08019')
          }}
          bottomAction={
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 7, fontSize: 13, fontWeight: 600, color: '#7B8DA5',
                background: 'none', border: '1.5px dashed #D7E0EA', borderRadius: 10,
                padding: '8px 0', cursor: 'pointer',
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Add new to-do
            </button>
          }
        />

        {/* Upcoming */}
        <Card>
          <CardHeader title="Upcoming" />
          <Divider />
          <div className="px-5 py-1">
            {upcoming.map((u, i) => (
              <div key={i}>
                <div
                  className="py-3 cursor-pointer hover:bg-[#F9FBFF] -mx-5 px-5 rounded-xl transition-colors"
                  onClick={() => navigate(u.route)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-[13px] font-semibold text-[#0A254F] leading-snug flex-1">
                      {u.title}
                    </div>
                    {u.pill}
                  </div>
                  <div className="text-[12px] text-[#7B8DA5]">
                    {u.course} · {u.sub}
                  </div>
                </div>
                {i < upcoming.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  )
}
