import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Building2,
  Hash,
  CalendarDays,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Megaphone,
  ExternalLink,
  BookMarked,
  GraduationCap,
  BadgeInfo,
  RefreshCw,
} from 'lucide-react'
import StatusPill from '../components/StatusPill'

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Weekly Materials', 'Assignments', 'Announcements', 'Reading List', 'Feedback'] as const
type Tab = typeof TABS[number]

type MaterialStatus = 'New' | 'Updated' | 'Available' | 'Coming soon' | null

type Material = {
  label: string
  icon: React.ReactNode
  status: MaterialStatus
}

type WeekRow = {
  week: string
  title: string
  dates: string
  materials: Material[]
}

const weeklyMaterials: WeekRow[] = [
  {
    week: 'Week 8',
    title: 'Cell Signalling',
    dates: '12 – 18 May',
    materials: [
      { label: 'Lecture Slides',    icon: <FileText size={14} strokeWidth={1.75} />,   status: 'New' },
      { label: 'Seminar Materials', icon: <ClipboardList size={14} strokeWidth={1.75} />, status: 'New' },
      { label: 'Recording',         icon: <Video size={14} strokeWidth={1.75} />,       status: 'Available' },
      { label: 'Reading',           icon: <BookOpen size={14} strokeWidth={1.75} />,    status: 'New' },
    ],
  },
  {
    week: 'Week 9',
    title: 'Gene Expression',
    dates: '19 – 25 May',
    materials: [
      { label: 'Lecture Slides',    icon: <FileText size={14} strokeWidth={1.75} />,   status: 'Updated' },
      { label: 'Seminar Materials', icon: <ClipboardList size={14} strokeWidth={1.75} />, status: 'New' },
      { label: 'Recording',         icon: <Video size={14} strokeWidth={1.75} />,       status: 'Available' },
      { label: 'Reading',           icon: <BookOpen size={14} strokeWidth={1.75} />,    status: 'New' },
    ],
  },
  {
    week: 'Week 10',
    title: 'DNA Replication',
    dates: '26 May – 1 Jun',
    materials: [
      { label: 'Lecture Slides',    icon: <FileText size={14} strokeWidth={1.75} />,   status: 'New' },
      { label: 'Seminar Materials', icon: <ClipboardList size={14} strokeWidth={1.75} />, status: 'New' },
      { label: 'Recording',         icon: <Video size={14} strokeWidth={1.75} />,       status: 'Coming soon' },
      { label: 'Reading',           icon: <BookOpen size={14} strokeWidth={1.75} />,    status: null },
    ],
  },
]

type Assignment = {
  title: string
  type: string
  due: string
  weighting: string
  status: 'Not submitted' | 'In progress' | 'Submitted'
}

const assignments: Assignment[] = [
  {
    title: 'Essay: Signal Transduction Pathways',
    type: 'Individual assignment',
    due: 'Fri, 23 May, 17:00',
    weighting: '25%',
    status: 'Not submitted',
  },
  {
    title: 'Lab Report 2: Enzyme Kinetics',
    type: 'Group assignment (3–4 students)',
    due: 'Sun, 1 Jun, 17:00',
    weighting: '15%',
    status: 'In progress',
  },
]

type Announcement = {
  title: string
  author: string
  date: string
  preview: string
  isNew: boolean
  initials: string
}

