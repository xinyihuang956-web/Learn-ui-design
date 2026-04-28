import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Star,
  MoreHorizontal,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
} from 'lucide-react'
import StatusPill from '../components/StatusPill'

// ─── Types ────────────────────────────────────────────────────────────────────

type NextItem = {
  label: string
  time: string
  type: 'Class' | 'Deadline' | 'Seminar'
}

type Course = {
  id: number
  title: string
  code: string
  lecturer: string
  school: string
  description: string
  next: NextItem
  progress: number
  accent: string
  thumbFrom: string
  thumbTo: string
  favourited: boolean
  semester: 'current' | 'completed'
  detailPath?: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const allCourses: Course[] = [
  {
    id: 1,
    title: 'Molecular Biology',
    code: 'BIOL08019',
    lecturer: 'Dr. Sarah Collins',
    school: 'School of Biological Sciences',
    description: 'Molecular mechanisms of cell function, genetics, protein synthesis, and biological regulation.',
    next: { label: 'Next class: Today', time: '10:00 AM', type: 'Class' },
    progress: 72,
    accent: '#2563EB',
    thumbFrom: '#1D4ED8',
    thumbTo: '#0EA5E9',
    favourited: true,
    semester: 'current',
    detailPath: '/courses/biol08019',
  },
  {
    id: 2,
    title: 'Sociology',
    code: 'SOCI08001',
    lecturer: 'Dr. James Stewart',
    school: 'School of Social & Political Science',
    description: 'Critical introduction to sociological thinking, social structures, inequality, and culture.',
    next: { label: 'Next class: Today', time: '11:00 AM', type: 'Seminar' },
    progress: 58,
    accent: '#7C3AED',
    thumbFrom: '#5B21B6',
    thumbTo: '#8B5CF6',
    favourited: false,
    semester: 'current',
  },
  {
    id: 3,
    title: 'Marketing',
    code: 'MGTS08018',
    lecturer: 'Dr. Ana Martinez',
    school: 'Business School',
    description: 'Core marketing principles: market research, consumer behaviour, branding, and digital strategy.',
    next: { label: 'Next class: Today', time: '14:00 PM', type: 'Class' },
    progress: 45,
    accent: '#F97316',
    thumbFrom: '#C2410C',
    thumbTo: '#FB923C',
    favourited: false,
    semester: 'current',
  },
  {
    id: 4,
    title: 'Global History',
    code: 'HIST08007',
    lecturer: 'Prof. Christopher A. Whatley',
    school: 'School of History',
    description: 'World history from early modernity to present: global connections, empires, and modern crises.',
    next: { label: 'Next class: Fri, 16 May', time: '09:00 AM', type: 'Class' },
    progress: 61,
    accent: '#1F9D55',
    thumbFrom: '#15803D',
    thumbTo: '#4ADE80',
    favourited: true,
    semester: 'current',
  },
  {
    id: 5,
    title: 'Design Informatics',
    code: 'INFR08020',
    lecturer: 'Dr. Lucy Johnston',
    school: 'School of Informatics',
    description: 'Design thinking, human-computer interaction, and digital innovation for real-world applications.',
    next: { label: 'Deadline: 18 May', time: '11:59 PM', type: 'Deadline' },
    progress: 38,
    accent: '#DB2777',
    thumbFrom: '#7C3AED',
    thumbTo: '#C026D3',
    favourited: false,
    semester: 'current',
  },
  {
    id: 6,
    title: 'Data Science',
    code: 'DSCI08012',
    lecturer: 'Dr. Kenji Watanabe',
    school: 'School of Informatics',
    description: 'Statistical learning, data wrangling, visualisation and machine learning using Python.',
    next: { label: 'Next class: Thu, 15 May', time: '13:00 PM', type: 'Class' },
    progress: 54,
    accent: '#0891B2',
    thumbFrom: '#0369A1',
    thumbTo: '#38BDF8',
    favourited: false,
    semester: 'current',
  },
]

const todaySchedule = [
  { time: '10:00', title: 'Molecular Biology Lecture', location: 'Appleton Tower LT1' },
  { time: '11:00', title: 'Sociology Seminar',         location: 'David Hume Tower G.03' },
  { time: '14:00', title: 'Marketing Lecture',         location: 'Appleton Tower LT2' },
]

const courseUpdates = [
  { course: 'Molecular Biology',  action: 'Lecture slides uploaded',      time: '2h ago', unread: true,  icon: <FileText size={14} strokeWidth={1.75} /> },
  { course: 'Design Informatics', action: 'New forum post',               time: '5h ago', unread: true,  icon: <MessageSquare size={14} strokeWidth={1.75} /> },
  { course: 'Data Science',       action: 'Assignment feedback released', time: '1d ago', unread: false, icon: <BookOpen size={14} strokeWidth={1.75} /> },
]

const recentlyOpened = [
  { title: 'Molecular Biology', code: 'BIOL08019', when: 'Today, 09:15',     thumbFrom: '#1D4ED8', thumbTo: '#0EA5E9' },
  { title: 'Marketing',         code: 'MGTS08018', when: 'Yesterday, 16:40', thumbFrom: '#C2410C', thumbTo: '#FB923C' },
  { title: 'Global History',    code: 'HIST08007', when: 'Yesterday, 11:20', thumbFrom: '#15803D', thumbTo: '#4ADE80' },
]

const FILTERS = ['All', 'Current semester', 'Favourites', 'Completed'] as const
type Filter = typeof FILTERS[number]

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

function Divider() {
  return <div className="border-t border-[#EEF2F7]" />
}

// ─── Course thumbnail (contains the star button so it is always clipped inside) ──

function CourseThumbnail({ id, thumbFrom, thumbTo, title, fav, onToggleFav }: {
  id: number
  thumbFrom: string
  thumbTo: string
  title: string
  fav: boolean
  onToggleFav: () => void
}) {
  const initials = title.split(' ').map((w) => w[0]).join('')
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 128,
        background: `linear-gradient(135deg, ${thumbFrom}, ${thumbTo})`,
        borderRadius: '16px 16px 0 0',
      }}
    >
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.12 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`cp-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#cp-${id})`} />
      </svg>

      {/* Initials watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-white font-bold"
          style={{ fontSize: 40, letterSpacing: '-0.03em', opacity: 0.18 }}
        >
          {initials}
        </span>
      </div>

      {/* Star button — lives inside this div, clipped by overflow-hidden above */}
      <button
        onClick={onToggleFav}
        className="absolute top-3 right-3 flex items-center justify-center rounded-full transition-opacity hover:opacity-90"
        style={{
          width: 32,
          height: 32,
          background: 'rgba(255, 255, 255, 0.90)',
          border: '1px solid rgba(255, 255, 255, 0.60)',
        }}
        aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Star
          size={16}
          strokeWidth={1.75}
          className={fav ? 'text-amber-400 fill-amber-400' : 'text-[#7B8DA5]'}
        />
      </button>
    </div>
  )
}

