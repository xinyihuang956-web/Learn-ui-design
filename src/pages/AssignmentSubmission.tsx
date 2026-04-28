import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, ChevronRight,
  FileText, HardDrive, Tag, User, File,
  Check, Shield, Info, Upload, ZoomIn,
  CheckCircle, Calendar, Hash,
} from 'lucide-react'

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
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#072452', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>
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

// ─── Assignment info card ─────────────────────────────────────────────────────

function InfoCard() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16,
      boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
      padding: '18px 24px', marginBottom: 20,
      display: 'flex', alignItems: 'flex-start', gap: 18,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #EAF2FF 0%, #BFDBFE 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FileText size={20} strokeWidth={1.75} color="#2563EB" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F', marginBottom: 2 }}>
          Lab Report 2: Enzyme Kinetics
        </div>
        <div style={{ fontSize: 12, color: '#7B8DA5', marginBottom: 6 }}>Molecular Biology</div>
        <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>
          Investigate enzyme kinetics using spectrophotometric assays and analyse the results.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: '#7B8DA5', marginBottom: 4 }}>Due date</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>Sun, 1 Jun, 17:00</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#7B8DA5', marginBottom: 4 }}>Weighting</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>15%</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#EF4444', background: '#FFECEC', borderRadius: 999, padding: '4px 12px', border: '1px solid #FECACA' }}>
          Not submitted
        </div>
      </div>
    </div>
  )
}

// ─── Right sidebar: Assignment summary ────────────────────────────────────────

const SUMMARY_ITEMS = [
  { icon: <Calendar size={14} strokeWidth={1.75} />, label: 'Due date',        value: 'Sun, 1 Jun, 17:00'       },
  { icon: <Hash size={14} strokeWidth={1.75} />,     label: 'Module code',     value: 'BIOL08019'               },
  { icon: <User size={14} strokeWidth={1.75} />,     label: 'Submission type', value: 'Individual assignment'   },
  { icon: <File size={14} strokeWidth={1.75} />,     label: 'File requirement',value: 'PDF or DOCX, max 20 MB' },
  { icon: <User size={14} strokeWidth={1.75} />,     label: 'Lecturer',        value: 'Dr. Sarah Collins'       },
]

