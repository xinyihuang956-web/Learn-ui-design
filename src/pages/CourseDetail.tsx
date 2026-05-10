import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, User, Building2, Hash, CalendarDays,
  FileText, Video, BookOpen, ClipboardList, ChevronRight,
  Clock, MapPin, Users, Megaphone, ExternalLink,
  BookMarked, GraduationCap, BadgeInfo, RefreshCw, MessageSquare, X,
} from 'lucide-react'
import StatusPill from '../components/StatusPill'
import {
  getCourseBySlug,
  type MaterialType, type UpdateIconType,
  type CourseWeek, type CourseAssignment, type CourseAnnouncement, type CourseRecentUpdate,
} from '../data/courses'

// ─── Tab ──────────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Weekly Materials', 'Assignments', 'Announcements', 'Reading List', 'Feedback'] as const
type Tab = typeof TABS[number]

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function getMaterialIcon(type: MaterialType) {
  const p = { size: 14, strokeWidth: 1.75 } as const
  switch (type) {
    case 'slides':    return <FileText {...p} />
    case 'seminar':   return <ClipboardList {...p} />
    case 'recording': return <Video {...p} />
    case 'reading':   return <BookOpen {...p} />
  }
}

function getUpdateIcon(type: UpdateIconType) {
  const p = { size: 14, strokeWidth: 1.75 } as const
  switch (type) {
    case 'file':      return <FileText {...p} />
    case 'clipboard': return <ClipboardList {...p} />
    case 'megaphone': return <Megaphone {...p} />
    case 'book':      return <BookOpen {...p} />
    case 'message':   return <MessageSquare {...p} />
  }
}

// ─── Status helpers ───────────────────────────────────────────────────────────

type MaterialStatus = 'New' | 'Updated' | 'Available' | 'Coming soon' | null

function materialPillVariant(status: MaterialStatus) {
  switch (status) {
    case 'New':         return 'blue' as const
    case 'Updated':     return 'green' as const
    case 'Available':   return 'green' as const
    case 'Coming soon': return 'orange' as const
    default:            return null
  }
}

function assignmentPillVariant(status: CourseAssignment['status']) {
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

function Divider() { return <div className="border-t border-[#EEF2F7]" /> }

function MetaRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[#48607A]">
      <span className="text-[#7B8DA5] shrink-0">{icon}</span>
      {children}
    </div>
  )
}

// ─── Weekly Materials ─────────────────────────────────────────────────────────

