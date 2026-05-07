import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, ChevronRight,
  FileText, HardDrive, Tag, User, File,
  Check, Shield, Info, Upload, ZoomIn,
  CheckCircle, Calendar, Hash, BookOpen,
  ClipboardList, Archive, Download, BookMarked, ExternalLink,
} from 'lucide-react'
import { getAssignmentBySlug } from '../data/courses'
import type { AssignmentResource, ResourceIconType } from '../data/courses'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 'success'
type StepStatus = 'completed' | 'active' | 'pending'
type ProgStatus = 'Completed' | 'In progress' | 'Pending'

// ─── Step state helpers ───────────────────────────────────────────────────────

function getStepperStatuses(step: Step): [StepStatus, StepStatus, StepStatus] {
  if (step === 1) return ['active',    'pending',   'pending']
  if (step === 2) return ['completed', 'active',    'pending']
  if (step === 3) return ['completed', 'completed', 'active']
  return             ['completed', 'completed', 'completed']
}

function getProgressStatuses(step: Step): [ProgStatus, ProgStatus, ProgStatus] {
  if (step === 1) return ['In progress', 'Pending',     'Pending']
  if (step === 2) return ['Completed',   'In progress', 'Pending']
  if (step === 3) return ['Completed',   'Completed',   'In progress']
  return             ['Completed',   'Completed',   'Completed']
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Submission requirements', 'Upload + Preview', 'Submit']

const STATUS_TEXT:  Record<StepStatus, string> = { completed: 'Completed', active: 'In progress', pending: 'Pending' }
const STATUS_COLOR: Record<StepStatus, string> = { completed: '#1F9D55',   active: '#2563EB',      pending: '#94A3B8' }
const LABEL_COLOR:  Record<StepStatus, string> = { completed: '#1F9D55',   active: '#0A254F',      pending: '#7B8DA5' }

function StepNode({ status, n }: { status: StepStatus; n: number }) {
  let circle: React.ReactNode
  if (status === 'completed') {
    circle = (
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1F9D55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Check size={16} color="#fff" strokeWidth={2.5} />
      </div>
    )
  } else if (status === 'active') {
    circle = (
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1B3FA0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>
        {n}
      </div>
    )
  } else {
    circle = (
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F1F5F9', border: '2px solid #E6ECF3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#94A3B8' }}>
        {n}
      </div>
    )
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {circle}
      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: LABEL_COLOR[status], textAlign: 'center' }}>
        {STEP_LABELS[n - 1]}
      </div>
      <div style={{ fontSize: 11, color: STATUS_COLOR[status], marginTop: 3 }}>
        {STATUS_TEXT[status]}
      </div>
    </div>
  )
}

function StepLine({ green }: { green: boolean }) {
  return <div style={{ flexShrink: 0, width: 80, height: 2, background: green ? '#1F9D55' : '#E6ECF3', marginTop: 15 }} />
}

function Stepper({ statuses }: { statuses: [StepStatus, StepStatus, StepStatus] }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '20px 40px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <StepNode status={statuses[0]} n={1} />
        <StepLine green={statuses[0] === 'completed'} />
        <StepNode status={statuses[1]} n={2} />
        <StepLine green={statuses[1] === 'completed'} />
        <StepNode status={statuses[2]} n={3} />
      </div>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function NavRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>{left}{right}</div>
}

function SecondaryBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 18px', borderRadius: 10, border: '1px solid #D7E0EA', background: '#fff', color: '#0A254F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
      {children}
    </button>
  )
}

function PrimaryBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 18px', borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
      {children}
    </button>
  )
}

function DocPreview() {
  const lines = [55, 90, 85, 70, 90, 80, 60, 88]
  return (
    <div style={{ position: 'relative', width: 134, flexShrink: 0, height: 176, background: '#fff', border: '1px solid #E6ECF3', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ height: 9, background: '#CBD5E1', borderRadius: 3, margin: '14px 12px 0', width: '55%' }} />
      {lines.map((w, i) => (
        <div key={i} style={{ height: 7, background: '#E2E8F0', borderRadius: 3, margin: '7px 12px 0', width: `${w}%` }} />
      ))}
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 26, height: 26, background: 'rgba(0,0,0,0.32)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ZoomIn size={13} color="#fff" strokeWidth={1.75} />
      </div>
    </div>
  )
}