function AssignmentSummaryCard() {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '20px', marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0A254F', marginBottom: 14 }}>Assignment summary</div>
      {SUMMARY_ITEMS.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: i < SUMMARY_ITEMS.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
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

// ─── Right sidebar: Progress ──────────────────────────────────────────────────

const PROG_COLOR: Record<ProgStatus, string> = { 'Completed': '#1F9D55', 'In progress': '#2563EB', 'Pending': '#94A3B8' }

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
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#072452', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
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

// ─── Shared sub-components ────────────────────────────────────────────────────

function PdfBadge() {
  return (
    <div style={{ width: 38, height: 46, borderRadius: 7, flexShrink: 0, background: '#FEE2E2', border: '1px solid #FECACA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <File size={14} strokeWidth={1.75} color="#EF4444" />
      <span style={{ fontSize: 8, fontWeight: 800, color: '#EF4444', letterSpacing: '0.06em' }}>PDF</span>
    </div>
  )
}

function UploadedFileRow({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 12, marginBottom: compact ? 16 : 20 }}>
      <PdfBadge />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F', marginBottom: 2 }}>LAB2_S1234567_AvaBrown.pdf</div>
        <div style={{ fontSize: 11, color: '#7B8DA5' }}>PDF · 1.8 MB · Uploaded today, 10:24</div>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1F9D55', background: '#EAF8F0', borderRadius: 999, padding: '2px 8px', border: '1px solid #86EFAC', flexShrink: 0 }}>
              Pass
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function NavRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
      {left}
      {right}
    </div>
  )
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
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 18px', borderRadius: 10, background: '#072452', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
      {children}
    </button>
  )
}

// ─── Step 1: Submission requirements ─────────────────────────────────────────

const REQUIREMENTS = [
  { icon: <FileText size={16} strokeWidth={1.75} />, label: 'Accepted formats',    value: 'PDF or DOCX'              },
  { icon: <HardDrive size={16} strokeWidth={1.75} />, label: 'Max file size',      value: '20 MB'                    },
  { icon: <Tag size={16} strokeWidth={1.75} />,       label: 'File naming format', value: 'LAB2_S1234567_AvaBrown'   },
  { icon: <User size={16} strokeWidth={1.75} />,      label: 'Submission type',    value: 'Individual assignment'    },
]

const CHECKLIST = [
  'Include your student number on the first page',
  'Combine your report into one file only',
  'Check that all figures and tables are visible',
  'Make sure the file opens correctly before upload',
]

function RequirementStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px' }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>1. Submission requirements</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EAF2FF', borderRadius: 999, padding: '2px 10px' }}>
          In progress
        </span>
      </div>

      {/* Before you begin */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0A254F', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' } as React.CSSProperties}>
          Before you begin
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
          {REQUIREMENTS.map((r, i) => (
            <div key={i} style={{ background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 12, padding: '14px 16px' }}>
              <span style={{ color: '#2563EB', display: 'block', marginBottom: 10 }}>{r.icon}</span>
              <div style={{ fontSize: 11, color: '#7B8DA5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                {r.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>{r.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0A254F', marginBottom: 4 }}>Checklist</div>
        {CHECKLIST.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: i < CHECKLIST.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1F9D55', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <Check size={11} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 13, color: '#48607A', lineHeight: '22px' }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Academic integrity */}
      <div style={{ background: '#EAF2FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
        <Shield size={18} strokeWidth={1.75} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0A254F', marginBottom: 4 }}>Academic integrity</div>
          <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>
            By continuing, you confirm that this work is your own and complies with the course academic integrity policy.
          </div>
        </div>
      </div>

      {/* Replacement note */}
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

const STEP2_CHECKS = [
  { label: 'File format',       value: 'PDF is accepted'      },
  { label: 'File size',         value: '1.8 MB of 20 MB max' },
  { label: 'Naming convention', value: 'LAB2_S1234567_AvaBrown.pdf' },
]

function UploadPreviewStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>2. Upload + Preview</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EAF2FF', borderRadius: 999, padding: '2px 10px' }}>
          In progress
        </span>
      </div>

      {/* Upload dropzone */}
      <div style={{ border: '1.5px dashed #93C5FD', borderRadius: 14, background: '#F8FBFF', height: 92, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', marginBottom: 16 }}>
        <Upload size={22} strokeWidth={1.75} color="#93C5FD" />
        <div style={{ fontSize: 13, color: '#7B8DA5' }}>
          Drag and drop your file here{' '}
          <span style={{ color: '#2563EB', fontWeight: 600 }}>or browse</span>
        </div>
      </div>

      <UploadedFileRow />

      {/* Preview + checks */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        <DocPreview />
        <FileCheckList items={STEP2_CHECKS} />
      </div>

      {/* Info note */}
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

const STEP3_CHECKS = [
  { label: 'File format',       value: 'PDF is accepted'                   },
  { label: 'File size',         value: '1.8 MB of 20 MB max'              },
  { label: 'Naming convention', value: 'LAB2_S1234567_AvaBrown.pdf'        },
  { label: 'Preview available', value: 'First page generated successfully' },
]

function SubmitFinalStep({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>3. Submit</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EAF2FF', borderRadius: 999, padding: '2px 10px' }}>
          In progress
        </span>
      </div>

      {/* Submission ready banner */}
      <div style={{ background: '#EAF8F0', border: '1px solid #86EFAC', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <CheckCircle size={20} strokeWidth={1.75} color="#1F9D55" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F9D55', marginBottom: 2 }}>Submission ready</div>
          <div style={{ fontSize: 13, color: '#48607A' }}>Your file has passed all checks and is ready to submit.</div>
        </div>
      </div>

      {/* File summary */}
      <UploadedFileRow compact />

      {/* Preview + final check */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
        <DocPreview />
        <FileCheckList items={STEP3_CHECKS} />
      </div>

      {/* Declaration */}
      <div style={{ background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: '#072452', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
          <Check size={11} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0A254F', marginBottom: 4 }}>Declaration</div>
          <div style={{ fontSize: 13, color: '#48607A', lineHeight: '20px' }}>
            I confirm that this submission is my own work and that I understand it will be time-stamped upon submission.
          </div>
        </div>
      </div>

      {/* Info note */}
      <div style={{ display: 'flex', gap: 10, padding: '10px 14px', background: '#EAF2FF', border: '1px solid #BFDBFE', borderRadius: 10, marginBottom: 24 }}>
        <Info size={14} strokeWidth={1.75} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: '#48607A', lineHeight: '20px' }}>
          After submission, you will receive a confirmation receipt. If resubmission is allowed, the most recent version before the deadline will be used.
        </span>
      </div>

      <NavRow
        left={<SecondaryBtn onClick={onBack}><ArrowLeft size={15} strokeWidth={1.75} />Back to upload</SecondaryBtn>}
        right={<PrimaryBtn onClick={onSubmit}>Submit assignment<ArrowRight size={15} strokeWidth={1.75} /></PrimaryBtn>}
      />
    </div>
  )
}

// ─── Success state ────────────────────────────────────────────────────────────

const SUCCESS_DETAILS = [
  { label: 'Submission ID', value: 'SUB-2025-BIOL08019-002'         },
  { label: 'Submitted',     value: 'Today, 10:31'                    },
  { label: 'File',          value: 'LAB2_S1234567_AvaBrown.pdf'      },
  { label: 'Course',        value: 'Molecular Biology'               },
  { label: 'Assignment',    value: 'Lab Report 2: Enzyme Kinetics'   },
]

function SuccessState({ onDashboard }: { onDashboard: () => void }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '44px 32px', textAlign: 'center' }}>
      {/* Large check circle */}
      <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#EAF8F0', border: '2px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
        <Check size={30} color="#1F9D55" strokeWidth={2.5} />
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, color: '#0A254F', marginBottom: 6 }}>
        Submission successful
      </div>
      <div style={{ fontSize: 13, color: '#7B8DA5', marginBottom: 28 }}>
        Your assignment has been submitted successfully.
      </div>

      {/* Details */}
      <div style={{ background: '#F9FBFF', border: '1px solid #E6ECF3', borderRadius: 14, padding: '18px 24px', maxWidth: 420, margin: '0 auto 28px', textAlign: 'left' }}>
        {SUCCESS_DETAILS.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '7px 0', borderBottom: i < SUCCESS_DETAILS.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
            <span style={{ fontSize: 12, color: '#7B8DA5', flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0A254F', textAlign: 'right' }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <PrimaryBtn onClick={onDashboard}>Return to Dashboard</PrimaryBtn>
        <SecondaryBtn>View assignment receipt</SecondaryBtn>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssignmentSubmission() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)

  const stepperStatuses = getStepperStatuses(step)
  const progressStatuses = getProgressStatuses(step)

  return (
    <div style={{ padding: '32px 32px 48px' }}>
      {/* Title */}
      <h1 style={{ fontSize: 34, fontWeight: 700, color: '#0A254F', letterSpacing: '-0.02em', marginBottom: 8 }}>
        Assignment Submission
      </h1>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 24 }}>
        <button onClick={() => navigate('/courses')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Courses
        </button>
        <ChevronRight size={13} strokeWidth={1.75} color="#B4C0D0" />
        <button onClick={() => navigate('/courses/biol08019')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Molecular Biology
        </button>
        <ChevronRight size={13} strokeWidth={1.75} color="#B4C0D0" />
        <span style={{ fontSize: 13, color: '#7B8DA5' }}>Assignments</span>
      </div>

      {/* Info card (always visible) */}
      <InfoCard />

      {/* Stepper (always visible) */}
      <Stepper statuses={stepperStatuses} />

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 24, alignItems: 'start' }}>
        {/* Main content — one step at a time */}
        <div>
          {step === 1 && (
            <RequirementStep
              onNext={() => setStep(2)}
              onBack={() => navigate('/courses/biol08019')}
            />
          )}
          {step === 2 && (
            <UploadPreviewStep
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <SubmitFinalStep
              onBack={() => setStep(2)}
              onSubmit={() => setStep('success')}
            />
          )}
          {step === 'success' && (
            <SuccessState onDashboard={() => navigate('/dashboard')} />
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'sticky', top: 72 }}>
          <AssignmentSummaryCard />
          <ProgressCard statuses={progressStatuses} />
        </div>
      </div>
    </div>
  )
}