function WeekRow({ row, onOpen }: { row: CourseWeek; onOpen: (mat: MaterialItem) => void }) {
  return (
    <div className="border border-[#E6ECF3] rounded-[14px] p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded-full">
            {row.week}
          </span>
          <span className="text-[14px] font-semibold text-[#0A254F]">{row.title}</span>
        </div>
        <span className="text-[12px] text-[#7B8DA5]">{row.dates}</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {row.materials.map((mat, i) => {
          const variant = materialPillVariant(mat.status as MaterialStatus)
          return (
            <button
              key={i}
              onClick={() => onOpen({ label: mat.label, type: mat.type })}
              className="flex flex-col items-start gap-1.5 px-3 py-2.5 rounded-xl border border-[#E6ECF3] bg-[#F9FBFF] hover:bg-[#EAF2FF] hover:border-[#93C5FD] transition-all text-left group"
            >
              <span className="text-[#7B8DA5] group-hover:text-[#2563EB] transition-colors">
                {getMaterialIcon(mat.type)}
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

function AssignmentRow({
  a, last, onView,
}: { a: CourseAssignment; last: boolean; onView?: () => void }) {
  const pillVariant = assignmentPillVariant(a.status)
  return (
    <>
      <div className="flex items-center gap-4 px-6 py-4">
        <div
          className="shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 40, height: 40, background: '#F3E8FF' }}
        >
          <ClipboardList size={18} strokeWidth={1.75} className="text-[#7C3AED]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-[#0A254F] leading-snug mb-0.5">{a.title}</div>
          <div className="text-[12px] text-[#7B8DA5]">{a.type}</div>
        </div>
        <div className="shrink-0 text-right mr-2">
          <div className="text-[11px] text-[#7B8DA5] mb-0.5">Due</div>
          <div className="text-[12px] font-semibold text-[#0A254F]">{a.due}</div>
        </div>
        <div className="shrink-0 text-right mr-2">
          <div className="text-[11px] text-[#7B8DA5] mb-0.5">Weighting</div>
          <div className="text-[12px] font-semibold text-[#0A254F]">{a.weighting}</div>
        </div>
        <div className="shrink-0 mr-3">
          <StatusPill label={a.status} variant={pillVariant} />
        </div>
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

function AnnouncementRow({ a, last, onOpen }: { a: CourseAnnouncement; last: boolean; onOpen: (a: CourseAnnouncement) => void }) {
  return (
    <>
      <div
        className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-[#F9FBFF] transition-colors"
        onClick={() => onOpen(a)}
      >
        <span className={`mt-2 w-2 h-2 rounded-full shrink-0 block ${a.isNew ? 'bg-[#2563EB]' : ''}`} />
        <div
          className="shrink-0 flex items-center justify-center rounded-full text-white text-[12px] font-bold"
          style={{ width: 36, height: 36, background: '#1B3FA0', marginTop: 2 }}
        >
          {a.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <span className="text-[14px] font-semibold text-[#0A254F] leading-snug">{a.title}</span>
            <div className="flex items-center gap-2 shrink-0">
              {a.isNew && <StatusPill label="New" variant="blue" />}
              <ChevronRight size={15} strokeWidth={1.75} className="text-[#B4C0D0]" />
            </div>
          </div>
          <div className="text-[12px] text-[#7B8DA5] mb-1.5">{a.author} · {a.date}</div>
          <p className="text-[13px] text-[#48607A] leading-[20px] line-clamp-2">{a.preview}</p>
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

// ─── Recent update row ────────────────────────────────────────────────────────

function RecentUpdateRow({ u, last }: { u: CourseRecentUpdate; last: boolean }) {
  return (
    <>
      <div className="flex items-start gap-3 py-3">
        <div
          className="shrink-0 flex items-center justify-center rounded-lg mt-0.5"
          style={{
            width: 30, height: 30,
            background: u.unread ? '#EAF2FF' : '#F1F5F9',
            color: u.unread ? '#2563EB' : '#7B8DA5',
          }}
        >
          {getUpdateIcon(u.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-[#0A254F] leading-snug">{u.title}</div>
          <div className="text-[11px] text-[#7B8DA5] mt-0.5 truncate">{u.sub}</div>
        </div>
        <span className="text-[10px] text-[#B4C0D0] shrink-0 mt-0.5">{u.time}</span>
      </div>
      {!last && <Divider />}
    </>
  )
}

// ─── Material preview modal ───────────────────────────────────────────────────

interface MaterialItem { label: string; type: MaterialType }

function MaterialPreviewModal({ mat, onClose }: { mat: MaterialItem; onClose: () => void }) {
  const typeLabel: Record<MaterialType, string> = { slides: 'Slides', seminar: 'Seminar sheet', recording: 'Recording', reading: 'Reading' }
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 400, padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#2563EB' }}>
              {getMaterialIcon(mat.type)}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>{mat.label}</div>
              <div style={{ fontSize: 12, color: '#7B8DA5', marginTop: 2 }}>{typeLabel[mat.type]}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5', flexShrink: 0 }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#7B8DA5', marginBottom: 4 }}>Prototype placeholder</div>
          <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>
            This is a prototype placeholder for this resource. In the live system, clicking this would open or download the actual {typeLabel[mat.type].toLowerCase()}.
          </div>
        </div>
        <button onClick={onClose} style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  )
}

// ─── Announcement detail modal ────────────────────────────────────────────────

function AnnouncementModal({ a, onClose }: { a: CourseAnnouncement; onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 480, padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1B3FA0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {a.initials}
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#7B8DA5' }}>{a.author}</div>
              <div style={{ fontSize: 12, color: '#B4C0D0' }}>{a.date}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5', flexShrink: 0 }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0A254F', marginBottom: 12 }}>{a.title}</div>
        <div style={{ fontSize: 13, color: '#48607A', lineHeight: '22px', marginBottom: 24 }}>{a.preview}</div>
        <button onClick={onClose} style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <BookOpen size={40} strokeWidth={1.25} className="text-[#D7E0EA]" />
      <h2 className="text-[22px] font-bold text-[#0A254F]">Course not found</h2>
      <p className="text-[14px] text-[#7B8DA5]">This course doesn't exist or the link is incorrect.</p>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[13px] font-semibold text-white bg-[#1B3FA0] px-5 py-2.5 rounded-[10px] hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to My Courses
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseDetail() {
  const navigate = useNavigate()
  const { courseSlug = '' } = useParams<{ courseSlug: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const course = getCourseBySlug(courseSlug)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CourseAnnouncement | null>(null)

  if (!course) {
    return <NotFound onBack={() => navigate('/courses')} />
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Full-width header: pinned ── */}
      <div className="flex-shrink-0 px-8 pt-7 pb-0">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#48607A] hover:text-[#2563EB] transition-colors mb-4"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Back to My Courses
        </button>

        <h1
          className="font-bold text-[#0A254F] mb-3"
          style={{ fontSize: 34, lineHeight: '42px', letterSpacing: '-0.02em' }}
        >
          {course.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-6">
          <MetaRow icon={<User size={14} strokeWidth={1.75} />}>{course.lecturer}</MetaRow>
          <MetaRow icon={<Building2 size={14} strokeWidth={1.75} />}>{course.school}</MetaRow>
          <MetaRow icon={<Hash size={14} strokeWidth={1.75} />}>{course.code}</MetaRow>
          <MetaRow icon={<CalendarDays size={14} strokeWidth={1.75} />}>{course.semester}</MetaRow>
        </div>
      </div>

      {/* ── Tab bar: pinned ── */}
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

      {/* ── Content area ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Center: scrolls */}
        <div className="flex-1 overflow-y-auto min-w-0">
          <div className="px-8 py-6 flex flex-col gap-5">

            {/* Overview tab */}
            {activeTab === 'Overview' && (
              <>
                <Card>
                  <CardHeader title="Weekly Materials" action="View all weekly materials" />
                  <Divider />
                  <div className="px-6 py-4">
                    {course.weeklyMaterials.map((row, i) => (
                      <WeekRow key={i} row={row} onOpen={setSelectedMaterial} />
                    ))}
                  </div>
                </Card>
                <Card>
                  <CardHeader title="Assignments" action="View all assignments" />
                  <Divider />
                  {course.assignments.map((a, i) => (
                    <AssignmentRow
                      key={a.slug}
                      a={a}
                      last={i === course.assignments.length - 1}
                      onView={() => navigate(`/courses/${courseSlug}/assignments/${a.slug}`)}
                    />
                  ))}
                </Card>
                <Card>
                  <CardHeader title="Latest Announcements" action="View all announcements" />
                  <Divider />
                  {course.announcements.map((a, i) => (
                    <AnnouncementRow key={i} a={a} last={i === course.announcements.length - 1} onOpen={setSelectedAnnouncement} />
                  ))}
                </Card>
              </>
            )}

            {/* Weekly Materials tab */}
            {activeTab === 'Weekly Materials' && (
              <Card>
                <CardHeader title="Weekly Materials" action="View all weekly materials" />
                <Divider />
                <div className="px-6 py-4">
                  {course.weeklyMaterials.map((row, i) => (
                    <WeekRow key={i} row={row} onOpen={setSelectedMaterial} />
                  ))}
                </div>
              </Card>
            )}

            {/* Assignments tab */}
            {activeTab === 'Assignments' && (
              <Card>
                <CardHeader title="Assignments" action="View all assignments" />
                <Divider />
                {course.assignments.map((a, i) => (
                  <AssignmentRow
                    key={a.slug}
                    a={a}
                    last={i === course.assignments.length - 1}
                    onView={() => navigate(`/courses/${courseSlug}/assignments/${a.slug}`)}
                  />
                ))}
              </Card>
            )}

            {/* Announcements tab */}
            {activeTab === 'Announcements' && (
              <Card>
                <CardHeader title="Announcements" action="View all announcements" />
                <Divider />
                {course.announcements.map((a, i) => (
                  <AnnouncementRow key={i} a={a} last={i === course.announcements.length - 1} onOpen={setSelectedAnnouncement} />
                ))}
              </Card>
            )}

            {/* Reading List tab */}
            {activeTab === 'Reading List' && (
              <Card>
                <CardHeader title="Reading List" />
                <Divider />
                <div className="px-6 py-8 text-center">
                  <BookOpen size={36} strokeWidth={1.25} className="text-[#D7E0EA] mx-auto mb-3" />
                  <div className="text-[14px] font-semibold text-[#0A254F] mb-1">Reading list</div>
                  <div className="text-[13px] text-[#7B8DA5]">Course reading materials will appear here in the live system.</div>
                </div>
              </Card>
            )}

            {/* Feedback tab */}
            {activeTab === 'Feedback' && (
              <Card>
                <CardHeader title="Feedback" />
                <Divider />
                <div className="px-6 py-8 text-center">
                  <Megaphone size={36} strokeWidth={1.25} className="text-[#D7E0EA] mx-auto mb-3" />
                  <div className="text-[14px] font-semibold text-[#0A254F] mb-1">Feedback</div>
                  <div className="text-[13px] text-[#7B8DA5]">Assignment feedback and grades will appear here once released.</div>
                  <button
                    onClick={() => navigate('/marks')}
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2563EB] border border-[#D7E0EA] rounded-[10px] px-4 py-2 hover:bg-[#EAF2FF] transition-colors"
                  >
                    View all marks
                    <ChevronRight size={13} strokeWidth={2} />
                  </button>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* Right sidebar: fixed */}
        <aside
          className="flex-shrink-0 border-l border-[#E6ECF3] bg-[#F7F9FC] flex flex-col gap-4 overflow-y-auto"
          style={{ width: 320, padding: '24px 16px' }}
        >
          {/* Course Overview */}
          <Card>
            <div className="px-5 pt-5 pb-4">
              <h2 className="text-[15px] font-bold text-[#0A254F] mb-4">Course Overview</h2>
              <div className="flex flex-col divide-y divide-[#EEF2F7]">
                <SidebarInfoRow icon={<BadgeInfo size={14} strokeWidth={1.75} />}    label="Credits"       value={course.overview.credits} />
                <SidebarInfoRow icon={<GraduationCap size={14} strokeWidth={1.75} />} label="Level"        value={course.overview.level} />
                <SidebarInfoRow icon={<Building2 size={14} strokeWidth={1.75} />}    label="School"        value={course.overview.school} />
                <SidebarInfoRow icon={<BookMarked size={14} strokeWidth={1.75} />}   label="Programme"     value={course.overview.programme} />
                <SidebarInfoRow icon={<CalendarDays size={14} strokeWidth={1.75} />} label="Course start"  value={course.overview.courseStart} />
                <SidebarInfoRow icon={<CalendarDays size={14} strokeWidth={1.75} />} label="Course end"    value={course.overview.courseEnd} />
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
                <div className="text-[13px] font-semibold text-[#0A254F] mb-1">
                  {course.nextClass.title}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <CalendarDays size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>{course.nextClass.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <Clock size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>{course.nextClass.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <MapPin size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>{course.nextClass.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#48607A]">
                    <Users size={13} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span>{course.nextClass.lecturer}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/schedule')}
                className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#48607A] border border-[#D7E0EA] rounded-[10px] py-2 hover:bg-[#F7F9FC] transition-colors"
              >
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
              {course.recentUpdates.map((u, i) => (
                <RecentUpdateRow key={i} u={u} last={i === course.recentUpdates.length - 1} />
              ))}
            </div>
            <div className="px-5 pb-4 pt-1">
              <button
                onClick={() => navigate('/updates')}
                className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#48607A] hover:text-[#0A254F] transition-colors rounded-[10px] py-2"
                style={{ border: '1.5px dashed #D7E0EA' }}
              >
                View all updates
                <RefreshCw size={12} strokeWidth={2} />
              </button>
            </div>
          </Card>
        </aside>
      </div>

      {selectedMaterial && (
        <MaterialPreviewModal mat={selectedMaterial} onClose={() => setSelectedMaterial(null)} />
      )}
      {selectedAnnouncement && (
        <AnnouncementModal a={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />
      )}
    </div>
  )
}
