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
  },
  {
    id: 2,
    title: 'Critical Analysis: Globalisation and Culture',
    course: 'SOCI08024 – Urban Sociology',
    dueLabel: 'Due in 2 days, 16 May',
    time: '5:00 PM',
    remaining: '2d 5h',
    status: 'In progress' as DeadlineStatus,
    color: '#FFF3E6',
    iconColor: '#F97316',
    borderColor: '#F97316',
  },
  {
    id: 3,
    title: 'Presentation: Marketing Strategy',
    course: 'MKTG08012 – Marketing',
    dueLabel: 'Due 18 May',
    time: '3:00 PM',
    remaining: '4d left',
    status: 'Not started' as DeadlineStatus,
    color: '#F1F5F9',
    iconColor: '#48607A',
    borderColor: '#B4C0D0',
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
  },
  {
    id: 2,
    icon: <MessageSquare size={15} strokeWidth={1.75} />,
    courseCode: 'SOCI08024',
    content: 'Room Change: Seminar on 15 May',
    time: '4h ago',
    unread: true,
  },
  {
    id: 3,
    icon: <Megaphone size={15} strokeWidth={1.75} />,
    courseCode: 'DESI08009',
    content: 'Announcement slides published',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 4,
    icon: <Star size={15} strokeWidth={1.75} />,
    courseCode: 'DATA08006',
    content: 'Assignment feedback released',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    icon: <BookOpen size={15} strokeWidth={1.75} />,
    courseCode: 'MKTG08012',
    content: 'Week 9 reading list updated',
    time: '2 days ago',
    unread: false,
  },
]

type CourseThumbnailStyle = {
  from: string
  to: string
  patternColor: string
}

const courses = [
  {
    id: 1,
    code: 'BIOL08019',
    name: 'Molecular Biology',
    progress: 72,
    accent: '#2563EB',
    thumb: { from: '#1D4ED8', to: '#0EA5E9', patternColor: 'rgba(255,255,255,0.08)' } as CourseThumbnailStyle,
  },
  {
    id: 2,
    code: 'SOCI08024',
    name: 'Sociology',
    progress: 58,
    accent: '#7C3AED',
    thumb: { from: '#6D28D9', to: '#8B5CF6', patternColor: 'rgba(255,255,255,0.08)' } as CourseThumbnailStyle,
  },
  {
    id: 3,
    code: 'MKTG08012',
    name: 'Marketing',
    progress: 45,
    accent: '#F97316',
    thumb: { from: '#EA580C', to: '#F59E0B', patternColor: 'rgba(255,255,255,0.08)' } as CourseThumbnailStyle,
  },
  {
    id: 4,
    code: 'HIST08031',
    name: 'Global History',
    progress: 61,
    accent: '#1F9D55',
    thumb: { from: '#166534', to: '#16A34A', patternColor: 'rgba(255,255,255,0.08)' } as CourseThumbnailStyle,
  },
]

// ─── Mini Calendar ────────────────────────────────────────────────────────────

const calendarDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
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

type AgendaCat = 'Class' | 'Task' | 'Personal' | 'Deadline' | 'Seminar'

type AgendaItem = {
  id: number
  time: string
  endTime?: string
  title: string
  subtitle: string
  category: AgendaCat
}

const agendaItems: AgendaItem[] = [
  { id: 1, time: '09:00', endTime: '10:00', title: 'Molecular Biology Lecture', subtitle: 'David Hume Tower 2.12', category: 'Class' },
  { id: 2, time: '11:00', endTime: '12:00', title: 'Sociology Seminar', subtitle: 'Chrystal MacMillan G.06', category: 'Seminar' },
  { id: 3, time: '13:00', title: 'Review notes', subtitle: 'BIOL08019', category: 'Task' },
  { id: 4, time: '14:00', title: 'Prepare slides for presentation', subtitle: 'MKTG08012', category: 'Task' },
  { id: 5, time: '23:59', title: 'Lab Report 3', subtitle: 'BIOL08019', category: 'Deadline' },
]

const catPill: Record<AgendaCat, React.ReactNode> = {
  Class:    <StatusPill label="Class" variant="blue" />,
  Task:     <StatusPill label="Task" variant="orange" />,
  Personal: <StatusPill label="Personal" variant="green" />,
  Deadline: <StatusPill label="Deadline" variant="red" />,
  Seminar:  <StatusPill label="Seminar" variant="purple" />,
}