// ─── Mini thumbnail (sidebar) ─────────────────────────────────────────────────

function MiniThumb({ id, thumbFrom, thumbTo, title }: {
  id: number; thumbFrom: string; thumbTo: string; title: string
}) {
  const initials = title.split(' ').map((w) => w[0]).join('')
  return (
    <div
      className="shrink-0 rounded-lg overflow-hidden relative flex items-center justify-center"
      style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${thumbFrom}, ${thumbTo})` }}
    >
      {/* pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.15 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`mt-${id}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#mt-${id})`} />
      </svg>
      <span className="relative z-10 text-white font-bold text-[11px]" style={{ opacity: 0.7 }}>
        {initials}
      </span>
    </div>
  )
}

// ─── Course card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const [fav, setFav] = useState(course.favourited)
  const navigate = useNavigate()

  const pillVariant =
    course.next.type === 'Class' ? 'blue' :
    course.next.type === 'Deadline' ? 'red' : 'purple'

  const NextIcon = course.next.type === 'Deadline' ? AlertCircle : Clock

  return (
    <Card className="flex flex-col">
      {/* Thumbnail — star is rendered INSIDE the thumbnail component */}
      <CourseThumbnail
        id={course.id}
        thumbFrom={course.thumbFrom}
        thumbTo={course.thumbTo}
        title={course.title}
        fav={fav}
        onToggleFav={() => setFav(!fav)}
      />

      {/* Body — starts cleanly below the image */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
        {/* Title + code */}
        <h3 className="text-[15px] font-bold text-[#0A254F] leading-snug">{course.title}</h3>
        <div className="text-[11px] font-medium text-[#7B8DA5] mt-0.5 mb-1.5">{course.code}</div>

        {/* Lecturer · school */}
        <div className="text-[11px] text-[#7B8DA5] mb-2 leading-snug">
          {course.lecturer}
          <span className="mx-1 text-[#D7E0EA]">·</span>
          <span>{course.school}</span>
        </div>

        {/* Description — 2 lines max */}
        <p
          className="text-[12px] text-[#48607A] leading-[18px] mb-3"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.description}
        </p>

        {/* Next class / deadline */}
        <div className="inline-flex items-center gap-1.5 mb-3 min-w-0">
          <NextIcon
            size={14}
            strokeWidth={1.75}
            className="shrink-0"
            style={{ color: course.next.type === 'Deadline' ? '#EF4444' : '#7B8DA5' }}
          />
          <span className="text-[11px] text-[#48607A] truncate">
            {course.next.label}
            <span className="text-[#7B8DA5]"> · {course.next.time}</span>
          </span>
          <span className="shrink-0">
            <StatusPill label={course.next.type} variant={pillVariant} />
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#7B8DA5] font-medium">Progress</span>
            <span className="text-[11px] font-semibold" style={{ color: course.accent }}>
              {course.progress}%
            </span>
          </div>
          <div className="w-full h-[4px] rounded-full bg-[#F1F5F9]">
            <div
              className="h-full rounded-full"
              style={{ width: `${course.progress}%`, background: course.accent }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            className="flex-1 text-white text-[13px] font-semibold rounded-[10px] transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ height: 40, background: '#072452' }}
            onClick={() => course.detailPath && navigate(course.detailPath)}
          >
            Open course
          </button>
          <button
            className="shrink-0 flex items-center justify-center rounded-[12px] border border-[#E6ECF3] text-[#48607A] hover:bg-[#F7F9FC] transition-colors"
            style={{ width: 40, height: 40 }}
            aria-label="More options"
          >
            <MoreHorizontal size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyCourses() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = allCourses.filter((c) => {
    const matchSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Current semester' && c.semester === 'current') ||
      (activeFilter === 'Favourites' && c.favourited) ||
      (activeFilter === 'Completed' && c.semester === 'completed')

    return matchSearch && matchFilter
  })

  return (
    // CSS grid: bounded main column + fixed sidebar — prevents all overflow issues
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 300px',
        alignItems: 'start',
      }}
    >
      {/* ── Main content ── */}
      <div className="px-8 py-7 min-w-0">

        {/* Page title */}
        <h1
          className="font-bold text-[#0A254F] mb-6"
          style={{ fontSize: 34, lineHeight: '42px', letterSpacing: '-0.02em' }}
        >
          My Courses
        </h1>

        {/* Controls row: search left, chips center, sort right */}
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          {/* Search */}
          <div className="relative shrink-0" style={{ width: 280 }}>
            <Search
              size={18}
              strokeWidth={1.75}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8DA5] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title or code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#E6ECF3] bg-white pl-11 pr-4 text-[13px] text-[#48607A] placeholder-[#7B8DA5] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const active = activeFilter === f
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="text-[12px] font-medium px-3 whitespace-nowrap rounded-[8px] transition-all duration-150"
                  style={{
                    height: 34,
                    background: active ? '#072452' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#48607A',
                    border: active ? '1px solid #072452' : '1px solid #E6ECF3',
                    boxShadow: active ? '0 2px 8px rgba(7,36,82,0.12)' : undefined,
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>

          {/* Sort — pushed to far right */}
          <button
            className="ml-auto shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-[#48607A] border border-[#E6ECF3] bg-white rounded-[10px] px-3 hover:border-[#D7E0EA] transition-colors"
            style={{ height: 34 }}
          >
            <span className="text-[#7B8DA5]">Sort by</span>
            <ChevronDown size={13} strokeWidth={1.75} className="text-[#7B8DA5]" />
          </button>
        </div>

        {/* Course count */}
        <p className="text-[12px] text-[#7B8DA5] font-medium mt-4 mb-5">
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
        </p>

        {/* Course grid — 3 columns, bounded by minmax(0,1fr) parent */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 20,
            }}
          >
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen size={32} strokeWidth={1.25} className="text-[#D7E0EA] mb-3" />
            <p className="text-[14px] font-semibold text-[#48607A]">No courses found</p>
            <p className="text-[12px] text-[#7B8DA5] mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* ── Right sidebar ── */}
      <aside
        className="border-l border-[#E6ECF3] bg-[#F7F9FC] sticky top-[72px] self-start flex flex-col gap-4"
        style={{ padding: '24px 16px' }}
      >
        {/* Today */}
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-3.5">
            <h2 className="text-[15px] font-bold text-[#0A254F]">Today</h2>
            <button className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] hover:underline">
              <Calendar size={12} strokeWidth={1.75} />
              View schedule
            </button>
          </div>
          <Divider />

          <div className="px-5 py-1">
            {todaySchedule.map((item, i) => (
              <div key={i}>
                <div className="flex items-start gap-3 py-2.5">
                  <div
                    className="shrink-0 flex items-center justify-center rounded-md text-[11px] font-semibold text-[#2563EB]"
                    style={{ width: 42, height: 24, background: '#EAF2FF' }}
                  >
                    {item.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#0A254F] leading-snug">{item.title}</div>
                    <div className="text-[11px] text-[#7B8DA5] mt-0.5">{item.location}</div>
                  </div>
                </div>
                {i < todaySchedule.length - 1 && <Divider />}
              </div>
            ))}
          </div>

          <div className="px-5 pb-4 pt-1">
            <button
              className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#48607A] hover:text-[#0A254F] transition-colors rounded-[10px] py-2"
              style={{ border: '1.5px dashed #D7E0EA' }}
            >
              Go to full schedule
              <ChevronRight size={12} strokeWidth={2} />
            </button>
          </div>
        </Card>

        {/* Course updates */}
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-3.5">
            <h2 className="text-[15px] font-bold text-[#0A254F]">Course updates</h2>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#EAF2FF', color: '#2563EB' }}
            >
              2 unread
            </span>
          </div>
          <Divider />

          <div className="px-5 py-1">
            {courseUpdates.map((u, i) => (
              <div key={i}>
                <div className="flex items-center gap-2.5 py-2.5">
                  <div className="w-1.5 shrink-0">
                    {u.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] block" />}
                  </div>
                  <div
                    className="shrink-0 flex items-center justify-center rounded-lg"
                    style={{
                      width: 28, height: 28,
                      background: u.unread ? '#EAF2FF' : '#F1F5F9',
                      color: u.unread ? '#2563EB' : '#7B8DA5',
                    }}
                  >
                    {u.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#0A254F] truncate">{u.course}</div>
                    <div className="text-[11px] text-[#7B8DA5] mt-0.5 truncate">{u.action}</div>
                  </div>
                  <span className="text-[10px] text-[#B4C0D0] shrink-0">{u.time}</span>
                </div>
                {i < courseUpdates.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </Card>

        {/* Recently opened */}
        <Card>
          <div className="px-5 pt-5 pb-3.5">
            <h2 className="text-[15px] font-bold text-[#0A254F]">Recently opened</h2>
          </div>
          <Divider />

          <div className="px-5 py-1">
            {recentlyOpened.map((r, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 py-2.5">
                  <MiniThumb
                    id={i + 100}
                    thumbFrom={r.thumbFrom}
                    thumbTo={r.thumbTo}
                    title={r.title}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#0A254F] truncate">{r.title}</div>
                    <div className="text-[11px] text-[#7B8DA5] mt-0.5">{r.code}</div>
                  </div>
                  <div className="text-[10px] text-[#B4C0D0] shrink-0 text-right leading-tight">
                    {r.when}
                  </div>
                </div>
                {i < recentlyOpened.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  )
}