const announcements: Announcement[] = [
  {
    title: 'Updated lecture slides for Week 8',
    author: 'Dr. Sarah Collins',
    date: 'Posted 13 May 2025',
    preview: 'The revised slides for the GPCR signalling lecture are now available in the Weekly Materials section. Key diagrams have been updated to reflect the latest content covered in Tuesday\'s class.',
    isNew: true,
    initials: 'SC',
  },
  {
    title: 'Lab session change – Week 9',
    author: 'Dr. Sarah Collins',
    date: 'Posted 12 May 2025',
    preview: 'Please note that the Thursday lab session in Week 9 has been moved to Friday 23 May at the same time. Room allocation remains unchanged.',
    isNew: true,
    initials: 'SC',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function materialPillVariant(status: MaterialStatus) {
  switch (status) {
    case 'New':         return 'blue' as const
    case 'Updated':     return 'green' as const
    case 'Available':   return 'green' as const
    case 'Coming soon': return 'orange' as const
    default:            return null
  }
}

function assignmentPillVariant(status: Assignment['status']) {
  switch (status) {
    case 'Not submitted': return 'red' as const
    case 'In progress':   return 'orange' as const
    case 'Submitted':     return 'green' as const
  }
}

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

function CardHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-4">
      <h2 className="text-[17px] font-bold text-[#0A254F]">{title}</h2>
      {action && (
        <button className="text-[13px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
          {action}
          <ExternalLink size={12} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

function Divider() {
  return <div className="border-t border-[#EEF2F7]" />
}

function MetaRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[#48607A]">
      <span className="text-[#7B8DA5] shrink-0">{icon}</span>
      {children}
    </div>
  )
}

// ─── Weekly Materials ─────────────────────────────────────────────────────────

function WeekRow({ row }: { row: WeekRow }) {
  return (
    <div
      className="border border-[#E6ECF3] rounded-[14px] p-4"
      style={{ marginBottom: 12 }}
    >
      {/* Week header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded-full">
            {row.week}
          </span>
          <span className="text-[14px] font-semibold text-[#0A254F]">{row.title}</span>
        </div>
        <span className="text-[12px] text-[#7B8DA5]">{row.dates}</span>
      </div>

      {/* Materials grid — 4 columns */}
      <div className="grid grid-cols-4 gap-2">
        {row.materials.map((mat, i) => {
          const variant = materialPillVariant(mat.status)
          return (
            <button
              key={i}
              className="flex flex-col items-start gap-1.5 px-3 py-2.5 rounded-xl border border-[#E6ECF3] bg-[#F9FBFF] hover:bg-[#EAF2FF] hover:border-[#93C5FD] transition-all text-left group"
            >
              <span className="text-[#7B8DA5] group-hover:text-[#2563EB] transition-colors">
                {mat.icon}
              </span>
              <span className="text-[12px] font-medium text-[#0A254F] leading-snug">{mat.label}</span>
              {variant && mat.status ? (
                <StatusPill label={mat.status} variant={variant} />
              ) : (
                <span className="text-[11px] text-[#B4C0D0]">—</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Assignment row ───────────────────────────────────────────────────────────

function AssignmentRow({ a, last, onView }: { a: Assignment; last: boolean; onView?: () => void }) {
  const pillVariant = assignmentPillVariant(a.status)
  return (
    <>
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Icon */}
        <div
          className="shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 40, height: 40, background: '#F3E8FF' }}
        >
          <ClipboardList size={18} strokeWidth={1.75} className="text-[#7C3AED]" />
        </div>

        {/* Title + type */}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-[#0A254F] leading-snug mb-0.5">{a.title}</div>
          <div className="text-[12px] text-[#7B8DA5]">{a.type}</div>
        </div>

        {/* Due */}
        <div className="shrink-0 text-right mr-2">
          <div className="text-[11px] text-[#7B8DA5] mb-0.5">Due</div>
          <div className="text-[12px] font-semibold text-[#0A254F]">{a.due}</div>
        </div>

        {/* Weighting */}
        <div className="shrink-0 text-right mr-2">
          <div className="text-[11px] text-[#7B8DA5] mb-0.5">Weighting</div>
          <div className="text-[12px] font-semibold text-[#0A254F]">{a.weighting}</div>
        </div>

        {/* Status */}
        <div className="shrink-0 mr-3">
          <StatusPill label={a.status} variant={pillVariant} />
        </div>

        {/* Button */}
        <button
          onClick={onView}
          className="shrink-0 flex items-center gap-1.5 text-[12px] font-semibold text-[#1B3FA0] border border-[#D7E0EA] rounded-[10px] px-3 hover:bg-[#EFF6FF] transition-colors"
          style={{ height: 34 }}
        >
          View assignment
          <ChevronRight size={13} strokeWidth={2} />
        </button>
      </div>
      {!last && <Divider />}
    </>
  )
}

// ─── Announcement row ─────────────────────────────────────────────────────────

function AnnouncementRow({ a, last }: { a: Announcement; last: boolean }) {
  return (
    <>
      <div className="flex items-start gap-4 px-6 py-4">
        {/* Unread dot */}
        {a.isNew && (
          <span className="mt-2 w-2 h-2 rounded-full bg-[#2563EB] shrink-0 block" />
        )}
        {!a.isNew && <span className="mt-2 w-2 h-2 shrink-0 block" />}

        {/* Avatar */}
        <div
          className="shrink-0 flex items-center justify-center rounded-full text-white text-[12px] font-bold"
          style={{ width: 36, height: 36, background: '#1B3FA0', marginTop: 2 }}
        >
          {a.initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <span className="text-[14px] font-semibold text-[#0A254F] leading-snug">{a.title}</span>
            <div className="flex items-center gap-2 shrink-0">
              {a.isNew && <StatusPill label="New" variant="blue" />}
              <ChevronRight size={15} strokeWidth={1.75} className="text-[#B4C0D0]" />
            </div>
          </div>
          <div className="text-[12px] text-[#7B8DA5] mb-1.5">
            {a.author} · {a.date}
          </div>
          <p className="text-[13px] text-[#48607A] leading-[20px] line-clamp-2">
            {a.preview}
          </p>
        </div>
      </div>
      {!last && <Divider />}
    </>
  )
}

// ─── Sidebar info row ─────────────────────────────────────────────────────────

function SidebarInfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="text-[#7B8DA5] shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-[#7B8DA5] mb-0.5">{label}</div>
        <div className="text-[13px] font-semibold text-[#0A254F]">{value}</div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseDetail() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Full-width header: pinned, never scrolls ── */}
      <div className="flex-shrink-0 px-8 pt-7 pb-0">
        {/* Back link */}
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#48607A] hover:text-[#2563EB] transition-colors mb-4"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Back to My Courses
        </button>

        {/* Title */}
        <h1
          className="font-bold text-[#0A254F] mb-3"
          style={{ fontSize: 34, lineHeight: '42px', letterSpacing: '-0.02em' }}
        >
          Molecular Biology
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-6">
          <MetaRow icon={<User size={14} strokeWidth={1.75} />}>Dr. Sarah Collins</MetaRow>
          <MetaRow icon={<Building2 size={14} strokeWidth={1.75} />}>School of Biological Sciences</MetaRow>
          <MetaRow icon={<Hash size={14} strokeWidth={1.75} />}>BIOL08019</MetaRow>
          <MetaRow icon={<CalendarDays size={14} strokeWidth={1.75} />}>Semester 2, 2024/25</MetaRow>
        </div>
      </div>

      {/* ── Tab bar: pinned below header ── */}
      <div className="flex-shrink-0 border-b border-[#E6ECF3] px-8">
        <div className="flex items-end gap-0">
          {TABS.map((tab) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative pb-3 px-4 text-[14px] font-medium transition-colors whitespace-nowrap"
                style={{
                  color: active ? '#2563EB' : '#7B8DA5',
                  borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content area: center scrolls, sidebar fixed ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Center column: only this scrolls ── */}
        <div className="flex-1 overflow-y-auto min-w-0">
        <div className="px-8 py-6 flex flex-col gap-5">

          {/* Weekly Materials */}
          <Card>
            <CardHeader title="Weekly Materials" action="View all weekly materials" />
            <Divider />
            <div className="px-6 py-4">
              {weeklyMaterials.map((row, i) => (
                <WeekRow key={i} row={row} />
              ))}
            </div>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader title="Assignments" action="View all assignments" />
            <Divider />
            {assignments.map((a, i) => (
              <AssignmentRow
                key={i}
                a={a}
                last={i === assignments.length - 1}
                onView={a.title === 'Lab Report 2: Enzyme Kinetics' ? () => navigate('/courses/biol08019/assignment') : undefined}
              />
            ))}
          </Card>

          {/* Latest Announcements */}
          <Card>
            <CardHeader title="Latest Announcements" action="View all announcements" />
            <Divider />
            {announcements.map((a, i) => (
              <AnnouncementRow key={i} a={a} last={i === announcements.length - 1} />
            ))}
          </Card>
        </div>

        </div>

        {/* ── Right sidebar: fixed, never scrolls ── */}
        <aside
          className="flex-shrink-0 border-l border-[#E6ECF3] bg-[#F7F9FC] flex flex-col gap-4 overflow-y-auto"
          style={{ width: 320, padding: '24px 16px' }}
        >

          {/* Course Overview */}
          <Card>
            <div className="px-5 pt-5 pb-4">
              <h2 className="text-[15px] font-bold text-[#0A254F] mb-4">Course Overview</h2>
              <div className="flex flex-col divide-y divide-[#EEF2F7]">
                <SidebarInfoRow icon={<BadgeInfo size={14} strokeWidth={1.75} />}   label="Credits"        value="20 credits" />
                <SidebarInfoRow icon={<GraduationCap size={14} strokeWidth={1.75} />} label="Level"        value="Level 8" />
                <SidebarInfoRow icon={<Building2 size={14} strokeWidth={1.75} />}   label="School"         value="School of Biological Sciences" />
                <SidebarInfoRow icon={<BookMarked size={14} strokeWidth={1.75} />}  label="Programme"      value="BSc (Hons) Biology" />
                <SidebarInfoRow icon={<CalendarDays size={14} strokeWidth={1.75} />} label="Course start"  value="20 January 2025" />
                <SidebarInfoRow icon={<CalendarDays size={14} strokeWidth={1.75} />} label="Course end"    value="16 May 2025" />
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#2563EB] border border-[#D7E0EA] rounded-[10px] py-2 hover:bg-[#EAF2FF] transition-colors">
                View course details
                <ExternalLink size={12} strokeWidth={2} />
              </button>
            </div>
          </Card>

          {/* Next Class */}
          <Card>
            <div className="px-5 pt-5 pb-4">
              <h2 className="text-[15px] font-bold text-[#0A254F] mb-3">Next Class</h2>
              <div
                className="rounded-xl p-3 mb-3"
                style={{ background: '#EAF2FF', border: '1px solid #BFDBFE' }}
              >
                <div className="text-[13px] font-semibold text-[#0A254F] mb-1">Molecular Biology Lecture</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <CalendarDays size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>Tomorrow, 15 May 2025</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <Clock size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>10:00 – 11:00</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <MapPin size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>Appleton Tower LT1</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <Users size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>Dr. Sarah Collins</span>
                  </div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#48607A] border border-[#D7E0EA] rounded-[10px] py-2 hover:bg-[#F7F9FC] transition-colors">
                View full schedule
                <ChevronRight size={12} strokeWidth={2} />
              </button>
            </div>
          </Card>

          {/* Recent Updates */}
          <Card>
            <div className="px-5 pt-5 pb-2">
              <h2 className="text-[15px] font-bold text-[#0A254F] mb-1">Recent Updates</h2>
            </div>
            <Divider />
            <div className="px-5 py-1">
              {[
                { icon: <FileText size={14} strokeWidth={1.75} />,    title: 'Lecture slides uploaded',   sub: 'Week 8: Cell Signalling', time: '2h ago',  unread: true },
                { icon: <ClipboardList size={14} strokeWidth={1.75} />, title: 'Seminar materials uploaded', sub: 'Week 8: Cell Signalling', time: '3h ago',  unread: true },
                { icon: <Megaphone size={14} strokeWidth={1.75} />,   title: 'New announcement',          sub: 'Updated lecture slides for Week 8', time: '1d ago', unread: false },
              ].map((u, i, arr) => (
                <div key={i}>
                  <div className="flex items-start gap-3 py-3">
                    <div
                      className="shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                      style={{
                        width: 30, height: 30,
                        background: u.unread ? '#EAF2FF' : '#F1F5F9',
                        color: u.unread ? '#2563EB' : '#7B8DA5',
                      }}
                    >
                      {u.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[#0A254F] leading-snug">{u.title}</div>
                      <div className="text-[11px] text-[#7B8DA5] mt-0.5 truncate">{u.sub}</div>
                    </div>
                    <span className="text-[10px] text-[#B4C0D0] shrink-0 mt-0.5">{u.time}</span>
                  </div>
                  {i < arr.length - 1 && <Divider />}
                </div>
              ))}
            </div>
            <div className="px-5 pb-4 pt-1">
              <button className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#48607A] hover:text-[#0A254F] transition-colors rounded-[10px] py-2"
                style={{ border: '1.5px dashed #D7E0EA' }}>
                View all updates
                <RefreshCw size={12} strokeWidth={2} />
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}