const upcoming = [
  {
    title: 'Lab Report 2: Enzyme Kinetics',
    sub: 'Due tomorrow 14 May, 11:59 PM',
    course: 'BIOL08019',
    pill: <StatusPill label="Not started" variant="orange" />,
  },
  {
    title: 'Seminar Culture and Identity',
    sub: '16 May, 11:00 AM',
    course: 'SOCI08024',
    pill: <StatusPill label="Class" variant="blue" />,
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
}: {
  title: string
  action?: string
  badge?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-[14px]">
      <div className="flex items-center gap-2">
        <h2 className="text-[17px] font-bold text-[#0A254F] leading-[26px]">{title}</h2>
        {badge}
      </div>
      {action && (
        <button className="text-[13px] font-semibold text-[#2563EB] hover:underline transition-all">
          {action}
        </button>
      )}
    </div>
  )
}

function Divider() {
  return <div className="border-t border-[#EEF2F7]" />
}

// ─── Edinburgh skyline SVG ────────────────────────────────────────────────────

function EdinburghSkyline() {
  return (
    <svg
      className="absolute right-0 bottom-0 opacity-[0.13] pointer-events-none"
      width="320"
      height="180"
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Castle rock base */}
      <path d="M60 180 L60 110 Q80 90 100 95 L130 80 L130 180Z" fill="white" />
      {/* Castle towers */}
      <rect x="65" y="75" width="18" height="36" fill="white" />
      <rect x="63" y="70" width="22" height="8" fill="white" />
      {/* Battlements left tower */}
      <rect x="63" y="64" width="4" height="7" fill="white" />
      <rect x="69" y="64" width="4" height="7" fill="white" />
      <rect x="75" y="64" width="4" height="7" fill="white" />
      <rect x="81" y="64" width="4" height="7" fill="white" />

      {/* Main castle body */}
      <rect x="90" y="60" width="35" height="55" fill="white" />
      <rect x="88" y="52" width="39" height="10" fill="white" />
      {/* Battlements main */}
      <rect x="88" y="44" width="6" height="9" fill="white" />
      <rect x="96" y="44" width="6" height="9" fill="white" />
      <rect x="104" y="44" width="6" height="9" fill="white" />
      <rect x="112" y="44" width="6" height="9" fill="white" />
      <rect x="120" y="44" width="6" height="9" fill="white" />

      {/* Castle flag */}
      <line x1="115" y1="44" x2="115" y2="28" stroke="white" strokeWidth="1.5" />
      <polygon points="115,28 124,33 115,38" fill="white" />

      {/* Middle tower */}
      <rect x="135" y="80" width="22" height="100" fill="white" />
      <path d="M135 80 L146 62 L157 80Z" fill="white" />

      {/* St Giles Cathedral dome/crown */}
      <rect x="165" y="90" width="40" height="90" fill="white" />
      {/* Crown steeple */}
      <rect x="181" y="62" width="8" height="30" fill="white" />
      <path d="M175 72 L185 55 L195 72Z" fill="white" />
      {/* Flying buttresses */}
      <line x1="172" y1="78" x2="165" y2="90" stroke="white" strokeWidth="2" />
      <line x1="198" y1="78" x2="205" y2="90" stroke="white" strokeWidth="2" />
      {/* Crown points */}
      <rect x="176" y="60" width="5" height="14" fill="white" />
      <rect x="183" y="56" width="5" height="18" fill="white" />
      <rect x="190" y="60" width="5" height="14" fill="white" />

      {/* Tenement buildings right */}
      <rect x="215" y="100" width="28" height="80" fill="white" />
      <rect x="248" y="112" width="24" height="68" fill="white" />
      <rect x="277" y="95" width="30" height="85" fill="white" />
      <rect x="310" y="108" width="20" height="72" fill="white" />

      {/* Windows tenements */}
      <rect x="220" y="108" width="5" height="6" fill="#072452" />
      <rect x="229" y="108" width="5" height="6" fill="#072452" />
      <rect x="220" y="120" width="5" height="6" fill="#072452" />
      <rect x="229" y="120" width="5" height="6" fill="#072452" />

      {/* Foreground hill */}
      <path d="M0 180 Q30 160 60 165 Q90 170 120 160 L130 180Z" fill="white" />
      <path d="M200 180 Q240 170 280 175 Q300 177 320 172 L320 180Z" fill="white" />

      {/* Smoke/clouds */}
      <ellipse cx="80" cy="50" rx="18" ry="8" fill="white" />
      <ellipse cx="155" cy="38" rx="14" ry="6" fill="white" />
      <ellipse cx="250" cy="55" rx="20" ry="7" fill="white" />
    </svg>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="flex items-start">

      {/* ── Main column ── */}
      <div className="flex-1 px-7 py-6 min-w-0 flex flex-col gap-5">

        {/* Hero Banner */}
        <div
          className="relative overflow-hidden text-white flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #072452 0%, #0C3068 60%, #0B2F66 100%)',
            borderRadius: 18,
            minHeight: 174,
            padding: '32px 40px',
          }}
        >
          <EdinburghSkyline />

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
          <CardHeader title="Urgent Deadlines" action="View all" />
          <Divider />
          {deadlines.map((d, i) => (
            <div key={d.id}>
              <div className="flex items-center gap-4 px-6 py-4">
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
          <CardHeader title="Course Updates" action="View all" />
          <Divider />
          {updates.map((u, i) => (
            <div key={u.id}>
              <div className="flex items-center gap-3 px-6 py-3">
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
              </div>
              {i < updates.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        {/* ── My Courses ── */}
        <Card>
          <CardHeader title="My Courses" action="All courses" />
          <Divider />
          <div className="px-5 py-4 grid grid-cols-4 gap-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="rounded-[14px] border border-[#E6ECF3] cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: '#FFFFFF', overflow: 'hidden' }}
              >
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: 88,
                    background: `linear-gradient(135deg, ${c.thumb.from}, ${c.thumb.to})`,
                  }}
                >
                  {/* Subtle grid pattern overlay */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id={`grid-${c.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${c.id})`} />
                  </svg>
                  {/* Course initials */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-white font-bold opacity-30"
                      style={{ fontSize: 28, letterSpacing: '-0.02em' }}
                    >
                      {c.name.split(' ').map((w) => w[0]).join('')}
                    </span>
                  </div>
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

      {/* ── Right Sidebar ── */}
      <aside
        className="shrink-0 border-l border-[#E6ECF3] bg-[#F7F9FC] flex flex-col gap-4 sticky top-[72px] self-start"
        style={{ width: 310, padding: '24px 16px' }}
      >

        {/* Mini Calendar */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] font-bold text-[#0A254F]">May 2025</span>
            <div className="flex items-center gap-0.5">
              <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#7B8DA5] transition-colors text-base leading-none">
                ‹
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#7B8DA5] transition-colors text-base leading-none">
                ›
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {calendarDays.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-[#B4C0D0] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarWeeks.flat().map((day, idx) => {
              const isToday = day === today
              const dotColor = dayDots[day ?? -1]
              return (
                <div key={idx} className="flex flex-col items-center py-0.5">
                  {day ? (
                    <>
                      <button
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-medium transition-colors ${
                          isToday
                            ? 'bg-[#072452] text-white font-semibold'
                            : 'text-[#0A254F] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {day}
                      </button>
                      {dotColor && !isToday && (
                        <span
                          className="w-[5px] h-[5px] rounded-full mt-0.5"
                          style={{ background: dotColor }}
                        />
                      )}
                      {!dotColor && <span className="w-[5px] h-[5px] mt-0.5" />}
                    </>
                  ) : (
                    <span className="w-7 h-7" />
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Daily Agenda */}
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-[14px]">
            <h2 className="text-[17px] font-bold text-[#0A254F]">14 May Agenda</h2>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#072452', color: 'white', letterSpacing: '0.04em' }}
            >
              Today
            </span>
          </div>
          <Divider />

          <div className="px-5 py-1">
            {agendaItems.map((item, i) => (
              <div key={item.id}>
                <div className="flex items-start gap-3 py-3">
                  {/* Time */}
                  <div className="shrink-0 pt-0.5" style={{ minWidth: 44 }}>
                    <div className="text-[12px] font-semibold text-[#0A254F]">{item.time}</div>
                    {item.endTime && (
                      <div className="text-[11px] text-[#B4C0D0]">{item.endTime}</div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0A254F] leading-snug mb-0.5 truncate">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-[#7B8DA5] truncate">{item.subtitle}</div>
                  </div>
                  {/* Pill */}
                  <div className="shrink-0 pt-0.5">{catPill[item.category]}</div>
                </div>
                {i < agendaItems.length - 1 && <Divider />}
              </div>
            ))}
          </div>

          {/* Add to-do button */}
          <div className="px-5 pb-4 pt-2">
            <button
              className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-[#7B8DA5] hover:text-[#0A254F] hover:border-[#B4C0D0] transition-all rounded-[10px] py-2"
              style={{ border: '1.5px dashed #D7E0EA' }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Add new to-do
            </button>
          </div>
        </Card>

        {/* Upcoming */}
        <Card>
          <CardHeader title="Upcoming" />
          <Divider />
          <div className="px-5 py-1">
            {upcoming.map((u, i) => (
              <div key={i}>
                <div className="py-3">
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