function FileCheckList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0A254F', marginBottom: 12 }}>File check</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center', padding: '9px 0', borderBottom: i < items.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
          <span style={{ fontSize: 13, color: '#48607A' }}>{item.label}</span>
          <span style={{ fontSize: 12, color: '#7B8DA5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1F9D55', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={10} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1F9D55', background: '#EAF8F0', borderRadius: 999, padding: '2px 8px', border: '1px solid #86EFAC', flexShrink: 0 }}>Pass</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Info card ────────────────────────────────────────────────────────────────

interface AInfo {
  courseSlug: string; courseTitle: string; courseCode: string; lecturer: string
  title: string; description: string; due: string; weighting: string; status: string
  fileFormats: string; maxFileSize: string; namingConvention: string; namingExample: string
  mockFileName: string; mockFileSize: string; submissionId: string; checklist: string[]
  resources: AssignmentResource[]
}

// ─── Resource helpers ─────────────────────────────────────────────────────────

function getResourceIcon(icon: ResourceIconType, size = 15) {
  const p = { size, strokeWidth: 1.75, color: '#2563EB' } as const
  if (icon === 'ClipboardList') return <ClipboardList {...p} />
  if (icon === 'Archive')       return <Archive {...p} />
  if (icon === 'Download')      return <Download {...p} />
  if (icon === 'BookOpen')      return <BookOpen {...p} />
  if (icon === 'BookMarked')    return <BookMarked {...p} />
  return <FileText {...p} />
}

function ResourcesSection({ resources }: { resources: AssignmentResource[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0A254F', marginBottom: 3 }}>Assignment resources</div>
      <div style={{ fontSize: 12, color: '#7B8DA5', marginBottom: 12 }}>
        Review the brief, marking criteria, and supporting materials before you submit.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {resources.map((r) => (
          <div
            key={r.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '11px 13px',
              background: '#F9FBFF',
              border: '1px solid #E6ECF3',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#93C5FD')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#E6ECF3')}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {getResourceIcon(r.icon)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F', marginBottom: 1 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: '#7B8DA5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#2563EB', background: '#EAF2FF', borderRadius: 999, padding: '2px 7px', letterSpacing: '0.03em' }}>{r.type}</span>
              <ExternalLink size={12} strokeWidth={1.75} color="#B4C0D0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompactResourceLinks({ resources }: { resources: AssignmentResource[] }) {
  const top3 = resources.filter(r => ['brief', 'rubric', 'past-example'].includes(r.id))
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '18px 20px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0A254F', marginBottom: 12 }}>Useful resources</div>
      {top3.map((r, i) => (
        <div
          key={r.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 0',
            borderBottom: i < top3.length - 1 ? '1px solid #EEF2F7' : 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {getResourceIcon(r.icon, 13)}
          </div>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#0A254F' }}>{r.title}</span>
          <ExternalLink size={13} strokeWidth={1.75} color="#D7E0EA" />
        </div>
      ))}
    </div>
  )
}

function InfoCard({ info }: { info: AInfo }) {
  const statusColor = info.status === 'In progress' ? '#F97316' : info.status === 'Submitted' ? '#1F9D55' : '#EF4444'
  const statusBg    = info.status === 'In progress' ? '#FFF3E6' : info.status === 'Submitted' ? '#EAF8F0' : '#FFECEC'
  const statusBdr   = info.status === 'In progress' ? '#FDBA74' : info.status === 'Submitted' ? '#86EFAC' : '#FECACA'
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '18px 24px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 18 }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FileText size={20} strokeWidth={1.75} color="#2563EB" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F', marginBottom: 2 }}>{info.title}</div>
        <div style={{ fontSize: 12, color: '#7B8DA5', marginBottom: 6 }}>{info.courseTitle}</div>
        <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>{info.description}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: '#7B8DA5', marginBottom: 4 }}>Due date</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>{info.due}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#7B8DA5', marginBottom: 4 }}>Weighting</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>{info.weighting}</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: statusColor, background: statusBg, borderRadius: 999, padding: '4px 12px', border: `1px solid ${statusBdr}` }}>
          {info.status}
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar cards ────────────────────────────────────────────────────────────

function AssignmentSummaryCard({ info }: { info: AInfo }) {
  const items = [
    { icon: <Calendar size={14} strokeWidth={1.75} />, label: 'Due date',        value: info.due },
    { icon: <Hash size={14} strokeWidth={1.75} />,     label: 'Module code',     value: info.courseCode },
    { icon: <User size={14} strokeWidth={1.75} />,     label: 'Submission type', value: info.fileFormats.split(' ')[0] + ' (individual)' },
    { icon: <File size={14} strokeWidth={1.75} />,     label: 'File requirement', value: `${info.fileFormats}, max ${info.maxFileSize}` },
    { icon: <User size={14} strokeWidth={1.75} />,     label: 'Lecturer',        value: info.lecturer },
  ]
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '20px', marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0A254F', marginBottom: 14 }}>Assignment summary</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: i < items.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
          <span style={{ color: '#7B8DA5', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
          <div>
            <div style={{ fontSize: 11, color: '#7B8DA5', marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0A254F' }}>{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const PROG_COLOR: Record<ProgStatus, string> = { Completed: '#1F9D55', 'In progress': '#2563EB', Pending: '#94A3B8' }

function ProgressCard({ statuses }: { statuses: [ProgStatus, ProgStatus, ProgStatus] }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '20px' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0A254F', marginBottom: 4 }}>Progress</div>
      {statuses.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < 2 ? '1px solid #EEF2F7' : 'none' }}>
          {s === 'Completed' ? (
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1F9D55', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={12} color="#fff" strokeWidth={2.5} />
            </div>
          ) : s === 'In progress' ? (
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1B3FA0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {i + 1}
            </div>
          ) : (
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F1F5F9', border: '1px solid #E6ECF3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#94A3B8', flexShrink: 0 }}>
              {i + 1}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: s === 'Pending' ? '#7B8DA5' : '#0A254F' }}>
              {i + 1}. {STEP_LABELS[i]}
            </div>
            <div style={{ fontSize: 11, color: PROG_COLOR[s], marginTop: 2 }}>{s}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: Submission requirements ─────────────────────────────────────────

function RequirementStep({ info, onNext, onBack }: { info: AInfo; onNext: () => void; onBack: () => void }) {
  const reqs = [
    { icon: <FileText size={16} strokeWidth={1.75} />, label: 'Accepted formats',    value: info.fileFormats },
    { icon: <HardDrive size={16} strokeWidth={1.75} />, label: 'Max file size',      value: info.maxFileSize },
    { icon: <Tag size={16} strokeWidth={1.75} />,       label: 'File naming format', value: info.namingConvention },
    { icon: <User size={16} strokeWidth={1.75} />,      label: 'Submission type',    value: info.fileFormats.includes('PDF') ? 'Individual submission' : 'Group submission' },
  ]
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>1. Submission requirements</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EAF2FF', borderRadius: 999, padding: '2px 10px' }}>In progress</span>
      </div>

      <ResourcesSection resources={info.resources} />

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0A254F', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' } as React.CSSProperties}>
          Before you begin
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
          {reqs.map((r, i) => (
            <div key={i} style={{ background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 12, padding: '14px 16px' }}>
              <span style={{ color: '#2563EB', display: 'block', marginBottom: 10 }}>{r.icon}</span>
              <div style={{ fontSize: 11, color: '#7B8DA5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>{r.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#EAF2FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
        <Shield size={18} strokeWidth={1.75} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0A254F', marginBottom: 4 }}>Academic integrity</div>
          <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>
            By continuing, you confirm that this work is your own and complies with the course academic integrity policy.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#7B8DA5', marginBottom: 24 }}>
        <Info size={13} strokeWidth={1.75} color="#7B8DA5" />
        <span>You may replace your uploaded file until the deadline.</span>
      </div>

      <NavRow
        left={<SecondaryBtn onClick={onBack}><ArrowLeft size={15} strokeWidth={1.75} />Back to assignments</SecondaryBtn>}
        right={<PrimaryBtn onClick={onNext}>Continue to upload<ArrowRight size={15} strokeWidth={1.75} /></PrimaryBtn>}
      />
    </div>
  )
}

// ─── Step 2: Upload + Preview ─────────────────────────────────────────────────

function UploadedFileRow({ info, compact = false }: { info: AInfo; compact?: boolean }) {
  const isZip = info.mockFileName.endsWith('.zip')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 12, marginBottom: compact ? 16 : 20 }}>
      <div style={{ width: 38, height: 46, borderRadius: 7, flexShrink: 0, background: isZip ? '#FEF3C7' : '#FEE2E2', border: `1px solid ${isZip ? '#FDE68A' : '#FECACA'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <File size={14} strokeWidth={1.75} color={isZip ? '#D97706' : '#EF4444'} />
        <span style={{ fontSize: 8, fontWeight: 800, color: isZip ? '#D97706' : '#EF4444', letterSpacing: '0.06em' }}>{isZip ? 'ZIP' : 'PDF'}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F', marginBottom: 2 }}>{info.mockFileName}</div>
        <div style={{ fontSize: 11, color: '#7B8DA5' }}>{isZip ? 'ZIP' : 'PDF'} · {info.mockFileSize} · Uploaded today, 10:24</div>
      </div>
      {!compact && (
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
          <button style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Replace</button>
          <button style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove</button>
        </div>
      )}
    </div>
  )
}

function UploadPreviewStep({ info, onNext, onBack }: { info: AInfo; onNext: () => void; onBack: () => void }) {
  const checks = [
    { label: 'File format',       value: `${info.fileFormats.split(' ')[0]} is accepted` },
    { label: 'File size',         value: `${info.mockFileSize} of ${info.maxFileSize} max` },
    { label: 'Naming convention', value: info.mockFileName },
  ]
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>2. Upload + Preview</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EAF2FF', borderRadius: 999, padding: '2px 10px' }}>In progress</span>
      </div>

      <div style={{ border: '1.5px dashed #93C5FD', borderRadius: 14, background: '#F8FBFF', height: 92, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', marginBottom: 16 }}>
        <Upload size={22} strokeWidth={1.75} color="#93C5FD" />
        <div style={{ fontSize: 13, color: '#7B8DA5' }}>
          Drag and drop your file here{' '}
          <span style={{ color: '#2563EB', fontWeight: 600 }}>or browse</span>
        </div>
      </div>

      <UploadedFileRow info={info} />

      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        <DocPreview />
        <FileCheckList items={checks} />
      </div>

      <div style={{ fontSize: 12, color: '#7B8DA5', background: '#F9FBFF', border: '1px solid #EEF2F7', borderRadius: 10, padding: '10px 14px', marginBottom: 24 }}>
        Only the first page is shown. The full document will be available after submission.
      </div>

      <NavRow
        left={<SecondaryBtn onClick={onBack}><ArrowLeft size={15} strokeWidth={1.75} />Back to requirements</SecondaryBtn>}
        right={<PrimaryBtn onClick={onNext}>Continue to submit<ArrowRight size={15} strokeWidth={1.75} /></PrimaryBtn>}
      />
    </div>
  )
}

// ─── Step 3: Submit Final ─────────────────────────────────────────────────────

function SubmitFinalStep({ info, onBack, onSubmit }: { info: AInfo; onBack: () => void; onSubmit: () => void }) {
  const checks = [
    { label: 'File format',       value: `${info.fileFormats.split(' ')[0]} is accepted` },
    { label: 'File size',         value: `${info.mockFileSize} of ${info.maxFileSize} max` },
    { label: 'Naming convention', value: info.mockFileName },
    { label: 'Preview available', value: 'First page generated successfully' },
  ]
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>3. Submit</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EAF2FF', borderRadius: 999, padding: '2px 10px' }}>In progress</span>
      </div>

      <div style={{ background: '#EAF8F0', border: '1px solid #86EFAC', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <CheckCircle size={20} strokeWidth={1.75} color="#1F9D55" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F9D55', marginBottom: 2 }}>Submission ready</div>
          <div style={{ fontSize: 13, color: '#48607A' }}>Your file has passed all checks and is ready to submit.</div>
        </div>
      </div>

      <UploadedFileRow info={info} compact />

      <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
        <DocPreview />
        <FileCheckList items={checks} />
      </div>

      <div style={{ background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: '#1B3FA0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
          <Check size={11} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0A254F', marginBottom: 4 }}>Declaration</div>
          <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>
            I confirm that this submission is my own work and that I understand it will be time-stamped upon submission.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, padding: '10px 14px', background: '#EAF2FF', border: '1px solid #BFDBFE', borderRadius: 10, marginBottom: 24 }}>
        <Info size={14} strokeWidth={1.75} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: '#48607A', lineHeight: '20px' }}>
          After submission, you will receive a confirmation receipt. If resubmission is allowed, the most recent version before the deadline will be used.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
        <Info size={13} strokeWidth={1.75} color="#7B8DA5" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#7B8DA5' }}>Need to check something before submitting?</span>
        <button style={{ fontSize: 12, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View brief</button>
        <span style={{ fontSize: 12, color: '#D7E0EA' }}>·</span>
        <button style={{ fontSize: 12, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View rubric</button>
      </div>

      <NavRow
        left={<SecondaryBtn onClick={onBack}><ArrowLeft size={15} strokeWidth={1.75} />Back to upload</SecondaryBtn>}
        right={<PrimaryBtn onClick={onSubmit}>Submit assignment<ArrowRight size={15} strokeWidth={1.75} /></PrimaryBtn>}
      />
    </div>
  )
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ info, onDashboard }: { info: AInfo; onDashboard: () => void }) {
  const details = [
    { label: 'Submission ID', value: info.submissionId },
    { label: 'Submitted',     value: 'Today, 10:31' },
    { label: 'File',          value: info.mockFileName },
    { label: 'Course',        value: info.courseTitle },
    { label: 'Assignment',    value: info.title },
  ]
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '44px 32px', textAlign: 'center' }}>
      <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#EAF8F0', border: '2px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
        <Check size={30} color="#1F9D55" strokeWidth={2.5} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0A254F', marginBottom: 6 }}>Submission successful</div>
      <div style={{ fontSize: 13, color: '#7B8DA5', marginBottom: 28 }}>Your assignment has been submitted successfully.</div>

      <div style={{ background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 14, padding: '18px 24px', maxWidth: 420, margin: '0 auto 28px', textAlign: 'left' }}>
        {details.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '7px 0', borderBottom: i < details.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
            <span style={{ fontSize: 12, color: '#7B8DA5', flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0A254F', textAlign: 'right' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <PrimaryBtn onClick={onDashboard}>Return to Dashboard</PrimaryBtn>
        <SecondaryBtn>View assignment receipt</SecondaryBtn>
      </div>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFound({ courseSlug, onBack }: { courseSlug: string; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
      <BookOpen size={40} strokeWidth={1.25} style={{ color: '#D7E0EA' }} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0A254F', margin: 0 }}>Assignment not found</h2>
      <p style={{ fontSize: 14, color: '#7B8DA5', margin: 0 }}>This assignment doesn't exist or the link is incorrect.</p>
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: '#1B3FA0', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer' }}
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to Course
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssignmentSubmission() {
  const navigate = useNavigate()
  const { courseSlug = '', assignmentSlug = '' } = useParams<{ courseSlug: string; assignmentSlug: string }>()
  const [step, setStep] = useState<Step>(1)

  const { course, assignment } = getAssignmentBySlug(courseSlug, assignmentSlug)

  if (!course || !assignment) {
    return <NotFound courseSlug={courseSlug} onBack={() => navigate(`/courses/${courseSlug}`)} />
  }

  const info: AInfo = {
    courseSlug,
    courseTitle: course.title,
    courseCode: course.code,
    lecturer: course.lecturer,
    title: assignment.title,
    description: assignment.description,
    due: assignment.due,
    weighting: assignment.weighting,
    status: assignment.status,
    fileFormats: assignment.fileFormats,
    maxFileSize: assignment.maxFileSize,
    namingConvention: assignment.namingConvention,
    namingExample: assignment.namingExample,
    mockFileName: assignment.mockFileName,
    mockFileSize: assignment.mockFileSize,
    submissionId: assignment.submissionId,
    checklist: assignment.checklist,
    resources: assignment.resources,
  }

  const stepperStatuses = getStepperStatuses(step)
  const progressStatuses = getProgressStatuses(step)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Center: scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <div style={{ padding: '32px 32px 48px' }}>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#0A254F', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Assignment Submission
          </h1>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 24 }}>
            <button onClick={() => navigate('/courses')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Courses
            </button>
            <ChevronRight size={13} strokeWidth={1.75} color="#B4C0D0" />
            <button onClick={() => navigate(`/courses/${courseSlug}`)} style={{ fontSize: 13, color: '#2563EB', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {course.title}
            </button>
            <ChevronRight size={13} strokeWidth={1.75} color="#B4C0D0" />
            <span style={{ fontSize: 13, color: '#7B8DA5' }}>Assignments</span>
          </div>

          <InfoCard info={info} />
          <Stepper statuses={stepperStatuses} />

          {step === 1 && (
            <RequirementStep
              info={info}
              onNext={() => setStep(2)}
              onBack={() => navigate(`/courses/${courseSlug}`)}
            />
          )}
          {step === 2 && (
            <UploadPreviewStep
              info={info}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <SubmitFinalStep
              info={info}
              onBack={() => setStep(2)}
              onSubmit={() => setStep('success')}
            />
          )}
          {step === 'success' && (
            <SuccessState info={info} onDashboard={() => navigate('/dashboard')} />
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid #E6ECF3', background: '#F7F9FC', padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AssignmentSummaryCard info={info} />
        <ProgressCard statuses={progressStatuses} />
        {step !== 1 && step !== 'success' && (
          <CompactResourceLinks resources={info.resources} />
        )}
      </div>
    </div>
  )
}
